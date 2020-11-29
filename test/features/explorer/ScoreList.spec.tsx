import './mockGithubView';
import './mockExportExcel';
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
import exportExcelModule from '../../../app/features/parser/exportExcel';
import configDefault from '../../../app/constants/configDefault.json';
import mockScoreFile from './mockScoreFile';
import * as tractWorkAge from '../../../app/features/parser/tractWorkAge';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

function setup(
  preloadedState = {
    config: {
      configs: {
        default: configDefault,
      },
    },
    score: {
      nameScore: mockScoreFile,
    },
  },
  props = {}
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
          <ScoreList {...props} />
        </Router>
      </Provider>
    );
  const component = getWrapper();
  return {
    store,
    component,
    exportBtn: component.find('footer > button'),
    trashBtn: component.find('button.trash'),
    showFull: component.find('#showFull'),
    gitRepo: component.find('#gitRepo'),
    searchInput: component.find('#searchTable'),
    table: component.find('table > tbody'),
  };
}

describe('ScoreList component', () => {
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

  it('click button should call exportExcel', () => {
    const { exportBtn } = setup();
    exportBtn.at(0).simulate('click');
    expect(exportExcelModule).toBeCalled();
  });

  it('click button should call clearNameScore', () => {
    const { trashBtn } = setup();
    const clearNameScoreSpy = jest.spyOn(scoreSlice, 'clearNameScore');
    trashBtn.at(0).simulate('click');
    expect(clearNameScoreSpy).toBeCalled();
    clearNameScoreSpy.mockRestore();
  });

  it('click checkbox should call showFull', () => {
    const { showFull, table } = setup();
    const { name, phone } = mockScoreFile[0];
    expect(table.text()).toContain(name);
    expect(table.text()).toContain(phone);
    showFull.simulate('change');
    expect(table.text()).not.toContain(name);
    expect(table.text()).not.toContain(phone);
  });

  it('click checkbox should call gitRepo', () => {
    const { gitRepo } = setup();
    const getGithubByLinkSpy = jest.spyOn(tractWorkAge, 'getGithubByLink');
    gitRepo.simulate('change');
    expect(getGithubByLinkSpy).toBeCalled();
  });

  it('input should call search', async () => {
    const setSearch = jest.fn();
    const { searchInput } = setup(undefined, { setSearch });
    searchInput.simulate('change', { target: { value: 'react' } });
    jest.runTimersToTime(1000);
    expect(setSearch).not.toBeCalled();
    searchInput.simulate('change', { target: { value: 'vue' } });
    jest.runTimersToTime(2000);
    expect(setSearch).toBeCalledWith('vue');
  });
});
