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
    input: component.find('input').at(0),
    button: component.find('button').at(0),
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

  it('click button should call updateConfig', () => {
    const { button } = setup();
    const updateConfigSpy = jest.spyOn(configSlice, 'updateConfig');
    button.simulate('click');
    expect(updateConfigSpy).toBeCalledTimes(1);
    updateConfigSpy.mockRestore();
  });

  it('check should call updateConfig', () => {
    const { input } = setup();
    const updateConfigSpy = jest.spyOn(configSlice, 'updateConfig');
    input.simulate('change');
    expect(updateConfigSpy).toBeCalledTimes(1);
    updateConfigSpy.mockRestore();
  });
});
