/* @flow */

import { UPLOAD, TRACE, CATEGORIZE } from '../types';

export const upload = (reader: FileReader) => {
  return {
    type: UPLOAD,
    reader
  };
}

export const trace = () => {
  return {
    type: TRACE
  };
}

export const categorize = (field: string, category: string) => {
  return {
    type: CATEGORIZE,
    field,
    category,
  };
}
