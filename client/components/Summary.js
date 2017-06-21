// @flow

import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { connect } from 'react-redux';
import SortableDataTable from './SortableDataTable';

type Props = {
  categories: {
    [key: string]: {
      field: Array<{
        title: string,
        sum: number,
      }>,
      sum: number,
    },
  },
  rows: Array<*>,
  keys: Array<string>,
}

function mapStateToProps(state) {
  return {
    categories: Object.keys(state.categorize.fields).reduce((inp, field) => {
      let c = inp[state.categorize.fields[field]];
      if(!c) {
        c = {field: [], sum: 0.0};
      }
      var sum = state.file.data.rows.reduce((carry, row) => {
        if(row['Field 1'] === field)
          carry += row['Deposit'] + row['Withdrawal'];
        return carry;
      }, 0);
      c.field.push({title:field,sum});
      c.sum += sum;
      inp[state.categorize.fields[field]] = c;
      return inp;
    }, {}),
    rows: state.file.data.rows,
    keys: state.file.data.keys,
  }
}

class Summary extends React.Component {
  props: Props;
  render() {
    console.log(this.props);
    return (
      <div>
        {
          Object.keys(this.props.categories).map(k => {
            return (
              <Card key={k}>
                <CardHeader
                  title={k}
                  subtitle={this.props.categories[k].sum}
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText expandable={true}>
                  {
                    this.props.categories[k].field.map(f => {
                      return (
                        <Card key={f.title}>
                          <CardHeader
                            title={f.title}
                            subtitle={f.sum}
                            actAsExpander={true}
                            showExpandableButton={true}
                          />
                          <CardText expandable={true}>
                            <SortableDataTable
                              header={this.props.keys}
                              data={this.props.rows.filter(r => r['Field 1'] == f.title)}
                            />
                          </CardText>
                        </Card>
                      )
                    })
                  }
                </CardText>
              </Card>
            )
          })
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Summary);
