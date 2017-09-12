// @flow

///////////////////////////////////////////////////////////////////////////////
// @file         : ContextMenu.js                                            //
// @summary      : Context menu class                                        //
// @version      : 0.0.1                                                     //
// @project      : tickelr                                                   //
// @description  :                                                           //
// @author       : Benjamin Maggi                                            //
// @email        : benjaminmaggi@gmail.com                                   //
// @date         : 02 Sep 2017                                               //
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

import { remote } from 'electron';
const { Menu, MenuItem } = remote;

export class ContextMenu {
  menu: any;
  constructor (template?: Array<Object>) {
    this.menu = template ? Menu.buildFromTemplate(template) : new Menu();
    // window.addEventListener('contextmenu', this.handleMenu, false);
  }

  handleMenu = event => {
    event.preventDefault();
    this.menu.popup(remote.getCurrentWindow());
  }
}

export const buildContextMenu = function (template: Array<Object>) {
  return Menu.buildFromTemplate(template);
};

export function buildContextMenuXX () {
  
  const menu = new Menu();

  // Build menu one item at a time, unlike
  menu.append(new MenuItem ({
    label: 'MenuItem1',
    click() { 
       console.log('item 1 clicked')
    }
  }))

  menu.append(new MenuItem({type: 'separator'}))
  menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))
  menu.append(new MenuItem ({
    label: 'MenuItem3',
    click() {
       console.log('item 3 clicked')
    }
  }))

  // Prevent default action of right click in chromium. Replace with our menu.
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
  }, false)
}
