import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import scoreReducer from '../features/scoreSlice';
// eslint-disable-next-line import/no-cycle
import configReducer from '../features/configSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    score: scoreReducer,
    config: configReducer,
  });
}
