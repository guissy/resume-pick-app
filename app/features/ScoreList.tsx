import React from 'react';
import { useSelector } from 'react-redux';
import styles from './ScoreList.css';
import { selectNameScore } from './scoreSlice';

const ScoreList: React.FC<unknown> = () => {
  const scores = useSelector(selectNameScore);
  return scores.length > 0 ? (
    <table className={styles.table}>
      <thead>
        <tr>
          <td className={styles.td}>文件</td>
          <td className={styles.td}>分数</td>
          <td colSpan={3} className={styles.td} style={{ width: '60%' }}>
            关键字
          </td>
        </tr>
      </thead>
      <tbody>
        {scores.map((v) => (
          <tr key={v.name}>
            <td className={styles.td}>{v.name}</td>
            <td className={styles.score}>{v.score?.toFixed(2)}</td>
            {v.keywords.map((k) => (
              <td className={styles.td} key={k.name}>
                {k.children
                  .filter((w) => w.gained !== 0)
                  .map((w) => (
                    <span key={w.name} className={styles.scoreItem}>
                      <span className={styles.subName}>{w.name}</span>
                      <span className={styles.gained}>
                        {w.gained.toFixed(1)}
                      </span>
                    </span>
                  ))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <></>
  );
};

export default ScoreList;
