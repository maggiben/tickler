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


const Box = ({ type, children }) =>
  <section className={ classNames( Style.overlayPop, type ) }>
    { children }
  </section>;

const BoxIcon = ({ type, icon, children }) =>
  <Box type={ type }>
    <i className={ Style.icon }>{ icon }</i>
    { children }
  </Box>;

const BoxLabel = ({ type, icon, label }) =>
  <BoxIcon type={ type } icon={ icon }>
    <span className={ Style.label }>{ label }</span>
  </BoxIcon>;

const BoxAction = ({ type, action: [ icon, handler ] }) =>
  <BoxIcon type={ type } icon={ icon } />;

const Thumbnail = ({ type, image, duration, stats, action, style }) => {
  return (<div className={ Style.thumbnail }>
    <a className={ Style.link } href="#">
      <div className={ Style.overlay }>
        <BoxLabel type={ Style.stats } icon="grade" label={ stats }></BoxLabel>
        <BoxLabel type={ Style.duration } icon="alarm" label={ duration }></BoxLabel>
        <BoxAction type={ Style.action } action={ action }></BoxAction>
      </div>
      <img src={ image } className={ classNames(style, Style.image ) }/>
    </a>
  </div>);
};

export default Thumbnail;
