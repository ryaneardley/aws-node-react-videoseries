// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './Root';

injectTapEventPlugin();

ReactDOM.render(
  <Root />,
  document.getElementById('app'),
);
