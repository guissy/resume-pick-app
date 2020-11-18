import { useSelector } from 'react-redux';
import React from 'react';
import { selectNameScore } from '../features/scoreSlice';
import { ScoreFile } from '../features/type';

export default function useNameScore() {
  const nameScore = useSelector(selectNameScore);
  const nameScoreRef = React.useRef<ScoreFile[] | null>(null);
  nameScoreRef.current = React.useMemo(() => nameScore, [nameScore]);
  return nameScoreRef;
}
