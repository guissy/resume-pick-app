import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { history, configuredStore } from './store';
import './app.global.css';
import './features/configUtil';
import { RootProps } from './containers/Root';

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

let Root: React.JSXElementConstructor<RootProps>;
const bootstrap = () => {
  if (Root) return;
  // eslint-disable-next-line global-require
  Root = require('./containers/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
};
bootstrap();
document.addEventListener('DOMContentLoaded', bootstrap);
