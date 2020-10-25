/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import WelcomePage from './pages/WelcomePage';

// Lazily load routes and code split with webpack
const LazySingleFilePage = React.lazy(
  () =>
    import(/* webpackChunkName: "SingleFilePage" */ './pages/SingleFilePage')
);
const LazySettingPage = React.lazy(
  () => import(/* webpackChunkName: "SettingPage" */ './pages/SettingPage')
);

const SingleFilePage = (props: Record<string, unknown>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazySingleFilePage {...props} />
  </React.Suspense>
);

const SettingPage = (props: Record<string, unknown>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazySettingPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.SINGLE} component={SingleFilePage} />
        <Route path={routes.SETTING} component={SettingPage} />
        <Route path={routes.WELCOME} component={WelcomePage} />
      </Switch>
    </App>
  );
}
