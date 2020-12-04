import React from 'react';

import styles from './ScoreList.css';
import { calcLevelSalaryStar } from '../parser/tractWorkAge';

const Star: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  return (
    <span className={styles.star} role="img" aria-label="star" style={style}>
      ⭐
    </span>
  );
};

type Props = {
  levelSalary: number;
  levelValue: number;
};
const ScoreListStar: React.FC<Props> = ({ levelSalary, levelValue }) => {
  const arr = React.useMemo(() => {
    const n = calcLevelSalaryStar(levelSalary, levelValue);
    return n > 0
      ? Array(Math.ceil(n))
          .fill(0)
          .map((_v, i) => i)
      : [];
  }, [levelSalary, levelValue]);
  const lastStyle = React.useCallback(
    (i: number) => {
      const isLast = i === arr.length - 1;
      const isHalf = levelSalary - Math.floor(levelSalary) > 0.4;
      if (isLast && isHalf) {
        return { clipPath: 'inset(0 60% 0 0)' };
      }
      return {};
    },
    [arr, levelSalary]
  );
  return (
    <span className={styles.namePhone} title={levelSalary.toFixed(2)}>
      {calcLevelSalaryStar(levelSalary, levelValue) > 0
        ? arr.map((v, i) => <Star key={v} style={lastStyle(i)} />)
        : ''}
    </span>
  );
};

export default ScoreListStar;
