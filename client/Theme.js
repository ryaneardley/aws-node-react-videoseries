// @flow

import PropTypes from 'prop-types';
import React, { Element } from 'react';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

type Props = {
  children?: Element<*>,
};

class Theme extends React.Component {
  props: Props;
  render(): Element<*> {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        { this.props.children }
      </MuiThemeProvider>
    );
  }
};

Theme.propTypes = {
  children: PropTypes.element.isRequired,
}

export default Theme;
