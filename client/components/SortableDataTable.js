// @flow

import React from 'react';
import DataTable from './DataTable';

type Props = {
  comparators?: {
    [key: string]: (a: any, b: any) => number,
  },
  header: Array<{
    key: string,
    label: string,
  }>,
  data: Array<any>,
};

type orderWay = 1 | -1;

type State = {
  key: string,
  order: orderWay,
}

class SortableDataTable extends React.Component {
  props: Props;
  state: State;
  static defaultProps = {
    comparators: {},
  }
  constructor(props: Props) {
    super(props);
    this.state = this.initData(props);
  }
  componentWillReceiveProps(nextProps: Props) {
    this.setState(this.initData(nextProps));
  }
  initData(props: Props) {
    return {
      key: props.header[0].key,
      order: 1,
    };
  }
  createSortFunction(
    key: string,
    comparators?: {[key: string]: (a: any, b: any) => number},
    order: orderWay
  ) {
    let comp = function(a,b) { return a > b; };
    if(comparators != null && comparators[key] != null) {
      comp = comparators[key];
    }
    return (a: any, b: any): number => {
      return comp(a[key], b[key]) ? order : -order;
    };
  }
  markSortHeader(
    header: Array<{
      key: string,
      label: string,
    }>,
    key: string,
    order: orderWay,
  ): Array<{
    key: string,
    label: string,
  }> {
    return header.map(
      h => h.key === key ?
      {
        ...h,
        label: (order == 1 ? "↓" : "↑") + " " + h.label
      } :
      h
    );
  }
  headerClick = (key: string) => {
    let order: orderWay = 1;
    if(this.state.key === key) {
      order = this.state.order == 1 ? -1 : 1;
    }
    this.setState({
      key,
      order,
    });
  }
  render() {
    const data = this.props.data.sort(
      this.createSortFunction(
        this.state.key,
        this.props.comparators,
        this.state.order
      ),
    );
    const header = this.markSortHeader(
      this.props.header,
      this.state.key,
      this.state.order
    );
    return (
      <DataTable
        header={header}
        data={data}
        headerClick={this.headerClick} />
    );
  }
}

export default SortableDataTable;
