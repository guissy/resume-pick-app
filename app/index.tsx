import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { history, configuredStore } from './pages/store';
import './app.global.css';
import './features/configUtil';

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const App = require('./pages/App').default;
  render(
    <AppContainer>
      <App store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
