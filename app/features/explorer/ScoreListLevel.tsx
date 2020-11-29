import React from 'react';
import { getLevelStyle } from './scoreListUtil';

type Props = {
  level: string;
  levelValue: number;
};

const ScoreListLevel: React.FC<Props> = ({ level, levelValue }) => {
  return (
    <span className={getLevelStyle(level)} title={String(levelValue)}>
      {level?.slice(0, 2)}
      {level
        ?.split('')
        .filter((c) => c === '+')
        .map((c, n) => (
          <i key={c + String(n)} className="fa fa-plus fa-1x" title={c} />
        ))}
    </span>
  );
};

export default ScoreListLevel;
