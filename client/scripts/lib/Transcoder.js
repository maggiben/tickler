// @flow

///////////////////////////////////////////////////////////////////////////////
// @file         : Transcoder.js                                             //
// @summary      : FFmpeg media transcoder                                   //
// @version      : 1.0.0                                                     //
// @project      : N/A                                                       //
// @description  : N/A                                                       //
// @author       : Benjamin Maggi                                            //
// @email        : benjaminmaggi@gmail.com                                   //
// @date         : 16 Oct 2017                                               //
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

/*
 * Inspiration:
 * https://github.com/jameskyburz/youtube-audio-stream
 *
 */

import fs from 'fs';
import path from 'path';
import Stream from 'stream';
import FFmpeg from 'fluent-ffmpeg';
import camelCase from 'lodash/camelCase';
import { MediaElementEx } from './MediaSourceEx';

const presets = {
  mp3: ({ bitrate = 128, frequency = 44100, channels = 2 } = {}) => command => {
    return command
      .format('mp3')
      .audioCodec('libmp3lame')
      .audioBitrate(bitrate)
      .audioFrequency(frequency)
      .audioChannels(channels)
      .output('out.mp3');
  }
};

const getPreset = function ({ output }) {
  const { format, file } = output;
  const presets = {
    mp3(command) {
      const { bitrate = 128, frequency = 44100, channels = 2 } = output;
      return command
        .format('mp3')
        .audioCodec('libmp3lame')
        .audioBitrate(bitrate)
        .audioFrequency(frequency)
        .audioChannels(channels)
        .output('out.mp3');
    }
  };
  return presets[format];
};

window.qaq = function(
  element = document.getElementById('audioElement'),
  stream = fs.createReadStream(path.resolve(process.cwd(), 'audio.mp3')),
  format = 'audio/mpeg'
) {
  const mediaElementEx = new MediaElementEx(element, stream, format);
}

export default class Transcoder {

  constructor(stream) {
    if (!(stream instanceof Stream.Readable)) {
      throw new Error('Invalid input stream');
    }
    this.stream = stream;
    this.command = new FFmpeg(this.stream);
    this.addListeners(this.command);
  }

  getPreset(output) {
    const { format, file } = output;
    const presets = {
      mp3(command) {
        const { bitrate = 128, frequency = 44100, channels = 2 } = output;
        return command
          .format('mp3')
          .audioCodec('libmp3lame')
          .audioBitrate(bitrate)
          .audioFrequency(frequency)
          .audioChannels(channels)
          .output(file);
      }
    };
    return presets[format];
  }
  /*
   * Transcode from stream
   * @param {options} FFmpeg command configuration
   */
  async encode(options) {
    const { input, output } = options;
    const preset = this.getPreset(output);
    this.command.preset(preset);
    this.command.run();
    return this.command;
  }

  encodeXXX(options) {
    const { stream } = this;
    const { input, output } = options;
    console.log('encode options', options, typeof stream, stream instanceof Stream.Readable);
    if (!(stream instanceof Stream.Readable)) {
      throw new Error('Invalid input stream');
    }
    const command = new FFmpeg(stream);
    // this.addListeners(command);
    command.preset(presets.mp3())
      .on('start', cmd => console.log('Spawned Ffmpeg with command: ' + cmd))
      // .on('codecData', data => console.log('Input is ', data.audio, ' audio ', 'with ', data.video, ' video'))
      // .on('error', error => console.error(error))
      .on('progress', progress => console.log('progress', progress))
      .on('end', () => console.log('end conversion!'));

    command.run();
    // this.play(
    //   document.getElementById('audioElement'),
    //   stream,
    //   options.input.format.type
    // );
    return command;
  }

  play(
    element = document.getElementById('audioElement'),
    stream = fs.createReadStream(path.resolve(process.cwd(), 'audio.mp3')),
    format = 'audio/mpeg'
  ) {
    const mediaElementEx = new MediaElementEx(element, stream, format);
  }

  getListeners(command = this.command) {
    return {
      end: [ command.once, function onEnd() { console.log('end conversion!') } ],
      error: [ command.once, function onError(error) { console.error(error) } ],
      start: [ command.once, function onStart(args) { console.log('Spawned Ffmpeg with arguments: ' + args) } ],
      progress: [ command.on, function onProgress(progress) { console.log('progress', progress) } ],
      codecData: [ command.once, function onCodecData(data) { console.log('Input is ', data.audio, ' audio ', 'with ', data.video, ' video') } ],
    };
  }

  addListeners(command = this.command) {
    const listeners = this.getListeners(command);
    return Object.entries(listeners).map(([listener, [ func, handler ]]) => {
      return func.apply(command, [ listener, handler ]);
    });
  }

  probe(index = 0) {
    return new Promise((resolve, reject) => {
      return this.command.ffprobe(index, (error, data) => (error ? reject(error) : resolve(data)));
    });
  }
}



    // return command
    //   .on('start', cmd => console.log('Spawned Ffmpeg with command: ' + cmd))
    //   .on('codecData', data => console.log('Input is ', data.audio, ' audio ', 'with ', data.video, ' video'))
    //   .on('error', error => console.error(error))
    //   .on('progress', progress => console.log('progress', progress))
    //   .on('end', () => console.log('end conversion!'));
