/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import WelcomePage from './pages/WelcomePage';

// Lazily load routes and code split with webpack
const LazySingleFilePage = React.lazy(() =>
  import(/* webpackChunkName: "SingleFilePage" */ './pages/SingleFilePage')
);

const SingleFilePage = (props: Record<string, unknown>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazySingleFilePage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.SINGLE} component={SingleFilePage} />
        <Route path={routes.WELCOME} component={WelcomePage} />
      </Switch>
    </App>
  );
}
