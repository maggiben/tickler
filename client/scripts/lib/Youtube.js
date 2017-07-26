///////////////////////////////////////////////////////////////////////////////
// @file         : Youtube.js                                                //
// @summary      : Youtube Library                                           //
// @version      : 0.0.1                                                     //
// @project      : tickelr                                                   //
// @description  :                                                           //
// @author       : Benjamin Maggi                                            //
// @email        : benjaminmaggi@gmail.com                                   //
// @date         : 13 Feb 2017                                               //
// @license:     : MIT                                                       //
// ------------------------------------------------------------------------- //
//                                                                           //
// Copyright 2017 Benjamin Maggi <benjaminmaggi@gmail.com>                   //
//                                                                           //
//                                                                           //
// License:                                                                  //
// Permission is hereby granted, free of charge, to any person obtaining a   //
// copy of this software and associated documentation files                  //
// (the "Software"), to deal in the Software without restriction, including  //
// without limitation the rights to use, copy, modify, merge, publish,       //
// distribute, sublicense, and/or sell copies of the Software, and to permit //
// persons to whom the Software is furnished to do so, subject to the        //
// following conditions:                                                     //
//                                                                           //
// The above copyright notice and this permission notice shall be included   //
// in all copies or substantial portions of the Software.                    //
//                                                                           //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS   //
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF                //
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.    //
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY      //
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,      //
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE         //
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                    //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

import async from 'async';
import axios from 'axios';
import ytdl from 'ytdl-core';
import Stream from 'stream';
import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';
import { EventEmitter } from 'events';

///////////////////////////////////////////////////////////////////////////////
// create single EventEmitter instance                                       //
///////////////////////////////////////////////////////////////////////////////
class YoutubeEvents extends EventEmitter {
  constructor(...args) {
    super(...args);
  }
}

const youtubeEvents = new YoutubeEvents();

export default class Youtube {
  constructor({apiKey, options = {}}) {
    this.apiKey = apiKey;
    this.axios = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      paramsSerializer: this.serializer,
      params: {
        key: this.apiKey,
        part: 'id,snippet,contentDetails,status',
        maxResults: 50,
        pageToken: null
      }
    });

    this.axios.interceptors.response.use(function (response) {
      const { params } = response.config;
      const { pageInfo, items } = response.data;
      if (Array.isArray(params.id) && pageInfo.resultsPerPage !== params.id.length) {
        const itemIds = items.map(item => item.id);
        const missing = params.id.filter(id => !itemIds.includes(id));
        console.error('id skipped', missing);
      }
      return response;
    }, function (error) {
      // Do something with response error
      return Promise.reject(error);
    });

    this.options = options;
    this.events = youtubeEvents;//new YoutubeEvents();
  }

  serializer (params) {
    params = Object.assign({}, params);
    const { id } = params;
    if (Array.isArray(id) && id.length) {
      params.id = id.join(',');
      params.maxResults = id.length;
    } else if (id && id.length) {
      params.maxResults = id.split(',').length;
    }
    // clean null undefined
    const entries = Object.entries(params).filter(param => param.slice(-1).pop() != null);
    const searchParams = new URLSearchParams(entries);
    return searchParams.toString();
  }

  async getVideos (id) {
    const { maxResults } = this.axios.defaults.params;
    const params = {};
    const fetch = (value, index) => {
      params.id = id.slice(index * maxResults, index * maxResults + maxResults);
      return this.axios.get('/videos', { params })
      .then(response => response.data.items)
      .catch(error => {
        console.error(error);
        return error;
      });
    };
    const length = Math.ceil(id.length / maxResults);
    const items = Array.from({ length }, fetch);
    const videos = await Promise.all(items);
    return videos.reduce((videos, items) => videos.concat(items), []);
  }

  async getPlayList (id) {
    const params = { id };
    return await this.axios.get('/playlists', { params }).then(response => response.data);
  }

  async getPlayListItems (playlistId) {
    // const schema = ApiProperties.schemas.PlaylistItemListResponse;
    const params = { playlistId };
    const playlistItems = [];
    do {
      try {
        const result = await this.axios.get('/playlistItems', { params }).then(response => response.data);
        const { items, nextPageToken } = result;
        playlistItems.push(...items);
        params.pageToken = nextPageToken;
      } catch (error) {
        console.error(error);
        break;
      }
    } while(params.pageToken);
    return playlistItems;
  }

  trackProgress = (video, size) => {
    let dataRead = 0;
    return data => {
      dataRead += data.length;
      let progress = dataRead / size;
      return this.events.emit('progress', { video, progress });
    };
  }

  async downloadVideo(video) {
    if(!this.options.saveTo) {
      return Promise.reject(false);
    }
    console.debug('downloadVideo: ', video.id);
    let uri = `http://www.youtube.com/watch?v=${video.id}`;
    let fileName = path.resolve(this.options.saveTo, sanitize(video.title));
    let fileStream = fs.createWriteStream(fileName);
    return new Promise((resolve, reject) => {
      let yt = ytdl(uri, 'audioonly');
      yt.on('error', error => {
        this.events.emit('error', {video, error});
        return reject(error);
      });

      yt.on('info', info => {
        this.events.emit('info', {video, info});
      });

      yt.on('response', response => {
        let size = response.headers['content-length'];
        yt.pipe(fileStream);
        // Keep track of progress.
        yt.on('data', this.trackProgress(video, size));

        yt.on('end', () => {
          this.events.emit('finish', {video, fileName});
          return resolve(fileName);
        });
      });
      this.events.once('abort', () => {
        console.log('abort download');
        yt.end();
        fileStream.end();
        return reject();
      });
    });
  }
}
