import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import TechFilter from '../../../app/features/explorer/TechFilter';
import configDefault from '../../../app/constants/configDefault.json';
import * as configSlice from '../../../app/features/configSlice';
import * as scoreSlice from '../../../app/features/scoreSlice';
import { Config } from '../../../app/features/type';

Enzyme.configure({ adapter: new Adapter() });

const defaultProps = {
  config: (configDefault as unknown) as Config,
  setTechNames: () => {},
};

function setup(
  preloadedState = {
    config: {
      configs: {
        default: configDefault,
      },
    },
  },
  props = defaultProps
) {
  const store = configureStore({
    reducer: {
      config: configSlice.default,
      score: scoreSlice.default,
    },
    preloadedState,
  });

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <TechFilter {...props} />
        </Router>
      </Provider>
    );
  const component = getWrapper();
  return {
    store,
    component,
  };
}

describe('TechFilter component', () => {
  it('should match exact snapshot', () => {
    const { store } = setup();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <TechFilter {...defaultProps} />
          </Router>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
