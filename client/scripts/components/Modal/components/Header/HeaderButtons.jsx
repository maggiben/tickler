// @flow

///////////////////////////////////////////////////////////////////////////////
// @file         : HeaderButtons.jsx                                         //
// @summary      : Header buttons                                            //
// @version      : 1.0.0                                                     //
// @project      : tickelr                                                   //
// @description  :                                                           //
// @author       : Benjamin Maggi                                            //
// @email        : benjaminmaggi@gmail.com                                   //
// @date         : 18 Nov 2017                                               //
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

import {
  nest,
  pure,
  branch,
  compose,
  withProps,
  renderNothing,
  renderComponent,
  onlyUpdateForKeys
} from 'recompose';
import Style from './Header.css';
import classNames from 'classnames';
import React, { Component } from 'react';

const Button = (props) => React.createElement('button', { ...props });
const Icon = (props) => React.createElement('span', { ...props });

const Close = (props) =>
  <Button className={ props.className } onClick={ props.actions.close }>
    <Icon>&times;</Icon>
  </Button>;

const Alert = (props) =>
  <Button { ...props }>
    <Icon>&quest;</Icon>
  </Button>;

const Quest = (props) =>
  <Button onClick={ props.actions.help } { ...props }>
    <Icon>&quest;</Icon>
  </Button>;

/*
 * conditional state render
 * inspiration: https://blog.bigbinary.com/2017/09/12/using-recompose-to-build-higher-order-components.html
 */
const isMedia = ({ options: { type }}) => (/media/i.test(type));
const isAlert = ({ options: { type }}) => (/alert/i.test(type));
const isQuest = ({ options: { type }}) => (/quest/i.test(type));

const conditionalRender = (states) =>
  compose(...states.map(state =>
    branch(state.when, renderComponent(state.then))
  ));

export default compose(
  pure,
  conditionalRender([
    { name: 'media', when: isMedia, then: Close },
    { name: 'alert', when: isAlert, then: Alert },
    { name: 'quest', when: isQuest, then: Quest }
  ])
)(renderNothing);