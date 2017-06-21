// @flow

import React from 'react';
import { connect } from 'react-redux';
import go from 'gojs';

type Props = {
  rows: Array<{ [key: string]: string }>,
  categories: { [key: string]: string },
}

var d3Chart = {
  create: (el: HTMLElement, state, dim:{width:number,height:number}) => {
    var $ = go.GraphObject.make;
    var diag = $(
      go.Diagram,
      el,
      {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
      }
    );
    diag.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0},
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },
          new go.Binding("text", "key"))
      );
    diag.linkTemplate =
      $(go.Link,
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" }),
        $(go.TextBlock,
          new go.Binding("text", "value"))
    );
    diag.model = new go.GraphLinksModel(state.nodes, state.links);
  },
  update: (el: HTMLElement) => {
  },
  destroy: (el: HTMLElement) => {},
};

function mapStateToProps(state) {
  return {
    rows: state.file.data.rows,
    categories: state.categorize.fields,
  };
}

class Visualization extends React.Component {
  props: Props;
  el: HTMLDivElement;
  con: HTMLDivElement;
  getDim = () => {
    return {
      width: this.con.offsetWidth,
      height: this.con.offsetHeight
    };
  }
  componentDidMount() {
    console.log(this.getChartStateNew());
    d3Chart.create(this.el, this.getChartStateNew(), this.getDim());
  }
  componentDidUpdate() {
    console.log(this.getChartStateNew());
    d3Chart.update(this.el, this.getChartStateNew(), this.getDim());
  }
  getChartStateNew = () => {
    function nameAcc(acc) {
      return "Bank Account " + acc;
    }
    var cat = this.props.categories;
    var fieldNodes = Object.keys(cat).reduce((carry,k) => {
      carry[cat[k]] = (carry[cat[k]] || []);
      carry[cat[k]].push(k);
      return carry;
    }, {});
    var bankAcc = Array.from(this.props.rows.reduce((carry, k) => {
      carry.add(Number(k['BankAccount']));
      return carry;
    }, new Set())).map(nameAcc);
    bankAcc.push(nameAcc("?"));
    var linksMap: {[key:string]: {[key:string]: number}} = this.props.rows.reduce((carry,k) => {
      var b = nameAcc(Number(k['BankAccount']));
      var target = cat[k['Field 1']];
      var to, from;
      if(target && k['Field 1'] != 'Transfer') {
        if(Number(k['Deposit']) > 0) {
          to = b;
          from = target;
        } else {
          to = target;
          from = b;
        }
        carry[from] = (carry[from] || {});
        carry[from][to] = (carry[from][to] || 0);
        carry[from][to] += k['Withdrawal'] + k['Deposit'];
      }
      return carry;
    }, {});
    const traces = [];
    const match = function(r1, r2) {
      return r1['Withdrawal'] === r2['Deposit']
        && r1['Date'] === r2['Date']
        && r1['Field 1'] === r2['Field 1']
        && r1['Description'] === r2['Description']
        && Number(r2['Deposit']) > 0
        ;
    }
    const makeRow = function(r1, r2) {
      return {
        from: nameAcc(Number(r1['BankAccount'])),
        to: nameAcc(Number(r2['BankAccount'])),
        value: r2['Deposit'],
      }
    }
    const arr = new Array(this.props.rows.length);
    for(var i = 0; i < this.props.rows.length; i++) {
      arr[i] = false;
    }
    for(var i = 0; i < this.props.rows.length; i++) {
      for(var j = 0; j < this.props.rows.length; j++) {
        if(match(this.props.rows[i],this.props.rows[j]) && i != j) {
          traces.push(makeRow(this.props.rows[i], this.props.rows[j]));
          arr[i] = true;
          arr[j] = true;
        }
      }
    }
    for(var i = 0; i < this.props.rows.length; i++) {
      if(arr[i] === false && this.props.rows[i]['Field 1'] === "Transfer") {
        var to, from;
        if(Number(this.props.rows[i]['Deposit']) > 0) {
          to = this.props.rows[i]['BankAccount'];
          from = "?";
        } else {
          from = this.props.rows[i]['BankAccount'];
          to = "?";
        }
        traces.push({
          from: nameAcc(from),
          to: nameAcc(to),
          value: this.props.rows[i]['Deposit'] + this.props.rows[i]['Withdrawal'],
        });
      }
    }
    traces.forEach(v => {
      linksMap[v.from] = (linksMap[v.from] || {});
      linksMap[v.from][v.to] = (linksMap[v.from][v.to] || 0);
      linksMap[v.from][v.to] += v.value;
    })
    var links = Object.keys(linksMap).reduce((c1,k1) => {
      return Object.keys(linksMap[k1]).reduce((c2,k2) => {
        c2.push({from: k1, to: k2, value: "$" + String(linksMap[k1][k2].toFixed(2))});
        return c2;
      }, c1);
    }, []);
    return {
      nodes: Object.keys(fieldNodes).concat(bankAcc).map(v => ({key:v, color: '#80DEEA'})),
      links,
    }
  }
  componentWillUnmount() {
    d3Chart.destroy(this.el);
  }
  render() {
    return (
      <div style={{height:'100vh',width:'100%'}} ref={(i) => this.con = i}>
        <div style={{height:'100vh',width:'100%'}} className="Chart" ref={(i) => this.el = i}/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Visualization);
