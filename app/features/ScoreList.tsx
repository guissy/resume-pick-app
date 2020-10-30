import React from 'react';
import { useSelector } from 'react-redux';
import fs from 'fs';
import ExcelJS, { Column } from 'exceljs';
import { remote } from 'electron';
import styles from './ScoreList.css';
import { selectNameScore } from './scoreSlice';
import trackWorkAge, { trackPhone } from './tractWorkAge';
import { selectConfig } from './configSlice';

type Props = {
  onClickResume: (resume: string) => void;
  onClickTable?: () => void;
};

const ScoreList: React.FC<Props> = ({ onClickResume, onClickTable }) => {
  const scores = useSelector(selectNameScore);
  const config = useSelector(selectConfig);
  const onClickExport = React.useCallback(async () => {
    const conf = {
      cols: [
        ['文件', 42],
        ['电话', 20],
        ['经验', 10],
        ['分数', 10],
        ...config[0].children.map((w) => [
          w.name,
          Math.max(w.name.length * 1.6, 10),
        ]),
      ],
      rows: scores.map((s) => [
        s.name,
        s.phone,
        s.workAge,
        parseFloat(s.score.toFixed(1)),
        ...config[0].children.map((w) => {
          const found = s.keywords[0].children.find((w2) => w.name === w2.name);
          return found ? parseFloat(found.gained.toFixed(1)) : 0;
        }),
      ]),
    };
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resume Pick');
    worksheet.columns = conf.cols.map(
      ([header, width]) => ({ header, width } as Column)
    );
    worksheet.addRows(conf.rows);
    const row = worksheet.getRow(1);
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { name: 'Arial Black', bold: true, size: 14 };
    });
    conf.cols.forEach((_r, i) => {
      const col = worksheet.getColumn(i + 1);
      col.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: 'Arial', size: 14 };
      });
    });
    conf.rows
      .map((_r, i) => 'ABC'.split('').map((c) => `${c}${i + 2}`))
      .flat()
      .forEach((pos) => {
        const cell = worksheet.getCell(pos);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Arial', size: 14 };
      });
    const filePath = await remote.dialog
      .showSaveDialog({
        nameFieldLabel: 'resume-score',
        filters: [{ name: 'xls Files', extensions: ['xlsx'] }],
        properties: [],
      })
      .then((file) => {
        if (!file.canceled && file.filePath) {
          return file.filePath.toString();
        }
        return '';
      })
      .catch(() => {
        // console.log(err);
      });
    if (filePath) {
      workbook.xlsx
        .writeBuffer()
        .then((buf) => {
          return fs.writeFileSync(filePath, buf, 'binary');
        })
        .catch(() => {
          // console.log(err);
        });
    }
  }, [config, scores]);
  const [sort, setSort] = React.useState<
    '' | 'workAgeUp' | 'workAgeDown' | 'scoreUp' | 'scoreDown'
  >('');
  const onClickWorkAge = React.useCallback(() => {
    setSort((wa) => {
      if (wa !== 'workAgeUp' && wa !== 'workAgeDown') {
        return 'workAgeDown';
      }
      if (wa === 'workAgeUp') {
        return '';
      }
      if (wa === 'workAgeDown') {
        return 'workAgeUp';
      }
      return '';
    });
  }, []);
  const onClickScore = React.useCallback(() => {
    setSort((wa) => {
      if (wa !== 'scoreUp' && wa !== 'scoreDown') {
        return 'scoreDown';
      }
      if (wa === 'scoreUp') {
        return '';
      }
      if (wa === 'scoreDown') {
        return 'scoreUp';
      }
      return '';
    });
  }, []);
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
            <td className={`${styles.td} ${styles.sort}`} style={{ width: 50 }}>
              <button
                className={styles.sortBtn}
                type="button"
                onClick={onClickWorkAge}
              >
                <span>经验</span>
                <div className={styles.caretInit}>
                  <i
                    className={`fa fa-caret-up ${
                      sort === 'workAgeUp' ? styles.active : ''
                    }`}
                  />
                  <i
                    className={`fa fa-caret-down ${
                      sort === 'workAgeDown' ? styles.active : ''
                    }`}
                  />
                </div>
              </button>
            </td>
            <td className={`${styles.td} ${styles.sort}`}>
              <button
                className={styles.sortBtn}
                type="button"
                onClick={onClickScore}
              >
                <span>分数</span>
                <div className={styles.caretInit}>
                  <i
                    className={`fa fa-caret-up ${
                      sort === 'scoreUp' ? styles.active : ''
                    }`}
                  />
                  <i
                    className={`fa fa-caret-down ${
                      sort === 'scoreDown' ? styles.active : ''
                    }`}
                  />
                </div>
              </button>
            </td>
            <td colSpan={3} className={styles.td} style={{ width: '60%' }}>
              关键字
            </td>
          </tr>
        </thead>
        <tbody>
          {scores
            .map((s) => ({ ...s, age: parseInt(s.workAge, 10) || 0 }))
            .sort((a, b) => {
              if (sort === 'workAgeDown') {
                return a.workAge > b.workAge ? -1 : 1;
              }
              if (sort === 'workAgeUp') {
                return a.workAge < b.workAge ? -1 : 1;
              }
              if (sort === 'scoreDown') {
                return a.score > b.score ? -1 : 1;
              }
              if (sort === 'scoreUp') {
                return a.score < b.score ? -1 : 1;
              }
              return a.score > b.score ? -1 : 1;
            })
            .map((v, i) => (
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
                    <br />
                    {trackPhone(v.text)}
                  </button>
                </td>
                <td className={styles.td}>{trackWorkAge(v.text)}</td>
                <td className={styles.score}>{v.score?.toFixed(2)}</td>
                {v.keywords.map((k) => (
                  <td className={styles.td} key={k.name}>
                    {k.children.map((w) => (
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
      <footer className={styles.footer}>
        <button
          className={styles.exportExcel}
          type="button"
          onClick={onClickExport}
        >
          导出 Excel
        </button>
      </footer>
    </div>
  ) : (
    <></>
  );
};

export default ScoreList;
