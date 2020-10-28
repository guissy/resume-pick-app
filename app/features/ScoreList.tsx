import React from 'react';
import { useSelector } from 'react-redux';
import styles from './ScoreList.css';
import { selectNameScore } from './scoreSlice';
import trackWorkAge from './tractWorkAge';

type Props = {
  onClickResume: (resume: string) => void;
  onClickTable?: () => void;
};

const ScoreList: React.FC<Props> = ({ onClickResume, onClickTable }) => {
  const scores = useSelector(selectNameScore);
  return scores.length > 0 ? (
    <div
      role="presentation"
      className={styles.tableWrap}
      onClick={onClickTable}
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <td className={styles.td} style={{ width: 32 }}>
              序号
            </td>
            <td className={styles.td}>文件</td>
            <td className={styles.td} style={{ width: 50 }}>
              经验
            </td>
            <td className={styles.td}>分数</td>
            <td colSpan={3} className={styles.td} style={{ width: '60%' }}>
              关键字
            </td>
          </tr>
        </thead>
        <tbody>
          {scores.map((v, i) => (
            <tr key={v.name}>
              <td className={styles.td}>{i + 1}</td>
              <td className={styles.td}>
                <button
                  type="button"
                  className={styles.link}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickResume(v.text);
                  }}
                >
                  {v.name}
                </button>
              </td>
              <td className={styles.td}>{trackWorkAge(v.text)}</td>
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
    </div>
  ) : (
    <></>
  );
};

export default ScoreList;
