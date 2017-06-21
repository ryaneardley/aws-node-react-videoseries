// @flow

import React from 'react';
import { connect } from 'react-redux';
import CSV from 'csv-parse/lib/sync';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import SortableDataTable from './SortableDataTable';
import { Redirect } from 'react-router';

function mapStateToProps(state) {
  return state.file;
}

export default connect(mapStateToProps)(props => {
  if(props.data == null) {
    return (
      <Redirect
        to={{pathname: '/',}}
      />
    );
  }
  return (
    <SortableDataTable
      header={props.data.keys}
      data={props.data.rows}
    />
  );
});
