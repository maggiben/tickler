///////////////////////////////////////////////////////////////////////////////
// @file         : index.jsx                                                 //
// @summary      : Application entry point                                   //
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

import { remote, ipcRenderer, app } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router';
import 'styles/main.css';
import styles from './Main.css';
import { Header, Toolbar, Player, List, CoverFlow, Equalizer, DragDrop } from '../../components';

export default class Main extends React.Component {
  state = {
    config: {
      dependencies: {}
    }
  };

  constructor (context) {
    super(context);
    window.context = context;
  }
  
  componentDidMount() {
    ipcRenderer.once('config', (event, config) => {
      console.debug(config);
      this.setState(prevState => ({
        config: config
      }));
    });
  }

  render () {
    return (
      <div className="page">
        <Header /> 
        <Toolbar />
        <CoverFlow />
        <Equalizer />
        <div className="page-content">
          <List className="list">>
            { this.props.children }
          </List>
        </div>
        <Player />
      </div>
    );
  }
};