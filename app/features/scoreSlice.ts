import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../store';
import { ScoreFile } from './type';

const scoreSlice = createSlice({
  name: 'score',
  initialState: { nameScore: [] as ScoreFile[] },
  reducers: {
    updateNameScore: (state, action) => {
      // state.nameScore = [...state.nameScore, action.payload];
      state.nameScore.push(action.payload);
      state.nameScore.sort((a, b) => b.score - a.score);
    },
  },
});

export const { updateNameScore } = scoreSlice.actions;

export default scoreSlice.reducer;

export const selectNameScore = (state: RootState) => state.score.nameScore;
