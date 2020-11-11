import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../store';
import { ConfigFile } from './type';
import initFile, { initDefaultFile, saveFile } from './configUtil';

export const configSlice = createSlice({
  name: 'config',
  initialState: { configs: {} as ConfigFile },
  reducers: {
    buildConfig: (state, action) => {
      if (Object.keys(state.configs).length === 0) {
        state.configs = action.payload;
      }
    },
    updateConfig: (state, action) => {
      Object.assign(state.configs, action.payload);
    },
    saveConfig: (state) => {
      saveFile(state.configs);
    },
    resetConfig: (state, action) => {
      state.configs = action.payload;
      saveFile(state.configs);
    },
  },
});

export const {
  updateConfig,
  buildConfig,
  saveConfig,
  resetConfig,
} = configSlice.actions;

export const initConfigAsync = (): AppThunk => (dispatch) =>
  initFile()
    .then((data) => dispatch(buildConfig(data)))
    // eslint-disable-next-line no-console
    .catch((e) => console.error(e));

export const resetConfigAsync = (): AppThunk => (dispatch) =>
  initDefaultFile()
    .then((data) => dispatch(resetConfig(data)))
    // eslint-disable-next-line no-console
    .catch((e) => console.error(e));

export default configSlice.reducer;

export const selectConfig = (state: RootState) => state.config.configs.default;
