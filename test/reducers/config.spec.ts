import { AnyAction } from 'redux';
import counterReducer, {
  initConfigAsync,
  resetConfigAsync,
} from '../../app/features/configSlice';

describe('reducers', () => {
  describe('config', () => {
    it('should handle initial state', () => {
      expect(counterReducer(undefined, {} as AnyAction)).toMatchSnapshot();
    });

    it('should handle initConfigAsync', () => {
      expect(
        counterReducer({ configs: { default: [] } }, { type: initConfigAsync })
      ).toMatchSnapshot();
    });

    it('should handle resetConfigAsync', () => {
      expect(
        counterReducer({ configs: { default: [] } }, { type: resetConfigAsync })
      ).toMatchSnapshot();
    });
  });
});
