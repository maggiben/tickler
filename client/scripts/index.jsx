import path from 'path';
import React from 'react';
import { render } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router';
import styles from '../styles/main.css';

import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Video from './components/Video';
import Player from './components/Player';
import List from './components/List';
import Cpu from './components/Cpu';
import Time from './lib/Time';
import Youtube from './lib/Youtube';
const youtube = new Youtube('AIzaSyAPBCwcnohnbPXScEiVMRM4jYWc43p_CZU');

import _ from 'lodash';

// In renderer process (web page).
import { remote, ipcRenderer } from 'electron';

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

const songs = [{
  "title": "Spiderwebs",
  "duration": "4:28",
  "stars": 2
}, {
  "title": "Excuse Me Mr.fasdfasdfasdfasdfasdfadsf dfasdf adfasdfasdf",
  "duration": "3:04",
  "stars": 3
}, {
  "title": "Just a Girl",
  "duration": "3:28",
  "stars": 1
}, {
  "title": "Happy Now?",
  "duration": "3:43",
  "stars": 2
}, {
  "title": "Different People",
  "duration": "4:34",
  "stars": 3
}, {
  "title": "Hey You!",
  "duration": "3:34",
  "stars": 4
}, {
  "title": "The Climb",
  "duration": "6:37",
  "stars": 5
}, {
  "title": "Sixteen",
  "duration": "3:21",
  "stars": 0
}, {
  "title": "Sunday Morning",
  "duration": "4:33",
  "stars": 0
}, {
  "title": "Don't Speak",
  "duration": "4:23"
}, {
  "title": "You Can Do It",
  "duration": "4:13",
  "stars": 4
}, {
  "title": "World Go 'Round",
  "duration": "4:09"
}, {
  "title": "End It on This",
  "duration": "3:45"
}, {
  "title": "Tragic Kingdom",
  "duration": "5:31",
  "stars": 5
}]

export default class App extends React.Component {
  state = {
    config: {
      dependencies: {}
    },
    songs: [path.resolve('media/FurElise.ogg')],
    playList: new Array()
  }

  async getVideos () {
    let playList = await youtube.getPlayListItems('PLF84D7E86122C6407');
    let ids = playList.map(item => item.snippet.resourceId.videoId);
    let {items} = await youtube.getVideos(ids);
    return items;
  }

  componentDidMount() {
    console.log('componentDidMount')
    ipcRenderer.once('config', (event, data) => {
      this.setState(prevState => ({
        config: data
      }));
    });

    this.getVideos()
    .then(videos => {
      console.log('videos: ', videos)


        this.setState({
          playList: videos.map(video => {
            let time = new Time(video.contentDetails.duration);
            return {
              title: video.snippet.title,
              duration: time.toTime(),
              id: video.id,
              thumbnails: video.thumbnails
            };
          })
        });


    });

    /*youtube.getPlayListItems('PLA70D07FB6C624D3A')
    .then(items => {
      let videoIds = items.map(item => item.snippet.resourceId.videoId);
      youtube.getVideos(videoIds)
      .then(response => response.items)
      .then(videos => {
        console.log(videos)
        this.setState({
          playList: videos.map(video => {
            let time = new Time(video.contentDetails.duration);
            return {
              title: video.snippet.title,
              duration: time.toTime(),
              id: video.id,
              thumbnails: video.thumbnails
            };
          })
        });
      });

    });*/
  }

  open () {
    let files = remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
    this.setState({
      songs: files
    });
  }

  getDependencies () {
    return (
      <table>
        <thead>
          <tr>
            <th>Dependency</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.state.config.dependencies).map(dependency => {
            return (
              <tr key={dependency}>
                <td>{dependency}</td>
                <td>{this.state.config.dependencies[dependency]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  showDependencies () {
    let browserWindow = window.open(null, null, 'width=320,height=200');
    let html = ReactDOMServer.renderToStaticMarkup(this.getDependencies())
    //browserWindow.eval('document.body.innerHTML = "<table><thead><tr><th>Dependency</th><th>Version</th></tr></thead><tbody><tr><td>codemirror</td><td>^5.22.0</td></tr><tr><td>electron</td><td>^1.4.13</td></tr><tr><td>electron-window-state</td><td>^4.0.1</td></tr><tr><td>howler</td><td>^2.0.2</td></tr><tr><td>node-fetch</td><td>^1.6.3</td></tr><tr><td>react</td><td>^15.4.1</td></tr><tr><td>react-codemirror</td><td>^0.3.0</td></tr><tr><td>react-dom</td><td>^15.4.1</td></tr><tr><td>react-router</td><td>^3.0.0</td></tr><tr><td>react-tap-event-plugin</td><td>^2.0.1</td></tr><tr><td>wavesurfer.js</td><td>^1.2.8</td></tr></tbody></table>"')
    browserWindow.eval('document.body.innerHTML = "'+html+'"')
    console.log(html)
  }

  /*
    <div className="btn-group">
      <button type="button" className="btn btn-outline-primary" onClick={this.showDependencies.bind(this)}>▷</button>
      <button type="button" className="btn btn-outline-primary" onClick={this.open.bind(this)}>📂</button>
      <li className="list-group-item"><Link to="/player" className={styles.boxyThing}>Player</Link></li>
    </div>
  */
  render () {
    return (
      <div className="page">
        <Header />
        <Toolbar></Toolbar>
        <div className="page-content">
          <div className="list">
            <List list={this.state.playList} />
          </div>
          <main>
            {this.props.children}
          </main>
        </div>
        <Player songs={this.state.songs}></Player>
      </div>
    );
  }
};
