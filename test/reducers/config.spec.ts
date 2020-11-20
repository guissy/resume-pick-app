import { AnyAction, CombinedState, Dispatch } from 'redux';
import counterReducer, {
  initConfigAsync,
  resetConfigAsync,
  buildConfig,
  updateConfig,
  saveConfig,
  resetConfig,
} from '../../app/features/configSlice';
import { Keyword } from '../../app/features/type';
import initFile, {
  initDefaultFile,
  saveFile,
} from '../../app/features/configUtil';
import { RootState } from '../../app/pages/store';

jest.mock('../../app/features/configUtil', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(Promise.resolve({ test: 'testInitFile' })),
  initDefaultFile: jest
    .fn()
    .mockReturnValue(Promise.resolve({ test: 'testInitDefaultFile' })),
  saveFile: jest.fn(),
}));

const dispatch = (counterReducer.bind(null, {
  configs: {},
}) as unknown) as Dispatch;
const getState = () => ({} as CombinedState<RootState>);

describe('reducers', () => {
  describe('config', () => {
    it('should handle initial state', () => {
      expect(counterReducer(undefined, {} as AnyAction)).toMatchSnapshot();
    });

    it('should handle updateConfig', () => {
      expect(
        counterReducer(
          {
            configs: {
              default: [
                {
                  name: 'testDefault',
                } as Keyword,
              ],
            },
          },
          {
            type: updateConfig,
            payload: {
              other: [{ name: 'testUpdate' }],
            },
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle buildConfig', () => {
      expect(
        counterReducer({ configs: { default: [] } }, { type: buildConfig })
      ).toMatchObject({ configs: { default: [] } });
      expect(
        counterReducer({ configs: {} }, { type: buildConfig })
      ).toMatchObject({ configs: {} });
      expect(
        counterReducer(
          { configs: {} },
          {
            type: buildConfig,
            payload: {
              default: [{ name: 'testBuild' }],
            },
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle saveConfig', () => {
      expect(
        counterReducer({ configs: { default: [] } }, { type: saveConfig })
      ).toMatchSnapshot();
      expect(saveFile).toBeCalled();
    });

    it('should handle resetConfig', () => {
      expect(
        counterReducer({ configs: { default: [] } }, { type: resetConfig })
      ).toMatchSnapshot();
      expect(saveFile).toBeCalled();
    });

    it('should handle initConfigAsync', async () => {
      expect(
        await initConfigAsync()(dispatch, getState, null)
      ).toMatchSnapshot();
      expect(initFile).toBeCalled();
    });

    it('should handle resetConfigAsync', async () => {
      expect(
        await resetConfigAsync()(dispatch, getState, null)
      ).toMatchSnapshot();
      expect(initDefaultFile).toBeCalled();
    });
  });
});
