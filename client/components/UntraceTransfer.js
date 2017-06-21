// @flow

import React from 'react';
import CenterButton from './CenterButton';
import Build from 'material-ui/svg-icons/action/build';
import { connect } from 'react-redux';
import { trace } from '../actions/fileActions';
import SortableDataTable from './SortableDataTable';

function mapStateToProps(state) {
  return state;
}

function mapActions(dispatch) {
  return {
    traceTransfers: (e: SyntheticEvent) => {
      dispatch(trace());
    }
  };
}

class UntraceTransfer extends React.Component {
  props: {
    trace: boolean,
    traceTransfers: (e: SyntheticEvent) => void,
    file: any,
  }
  trace = (e: SyntheticEvent) => {
    console.log(e);
    this.props.traceTransfers(e);
  }
  tracedTransfer(data): [any,any] {
    const traces = [];
    const match = function(r1, r2) {
      return r1['Withdrawal'] === r2['Deposit']
        && r1['Date'] === r2['Date']
        && r1['Field 1'] === r2['Field 1']
        && r1['Description'] === r2['Description']
        && r2['Deposit'] > 0
        ;
    }
    const makeRow = function(r1) {
      const base = {
        date: r1['Date'],
        description: r1['Description'],
        field1: r1['Field 1'],
      }
      if(r1['Deposit'] > 0) {
        return {
          ...base,
          from: r1['BankAccount'],
          to: '',
          amount: r1['Deposit'],
        }
      } else {
        return {
          ...base,
          from: '',
          to: r1['BankAccount'],
          amount: r1['Withdrawal'],
        }
      }
    }
    const arr = new Array(data.rows.length);
    for(var i = 0; i < data.rows.length; i++) {
      arr[i] = false;
    }
    for(var i = 0; i < data.rows.length; i++) {
      for(var j = 0; j < data.rows.length; j++) {
        if(match(data.rows[i],data.rows[j]) && i != j) {
          arr[i] = true;
          arr[j] = true;
        }
      }
    }
    for(var i = 0; i < data.rows.length; i++) {
      if(!arr[i] && data.rows[i]['Field 1'] === 'Transfer') {
        traces.push(makeRow(data.rows[i]));
      }
    }
    return [
      [
        {key: 'from', label: 'From'},
        {key: 'to', label: 'To'},
        {key: 'date', label: 'Date'},
        {key: 'description', label: 'Description'},
        {key: 'field1', label: 'Field 1'},
        {key: 'amount', label: 'Amount'},
      ],
      traces
    ];
  }
  render() {
    if(!this.props.trace.traced) {
      return (
        <CenterButton onTouchTap={this.trace}>
          <Build />
        </CenterButton>
      );
    } else {
      var [header, data] = this.tracedTransfer(this.props.file.data);
      return (
        <SortableDataTable
          header={header}
          data={data}
        />
      );
    }
  }
}

export default connect(mapStateToProps,mapActions)(UntraceTransfer);
