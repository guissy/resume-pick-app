import React from 'react';
import styles from './ScoreList.css';

type Props = {
  name: string | React.ReactNode;
  sort: string;
  onClick: () => void;
};

const ScoreListSort: React.FC<Props> = ({ name, sort, onClick }) => {
  const [up, down] = React.useMemo(
    () =>
      name === '分数' ? ['scoreUp', 'scoreDown'] : ['workAgeUp', 'workAgeDown'],
    [name]
  );
  return (
    <button className={styles.sortBtn} type="button" onClick={onClick}>
      <span>{name}</span>
      <div className={styles.caretInit}>
        <i className={`fa fa-caret-up ${sort === up ? styles.active : ''}`} />
        <i
          className={`fa fa-caret-down ${sort === down ? styles.active : ''}`}
        />
      </div>
    </button>
  );
};

export default ScoreListSort;
