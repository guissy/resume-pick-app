import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shell } from 'electron';
import { useDebounce } from 'react-use';
import uniqBy from 'lodash/uniqBy';
import styles from './ScoreList.css';
import {
  clearNameScore,
  removeNameScore,
  selectNameScore,
} from '../scoreSlice';
import { getBlogByLink, getGithubByLink } from '../parser/tractWorkAge';
import { selectConfig } from '../configSlice';
import Image from '../icon/image';
import GithubView from './GithubView';
import { ScoreFile } from '../type';
import TreeMap from './TreeMap';
import ResumeView from './ResumeView';
import exportExcel from '../parser/exportExcel';
import { getLevelStyle, toggleSort } from './scoreListUtil';
import TechGroup from './TechGroup';

type File = ScoreFile | undefined;
type Props = {
  search?: string;
  setSearch?: (kw: string) => void;
};

const ScoreList: React.FC<Props> = ({ search, setSearch }) => {
  const scores = useSelector(selectNameScore);
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();
  const onClickExport = React.useCallback(() => {
    exportExcel(config, scores);
  }, [config, scores]);
  const [sort, setSort] = React.useState('');
  const onClickWorkAge = React.useCallback(() => {
    setSort(toggleSort(['workAgeUp', 'workAgeDown']));
  }, []);
  const onClickScore = React.useCallback(() => {
    setSort(toggleSort(['scoreUp', 'scoreDown']));
  }, []);

  const [showFull, setShowFull] = React.useState(true);
  const [gitRepo, setGitRepo] = React.useState(false);

  const onClickLink = React.useCallback((e, url) => {
    e.preventDefault();
    const urlOk = url.startsWith('http') ? url : `http://${url}`;
    shell.openExternal(urlOk);
  }, []);

  const [showDialog, setShowDialog] = React.useState(false);
  const [resumeActive, setResumeActive] = React.useState<File>();
  const onOpenResume = React.useCallback((scoreFile: ScoreFile) => {
    setShowDialog(true);
    setResumeActive(scoreFile);
  }, []);
  const onCloseResume = React.useCallback(() => {
    setShowDialog(false);
    setResumeActive(undefined);
  }, []);
  const [searchTxt, setSearchTxt] = React.useState(search || '');
  useDebounce(() => setSearch?.(searchTxt), 2000, [searchTxt]);
  const onClear = React.useCallback(() => {
    dispatch(clearNameScore());
  }, [dispatch]);
  const onRemove = React.useCallback(
    (path) => {
      dispatch(removeNameScore(path));
    },
    [dispatch]
  );
  const [techNames, setTechNames] = React.useState<string[]>([]);
  return scores.length > 0 ? (
    <div role="presentation" className={styles.tableWrap}>
      <dialog open={showDialog} className={styles.dialog}>
        <ResumeView resume={resumeActive} onClose={onCloseResume} />
      </dialog>
      <header className={styles.header}>
        <label htmlFor="showFull">
          <input
            id="showFull"
            type="checkbox"
            onChange={() => setShowFull(!showFull)}
            checked={showFull}
          />
          Show Full
        </label>
        <label htmlFor="gitRepo">
          <input
            id="gitRepo"
            type="checkbox"
            onChange={() => setGitRepo(!gitRepo)}
            checked={gitRepo}
          />
          Git Repo
        </label>
        <button className={styles.trash} onClick={onClear} type="button">
          <span>清空</span>
          <i className="fa fa-trash" />
        </button>
        <label htmlFor="search" className={styles.searchWrap}>
          <i className="fa fa-search" />
          <input
            className={styles.search}
            id="search"
            type="search"
            value={searchTxt}
            placeholder="输入关键字搜索简历"
            onChange={(e) => {
              setSearchTxt(e.target.value);
            }}
          />
        </label>
        <TechGroup config={config} setTechNames={setTechNames} />
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.td} style={{ width: 32 }}>
              序号
            </th>
            <th className={styles.td} style={{ width: 260 }}>
              文件
            </th>
            <th className={`${styles.td} ${styles.sort}`} style={{ width: 50 }}>
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
            </th>
            <th className={`${styles.td} ${styles.sort}`}>
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
            </th>
            <th colSpan={1} className={styles.td} style={{ width: 150 }}>
              github
            </th>
            <th colSpan={1} className={styles.td} style={{ width: 'auto' }}>
              关键字
            </th>
          </tr>
        </thead>
        <tbody>
          {scores
            .map((s) => ({ ...s }))
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
              return a.levelValue > b.levelValue ? -1 : 1;
            })
            .map((v, i) => (
              <tr key={v.path}>
                <td className={styles.td}>
                  {i + 1}
                  <br />
                  <button
                    className={styles.trash}
                    onClick={() => onRemove(v.path)}
                    type="button"
                  >
                    <i className="fa fa-trash" />
                  </button>
                </td>
                <td className={styles.td}>
                  <button
                    type="button"
                    className={styles.link}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenResume(v);
                    }}
                  >
                    {showFull && (
                      <>
                        <span className={styles.namePhone}>{v.name}</span>
                        <span className={styles.namePhone}>{v.phone}</span>
                        <span className={styles.namePhone}>{v.school}</span>
                      </>
                    )}
                    <span className={styles.namePhone}>{v.salary}</span>
                    <ul className={styles.icons}>
                      {uniqBy(
                        v.keywords
                          .map((k) => k.children.map((w) => w))
                          .flat()
                          .filter((w) => techNames.includes(w.name)),
                        'name'
                      ).map((w) => (
                        <li
                          key={w.name}
                          style={{
                            backgroundColor: `rgba(235, 235, 235, ${
                              w.gained / w.score + 0.2
                            })`,
                          }}
                        >
                          <img
                            src={Image[`${w.name}_png` as keyof typeof Image]}
                            style={{ opacity: w.gained / w.score }}
                            alt={w.name}
                          />
                        </li>
                      ))}
                    </ul>
                  </button>
                </td>
                <td className={styles.td}>
                  {v.workAge > 0 ? `${Math.round(v.workAge * 2) / 2}年` : '-'}
                </td>
                <td className={styles.score}>{v.score?.toFixed(2)}</td>
                <td className={styles.td}>
                  <span
                    className={getLevelStyle(v.level)}
                    title={String(v.levelValue)}
                  >
                    {v.level?.slice(0, 2)}
                    {v.level
                      ?.split('')
                      .filter((c) => c === '+')
                      .map((c, n) => (
                        <i
                          key={c + String(n)}
                          className="fa fa-plus fa-1x"
                          title={c}
                        />
                      ))}
                  </span>
                  {showFull &&
                    gitRepo &&
                    getGithubByLink(v.links).map((link) => (
                      <GithubView key={link} url={link} />
                    ))}
                  {showFull &&
                    v.links.map((link) => (
                      <a
                        key={link}
                        href={link}
                        className={styles.alink}
                        style={{
                          color: getBlogByLink(link) ? '#f1f1f1' : '#999999',
                        }}
                        onClick={(e) => onClickLink(e, link)}
                      >
                        <img
                          className={styles.blogIcon}
                          src={
                            Image[
                              `${getBlogByLink(link)}_png` as keyof typeof Image
                            ]
                          }
                          alt={getBlogByLink(link)}
                        />
                        {link.replace(/(https?:\/\/|www\.)/, '')}
                      </a>
                    ))}
                </td>
                <td className={styles.td}>
                  <TreeMap scoreFile={v} search={search} />
                </td>
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
