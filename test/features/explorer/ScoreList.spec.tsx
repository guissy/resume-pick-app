import './mockGithubView';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as configSlice from '../../../app/features/configSlice';
import * as scoreSlice from '../../../app/features/scoreSlice';
import ScoreList from '../../../app/features/explorer/ScoreList';
import { ConfigFile } from '../../../app/features/type';
import * as exportExcelModule from '../../../app/features/parser/exportExcel';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

function setup(
  preloadedState = {
    config: {} as ConfigFile,
  }
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
          <ScoreList />
        </Router>
      </Provider>
    );
  const component = getWrapper();
  return {
    store,
    component,
    exportBtn: component.find('footer > button'),
    p: component.find('.counter'),
  };
}

describe('ScoreList component', () => {
  it('should buildConfig', () => {
    setup();
    const buildConfigSpy = jest.spyOn(configSlice, 'buildConfig');
    expect(buildConfigSpy).toBeCalled();
    buildConfigSpy.mockRestore();
  });

  it('should match exact snapshot', () => {
    const { store } = setup();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            <ScoreList />
          </Router>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should second button should call exportExcel', () => {
    const { exportBtn } = setup();
    const exportExcelSyp = jest.spyOn(exportExcelModule, 'default');
    exportBtn.at(1).simulate('click');
    expect(exportExcelSyp).toBeCalled();
    exportExcelSyp.mockRestore();
  });
});

// describe('Test counter actions', () => {
//   it('should not call incrementAsync before timer', () => {
//     const fn = counterSlice.incrementAsync(1000);
//     expect(fn).toBeInstanceOf(Function);
//     const dispatch = jest.fn();
// // @ts-ignore
//     fn(dispatch);
//     jest.advanceTimersByTime(500);
//     expect(dispatch).not.toBeCalled();
//   });
// });
