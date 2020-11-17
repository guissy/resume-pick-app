import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../store';
import { ScoreFile } from './type';

const scoreSlice = createSlice({
  name: 'score',
  initialState: { nameScore: [] as ScoreFile[], search: '' },
  reducers: {
    updateNameScore: (state, action) => {
      const nameScore = action.payload;
      const index = state.nameScore.findIndex(
        (it) => it.path === nameScore.path
      );
      if (index >= 0) {
        state.nameScore[index] = nameScore;
      } else {
        state.nameScore.push(nameScore);
      }
      state.nameScore.sort((a, b) => b.score - a.score);
    },
    removeNameScore: (state, action) => {
      const n = state.nameScore.findIndex((ns) => ns.path === action.payload);
      state.nameScore.splice(n, 1);
    },
    clearNameScore: (state) => {
      state.nameScore = [];
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const {
  updateNameScore,
  updateSearch,
  removeNameScore,
  clearNameScore,
} = scoreSlice.actions;

export default scoreSlice.reducer;

export const selectNameScore = (state: RootState) => state.score.nameScore;
export const selectSearch = (state: RootState) => state.score.search;
