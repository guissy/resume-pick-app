/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from '../constants/routes.json';
import WelcomePage from './welcome/WelcomePage';

// Lazily load routes and code split with webpack
const LazySingleFilePage = React.lazy(
  () => import(/* webpackChunkName: "DesktopPage" */ './desktop/DesktopPage')
);
const LazySettingPage = React.lazy(
  () => import(/* webpackChunkName: "SettingPage" */ './setting/SettingPage')
);
const LazyOnlinePage = React.lazy(
  () => import(/* webpackChunkName: "OnlinePage" */ './online/OnlinePage')
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

const OnlinePage = (props: Record<string, unknown>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyOnlinePage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <Switch>
      <Route path={routes.SINGLE} component={SingleFilePage} />
      <Route path={routes.SETTING} component={SettingPage} />
      <Route path={routes.ONLINE} component={OnlinePage} />
      <Route path={routes.WELCOME} component={WelcomePage} />
    </Switch>
  );
}
