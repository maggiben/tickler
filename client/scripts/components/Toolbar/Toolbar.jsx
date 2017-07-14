///////////////////////////////////////////////////////////////////////////////
// @file         : Toolbar.jsx                                               //
// @summary      : Toolbar component                                         //
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

import path from 'path';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as Actions from 'actions/Player';

import './Toolbar.css';

import { coverflow, equalizer, levels } from '../../../../assets/images';

const images = { coverflow, equalizer, levels };

function mapStateToProps(state) {
  return {
    toolbar: state.Player
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

const Toolbar = (props) =>
  <ul className="toolbar">{Object.keys(props.toolbar.toJS()).map((button, index) => {
    return (
      <li className="radio-button" key={index}>
        <input
          type="radio"
          name="toolbar"
          id={button}
          value={button}
          checked={props.toolbar[button]}
          onChange={event => {
            let { value } = event.target;
            let { actions, toolbar } = props;
            let options = Object.keys(toolbar.toJS()).reduce((previous, option) => {
              previous[option] = (option === value);
              return previous;
            }, {});
            actions.toolbarOptions(options);
          }}
        />
        <label className="radio-button" htmlFor={button}>
        <img src={images[button]}></img>
        </label>
      </li>);
    })
  }</ul>

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
