/* @flow */

import type { FileState, TraceState, CategoryState, ReduxAction } from '../types';
import { UPLOAD, TRACE, CATEGORIZE } from '../types';
import CSV from 'csv-parse/lib/sync';

function fileUpload(reader: FileReader) {
  const data = CSV(reader.result, {auto_parse: true});
  const header = data.shift().map(v => ({label: v, key: v}));
  const keyedData = data.map(d => {
    let bag = {};
    for(var i = 0; i < header.length; i++) {
      bag[header[i].key] = d[i];
    }
    return bag;
  });
  return {
    data: {
      keys: header,
      rows: keyedData,
    },
  }
}

export default {
  file: (state: FileState = {}, action: ReduxAction) => {
    switch (action.type) {
      case UPLOAD:
        const f = fileUpload(action.reader);
        return {
          ...state,
          ...f,
        };
      default:
        return {
          ...state
        };
    }
  },
  trace: (state: TraceState = {traced:false}, action: ReduxAction) => {
    switch (action.type) {
      case TRACE:
        return {
          ...state,
          traced: true,
        }
      default:
        return state;
    }
  },
  categorize: (state: CategoryState = {fields: {}}, action: ReduxAction) => {
    switch (action.type) {
      case CATEGORIZE:
        var oldState = state;
        oldState.fields[action.field] = action.category;
        return oldState;
      default:
        return state;
    }
  }
};
