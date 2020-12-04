import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shell } from 'electron';
import { useDebounce } from 'react-use';
import styles from './ScoreList.css';
import {
  clearNameScore,
  removeNameScore,
  selectNameScore,
} from '../scoreSlice';
import { getGithubByLink } from '../parser/tractWorkAge';
import { selectConfig } from '../configSlice';
import GithubView from './GithubView';
import { ScoreFile } from '../type';
import TreeMap from './TreeMap';
import ResumeView from './ResumeView';
import exportExcel from '../parser/exportExcel';
import { toggleSort } from './scoreListUtil';
import TechFilter from './TechFilter';
import ScoreListSort from './ScoreListSort';
import ScoreListLevel from './ScoreListLevel';
import TechRow from './TechRow';
import ScoreListLink from './ScoreListLink';
import ScoreListStar from './ScoreListStar';

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
  const scoreTables = React.useMemo(
    () =>
      scores
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
        }),
    [sort, scores]
  );
  return scoreTables.length > 0 ? (
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
        <label htmlFor="searchTable" className={styles.searchWrap}>
          <i className="fa fa-search" />
          <input
            className={styles.search}
            id="searchTable"
            type="search"
            value={searchTxt}
            placeholder="输入关键字搜索简历"
            onChange={(e) => {
              setSearchTxt(e.target.value);
            }}
          />
        </label>
        <TechFilter config={config} setTechNames={setTechNames} />
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
              <ScoreListSort name="经验" sort={sort} onClick={onClickWorkAge} />
            </th>
            <th className={`${styles.td} ${styles.sort}`}>
              <ScoreListSort name="分数" sort={sort} onClick={onClickScore} />
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
          {scoreTables.map((v, i) => (
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
                  <ScoreListStar
                    levelSalary={v.levelSalary}
                    levelValue={v.levelValue}
                  />
                  <TechRow keywords={v.keywords} techNames={techNames} />
                </button>
              </td>
              <td className={styles.td}>
                {v.workAge > 0 ? `${Math.round(v.workAge * 2) / 2}年` : '-'}
              </td>
              <td className={styles.score}>{v.score?.toFixed(2)}</td>
              <td className={styles.td}>
                <ScoreListLevel level={v.level} levelValue={v.levelValue} />
                {showFull &&
                  gitRepo &&
                  getGithubByLink(v.links).map((link) => (
                    <GithubView key={link} url={link} />
                  ))}
                {showFull &&
                  v.links.map((url) => (
                    <ScoreListLink key={url} link={url} onClick={onClickLink} />
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
