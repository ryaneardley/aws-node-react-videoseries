// @flow

import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Upload from 'material-ui/svg-icons/file/file-upload';
import Logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { upload } from '../actions/fileActions';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import Routing from './Routing';

declare var TITLE: string;

const iconStyles = {
  marginRight: 12,
  marginTop: 12,
};

class Header extends React.Component {
  state: {
    open: boolean,
  }
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
    };
  }
  toggleDrawer = () => {
    this.setState({
      open:!this.state.open
    })
  }
  render() {
    return (
      <AppBar
        title={ TITLE }
        onLeftIconButtonTouchTap={this.toggleDrawer}
        iconElementRight={
          <Dropzone onDrop={this.props.launchFileUpload} style={{}}>
            <FlatButton icon={<Upload />} style={{top:'4px'}} />
          </Dropzone>
        }>
        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={this.toggleDrawer}>
          <MenuItem
            containerElement={<Link to={Routing.routes.loadData.path} />}
            primaryText="Load Data"
            onTouchTap={this.toggleDrawer}
          />
          <MenuItem
            primaryText="Trace Transfers"
            rightIcon={<ArrowDropRight />}
            menuItems={[
              <MenuItem
                containerElement={<Link to={Routing.routes.traced.path} />}
                primaryText="Traced Data"
                onTouchTap={this.toggleDrawer}
              />,
              <MenuItem
                containerElement={<Link to={Routing.routes.untraced.path} />}
                primaryText="Untraced Data"
                onTouchTap={this.toggleDrawer}
              />
            ]}
          />
          <MenuItem
            containerElement={<Link to={Routing.routes.categorize.path} />}
            primaryText="Categorize"
            onTouchTap={this.toggleDrawer}
          />
          <MenuItem
            containerElement={<Link to={Routing.routes.summary.path} />}
            primaryText="Summary"
            onTouchTap={this.toggleDrawer}
          />
          <MenuItem
            containerElement={<Link to={Routing.routes.visualization.path} />}
            primaryText="Visualization"
            onTouchTap={this.toggleDrawer}
          />
         </Drawer>
       </AppBar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
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

export default connect(mapStateToProps, launchFileUpload)(Header);
