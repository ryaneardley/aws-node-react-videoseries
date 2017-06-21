// @flow

import React from 'react';

import { Route } from 'react-router'

import Home from './Home';
import LoadData from './LoadData';
import TraceTransfer from './TraceTransfers';
import UntraceTransfer from './UntraceTransfer';
import Layout from './Layout';
import Categorize from './Categorize';
import Summary from './Summary';
import Visualization from './Visualization';

class Routing extends React.Component {
  static routes = {
    home: {
      path: "/",
      component: Home,
    },
    loadData: {
      path: "/data",
      component: LoadData,
    },
    traced: {
      path: "/traced",
      component: TraceTransfer,
    },
    untraced: {
      path: "/untraced",
      component: UntraceTransfer,
    },
    categorize: {
      path: "/categorize",
      component: Categorize,
    },
    summary: {
      path: "/summary",
      component: Summary,
    },
    visualization: {
      path: "/flowchart",
      component: Visualization,
    },
  }
  render() {
    return (
      <Layout>
        {
          Object.keys(Routing.routes).map((item) => (
            <Route exact path={Routing.routes[item].path} component={Routing.routes[item].component} />
          ))
        }
      </Layout>
    );
  }
}

export default Routing;
