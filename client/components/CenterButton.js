// @flow

import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';

class CenterButton extends React.Component {
  props: {
    onTouchTap?: (event: SyntheticEvent) => void,
    children?: React.Element<*>,
  }
  render() {
    return (
      <div
        style={{
          position:'absolute',
          height:'100%',
          width:'100%'
        }}>
        <FloatingActionButton
          onTouchTap={this.props.onTouchTap}
          style={{
            position:'relative',
            top:'45%',
            left:'50%',
            transform: 'translate(-50%, -50%)'}}>
          { this.props.children }
        </FloatingActionButton>
      </div>
    );
  }
}

export default CenterButton;
