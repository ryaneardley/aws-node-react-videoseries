// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class DataTable extends React.Component {
  props: {
    header: Array<{
      key: string,
      label: string,
    }>,
    data: Array<any>,
    headerClick?: (key: string) => void,
  }
  headerClick = (event: SyntheticEvent, _: any, index: number) => {
    if(this.props.headerClick) {
      this.props.headerClick(this.props.header[index - 1].key);
    }
  }
  render() {
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow onCellClick={this.headerClick}>
          {
            this.props.header.map(data => {
              return (
                <TableHeaderColumn key={data.key} onClick={this.headerClick.bind(data.key)} >
                  {data.label}
                </TableHeaderColumn>
              );
            })
          }
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            this.props.data.map(row => (
                <TableRow
                  key={JSON.stringify(row)}
                >
                {
                  this.props.header.map(key => (
                    <TableRowColumn style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}
                      key={row[key.key]}
                    >
                      {
                        row[key.key]
                      }
                    </TableRowColumn>
                  ))
                }
              </TableRow>
            )
          )
        }
        </TableBody>
      </Table>
    );
  }
};

export default DataTable;
