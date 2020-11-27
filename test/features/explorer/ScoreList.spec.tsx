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
import * as exportExcelModule from '../../../app/features/parser/exportExcel';
import configDefault from '../../../app/constants/configDefault.json';

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
      nameScore: [
        {
          name: '1',
          path: '1.pdf',
          workAge: 1,
          level: 'p4',
          levelValue: 0,
          school: '测大',
          score: 0,
          links: [],
          keywords: [
            {
              name: '',
              children: [
                {
                  name: 'vue',
                  score: 1,
                  gained: 1,
                  works: [
                    {
                      startDate: '2020-01-01',
                      endDate: '2020-11-01',
                      workContent: 'Vue',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
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
    trashBtn: component.find('button.trash'),
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

  it('should second button should call exportExcel', () => {
    const { exportBtn } = setup();
    const exportExcelSpy = jest.spyOn(exportExcelModule, 'default');
    exportBtn.at(0).simulate('click');
    expect(exportExcelSpy).toBeCalled();
    exportExcelSpy.mockRestore();
  });

  it('should clearNameScore', () => {
    const { trashBtn } = setup();
    const clearNameScoreSpy = jest.spyOn(scoreSlice, 'clearNameScore');
    trashBtn.at(0).simulate('click');
    expect(clearNameScoreSpy).toBeCalled();
  });
});
