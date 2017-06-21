// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import AutoComplete from 'material-ui/AutoComplete';
import { connect } from 'react-redux';
import { categorize } from '../actions/fileActions';

type Props = {
  fieldCategories: {[key: string]: string},
  fields: Array<string>,
  assignCategory: (string, string) => void,
}

type State = {
  categories: {[key: string]: number},
};

function mapStateToProps(state) {
  return {
    fields: Array.from(new Set(state.file.data.rows.map(d => {
      return d['Field 1'];
    }))),
    fieldCategories: state.categorize.fields,
  };
}

function mapActions(dispatch) {
  return {
    assignCategory: (field: string, category: string) => {
      dispatch(categorize(field, category));
    }
  }
}

class Categorize extends React.Component {
  state: State;
  props: Props;
  refs = [];
  dataSourceConfig = {
    text: 'text',
    value: 'text',
  }
  constructor(props: Props) {
    super(props);
    this.state = this.initState(props);
  }
  componentWillReceiveProps(props: Props) {
    this.setState(this.initState(props))
  }
  initState(props: Props): State {
    var catCount = props.fields.reduce(
      (carry, v) => {
        var c = props.fieldCategories[v];
        if(c) {
          carry[c] = (carry[c] || 0) + 1;
        }
        return carry;
      },
      {}
    );
    return {
      categories: catCount,
    };
  }
  handleUpdateInput = (field: string, index: number) => {
    return (input: string) => {
      const upd = this.state;
      this.props.assignCategory(field, input);
      upd.categories[input] = (upd.categories[input] || 0) + 1;
      var el = this.refs[(index + 1) % this.props.fields.length];
      el.focus();
      el = ReactDOM.findDOMNode(el);
      if(el instanceof HTMLElement) {
        window.scrollTo(0, el.offsetTop);
      }
      this.setState(upd);
    };
  }
  onKeyDown = (field: string, index: number) => {
    return (input: SyntheticKeyboardEvent) => {
      var f = input.keyCode - 111;
      if(f >= 1 && f <= 12) {
        var choice = Object.keys(this.state.categories).map(k => ({
          text: k,
          value: this.state.categories[k],
        }))
        .sort((a,b) => b.value - a.value)[f - 1];
        this.handleUpdateInput(field, index)(choice.text);
      }
    }
  }
  render() {
    var items = [];
    this.refs = new Array(this.props.fields.length);
    var f = (v) => (input) => { this.refs[v] = input; };
    var suggestion = Object.keys(this.state.categories).map(k => ({
      text: k,
      value: this.state.categories[k],
    }))
    .sort((a,b) => b.value - a.value)
    .map((v,i) => ({
      ...v,
      text: "F" + (i + 1) + " - " + v.text,
    }));
    for(var i = 0; i < this.props.fields.length; i++) {
      var k = this.props.fields[i];
      items.push(
        <TableRow key={k}>
          <TableRowColumn>
            {k}
          </TableRowColumn>
          <TableRowColumn>
            <AutoComplete
              hintText="Enter the category here"
              onKeyDown={this.onKeyDown(k, i)}
              dataSource={suggestion}
              onNewRequest={this.handleUpdateInput(k, i)}
              floatingLabelText="Category assignment"
              fullWidth={true}
              openOnFocus={true}
              filter={AutoComplete.caseInsensitiveFilter}
              ref={f(i)}
              animated={false}
              searchText={this.props.fieldCategories[k] ? this.props.fieldCategories[k] : ''}
            />
          </TableRowColumn>
        </TableRow>
      );
    }
    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Field 1</TableHeaderColumn>
            <TableHeaderColumn>Category</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
        {
          items
        }
        </TableBody>
      </Table>
    );
  }
}

export default connect(mapStateToProps, mapActions)(Categorize);
