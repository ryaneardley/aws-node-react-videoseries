// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { upload } from '../actions/fileActions';
import { Redirect } from 'react-router';
import CenterButton from './CenterButton';

function mapStateToProps(props) {
  return props.file;
}

const launchFileUpload = (dispatch) => {
  return {
    launchFileUpload:
      (a) => {
        const reader = new FileReader();
        reader.onload = data => {
          dispatch(upload(reader));
        };
        reader.readAsText(a[0]);
      }
    }
}

class Home extends React.Component {
  render() {
    if(this.props.data != null) {
      return (
        <Redirect
          to={{pathname: '/data',}}
        />
      );
    }
    return (
      <Dropzone
        onDrop={this.props.launchFileUpload}
        style={{}}>
        <CenterButton>
          <ContentAdd />
        </CenterButton>
      </Dropzone>
    );
  }
}

export default connect(mapStateToProps, launchFileUpload)(Home);
