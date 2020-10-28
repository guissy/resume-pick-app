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

const Loading = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h3>Loading...</h3>
  </div>
);

const SingleFilePage = (props: Record<string, unknown>) => (
  <React.Suspense fallback={<Loading />}>
    <LazySingleFilePage {...props} />
  </React.Suspense>
);

const SettingPage = (props: Record<string, unknown>) => (
  <React.Suspense fallback={<Loading />}>
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
