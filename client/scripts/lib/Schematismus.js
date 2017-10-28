// @flow

///////////////////////////////////////////////////////////////////////////////
// @file         : Schematismus.js                                           //
// @summary      : JSON Schema utilities and extensions                      //
// @version      : 0.0.1                                                     //
// @project      : N/A                                                       //
// @description  : Miscelaneus JSON Schema utilitie                          //
// @author       : Benjamin Maggi                                            //
// @email        : benjaminmaggi@gmail.com                                   //
// @date         : 27 Oct 2017                                               //
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
import fs from 'fs';
import Ajv from 'ajv';

const get = (o, path) => path.split('.').reduce((o = {}, key) => o[key], o);
const ajv = new Ajv({
  formats: {
    path: {
      type: 'string',
      validate(data) {
        return path.isAbsolute(data);
      }
    }
  },
  allErrors: true,
  useDefaults: true,
});

export const numberFormats = {
  'uint32': {
    validate(data) { return Number.isInteger(data) },
    type: 'number'
  },
  'int32': {
    validate(data) { return Number.isInteger(data) },
    type: 'number'
  },
  'uint64': {
    validate(data) { return Number.isInteger(data) },
    type: 'number'
  },
  'int64': {
    validate(data) { return Number.isInteger(data) },
    type: 'number'
  },
  'double': {
    validate(data) { return Number.isFinite(data) },
    type: 'number'
  }
};

export const versionRegExp = {
  'semver': new RegExp(/^[0-9]+\.[0-9]+[0-9+a-zA-Z\.\-]+$/)
};

export const uuidRegExp = {
  'v1': new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
  'v2': new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
  'v3': new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
  'v4': new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
  'v5': new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
};

export const keywordValidator = {
  'resolve': {
    type: 'string',
    modifying: true,
    validate: function (
      schemaParameterValue,
      validatedParameterValue,
      validationSchemaObject,
      currentDataPath,
      validatedParameterObject,
      validatedParameter,
      rootData
    ) {
      try {
        return (schemaParameterValue) ? validatedParameterObject[validatedParameter] = getPath(validatedParameterValue) : true;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  'exists': {
    type: 'string',
    modifying: true,
    validate: function (
      schemaParameterValue,
      validatedParameterValue,
      validationSchemaObject,
      currentDataPath,
      validatedParameterObject,
      validatedParameter,
      rootData
    ) {
      try {
        return fs.statSync(validatedParameterValue)[schemaParameterValue.type]();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
};