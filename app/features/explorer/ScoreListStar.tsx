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
  const stars = calcLevelSalaryStar(levelSalary, levelValue);
  const arr = React.useMemo(() => {
    return stars > 0
      ? Array(Math.ceil(stars))
          .fill(0)
          .map((_v, i) => i)
      : [];
  }, [stars]);
  const lastStyle = React.useCallback(
    (i: number) => {
      const isLast = i === arr.length - 1;
      const isHalf = stars - Math.floor(stars) > 0.4;
      if (isLast && isHalf) {
        return { clipPath: 'inset(0 60% 0 0)' };
      }
      return {};
    },
    [arr, stars]
  );
  return (
    <span
      className={styles.namePhone}
      title={levelSalary.toFixed(2)}
      aria-label={stars.toFixed(1)}
    >
      {stars > 0
        ? arr.map((v, i) => <Star key={v} style={lastStyle(i)} />)
        : ''}
    </span>
  );
};

export default ScoreListStar;
