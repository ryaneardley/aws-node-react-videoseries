// @flow

export type FileState = {
  data?: string,
};

export type TraceState = {
  data?: string,
};

export const UPLOAD = 'UPLOAD';
export type UPLOAD_TYPE = 'UPLOAD';

export const TRACE = 'TRACE';
export type TRACE_TYPE = 'TRACE';

export const CATEGORIZE = 'CATEGORIZE';
export type CATEGORIZE_TYPE = 'CATEGORIZE';

export type ReduxAction =
    { type: UPLOAD_TYPE, reader: FileReader }
  | { type: CATEGORIZE_TYPE, field: string, category: string }
  | { type: TRACE_TYPE }
  | { type: '' }
  ;
