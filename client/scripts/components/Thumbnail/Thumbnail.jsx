///////////////////////////////////////////////////////////////////////////////
// @file         : Thumbnail.jsx                                             //
// @summary      : Thumbnail component                                       //
// @version      : 1.0.0                                                     //
// @project      : tickelr                                                   //
// @description  :                                                           //
// @author       : Benjamin Maggi                                            //
// @email        : benjaminmaggi@gmail.com                                   //
// @date         : 17 Nov 2017                                               //
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

import Style from './Thumbnail.css';
import classNames from 'classnames';
import React, { Component } from 'react';


const Thumbnail = ({ title, image, duration, stats }) =>
  <div className={ Style.thumbnail }>
    <a href="#">
      <div className={ Style.overlay }>
        <div className={ Style.stats }><i className={ Style.icon }>grade</i>&nbsp;<span className={ Style.text }>{ stats }</span></div>
        <div className={ Style.duration }><i className={ Style.icon }>alarm</i>&nbsp;&nbsp;<span className={ Style.text }>{ duration }</span></div>
        <div className={ Style.play }><i className={ Style.icon }>play_arrow</i></div>
      </div>
      <img src={ image } />
    </a>
  </div>;

export default Thumbnail;