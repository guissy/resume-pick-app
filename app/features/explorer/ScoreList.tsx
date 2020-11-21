import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shell } from 'electron';
import { useDebounce } from 'react-use';
import uniqBy from 'lodash/uniqBy';
import styles from './ScoreList.css';
import {
  selectNameScore,
  removeNameScore,
  clearNameScore,
} from '../scoreSlice';
import { getBlogByLink, getGithubByLink } from '../parser/tractWorkAge';
import { selectConfig, updateConfig } from '../configSlice';
import Image, { imgKey } from '../icon/image';
import GithubView from './GithubView';
import { ScoreFile, SortKey } from '../type';
import TreeMap from './TreeMap';
import ResumeView from './ResumeView';
import exportExcel from '../parser/exportExcel';

type File = ScoreFile | undefined;
type Props = {
  search: string;
  setSearch: (kw: string) => void;
};

function getLevelStyle(level: string) {
  const classNames = [
    styles.level1,
    styles.level2,
    styles.level3,
    styles.level4,
    styles.level5,
    styles.level6,
    styles.level7,
  ];
  const [n] = level?.match(/\d/g) || ['1'];
  const index = parseInt(n, 10);
  if (index > 0 && index <= classNames.length) {
    return `${styles.level} ${classNames[index - 1]}`;
  }
  return '';
}

const ScoreList: React.FC<Props> = ({ search, setSearch }) => {
  const scores = useSelector(selectNameScore);
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();
  const onClickExport = React.useCallback(() => {
    exportExcel(config, scores);
  }, [config, scores]);
  const [sort, setSort] = React.useState<SortKey>('');
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
  const optionDefault = React.useMemo(() => {
    return imgKey.filter((img) =>
      (config || [])
        .map((c) => c.children.map((w) => w.name))
        .flat()
        .includes(img)
    );
  }, [config]);
  const [cacheScore] = React.useState(new Map<string, number>()); // 缓存大于0
  const [showFull, setShowFull] = React.useState(true);
  const [gitRepo, setGitRepo] = React.useState(false);
  const [option, setOption] = React.useState(
    new Map(optionDefault.map((opt) => [opt, true]))
  );
  React.useEffect(() => {
    if (Array.isArray(config)) {
      setOption((opt) => {
        config.forEach((k) => {
          k.children.forEach((w) => {
            if (optionDefault.includes(w.name)) {
              opt.set(w.name, w.score !== 0);
              if (w.score !== 0) {
                cacheScore.set(w.name, w.score);
              }
            }
          });
        });
        return new Map(opt);
      });
    }
  }, [optionDefault, cacheScore, config]);
  const [checkedAll, setCheckedAll] = React.useState(true);
  const onClickOpt = React.useCallback(
    (opt: string) => {
      option.set(opt, !option.get(opt));
      setOption(new Map(option));
      const configOk = config.map((k) => ({
        ...k,
        children: k.children.map((w) => {
          let score = w.score || 0;
          if (option.has(w.name)) {
            score = option.get(w.name) ? cacheScore.get(w.name) || score : 0;
          }
          return {
            ...w,
            score,
          };
        }),
      }));
      setCheckedAll(false);
      dispatch(updateConfig({ default: configOk }));
    },
    [option, config, cacheScore, dispatch]
  );
  const onClickCheckAll = React.useCallback(() => {
    setCheckedAll(!checkedAll);
    if (config) {
      setOption(new Map(optionDefault.map((opt) => [opt, true])));
      const configOk = config.map((k) => ({
        ...k,
        children: k.children.map((w) => {
          let score = w.score || 0;
          if (option.has(w.name)) {
            score = !checkedAll ? cacheScore.get(w.name) || w.score : 0;
          }
          return {
            ...w,
            score,
          };
        }),
      }));
      dispatch(updateConfig({ default: configOk }));
    }
  }, [checkedAll, config, cacheScore, option, optionDefault, dispatch]);
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
  const [searchTxt, setSearchTxt] = React.useState(search);
  useDebounce(() => setSearch(searchTxt), 2000, [searchTxt]);
  const onClear = React.useCallback(() => {
    dispatch(clearNameScore());
  }, [dispatch]);
  const onRemove = React.useCallback(
    (path) => {
      dispatch(removeNameScore(path));
    },
    [dispatch]
  );
  return scores.length > 0 ? (
    <div role="presentation" className={styles.tableWrap}>
      <dialog
        open={showDialog}
        style={{
          position: 'fixed',
          padding: 0,
          zIndex: 100,
          width: '80vw',
          top: 10,
        }}
      >
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
        <div className={styles.opts}>
          <label htmlFor="optCheckbox">
            <input
              id="optCheckbox"
              type="checkbox"
              onChange={onClickCheckAll}
              checked={checkedAll}
            />
            全选
          </label>
          <ul className={styles.icons}>
            {config
              .map((k) => k.children.map((w) => w.name))
              .flat()
              .filter((w) => option.has(w))
              .map((w) => (
                <li
                  key={w}
                  style={{
                    backgroundColor: option.get(w) ? '#333' : '#aaa',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onClickOpt(w)}
                    className={styles.opt}
                    style={{
                      filter: option.get(w) ? 'unset' : 'grayscale(0.9)',
                    }}
                  >
                    <img
                      src={Image[`${w}_png` as keyof typeof Image]}
                      alt={w}
                    />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            <td className={styles.td} style={{ width: 32 }}>
              序号
            </td>
            <td className={styles.td} style={{ width: 260 }}>
              文件
            </td>
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
            <td colSpan={1} className={styles.td} style={{ width: 150 }}>
              github
            </td>
            <td colSpan={1} className={styles.td} style={{ width: 'auto' }}>
              关键字
            </td>
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
              if (sort === 'sentimentDown') {
                return a.sentiment > b.sentiment ? -1 : 1;
              }
              if (sort === 'sentimentUp') {
                return a.sentiment < b.sentiment ? -1 : 1;
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
                    <ul className={styles.icons}>
                      {uniqBy(
                        v.keywords
                          .map((k) => k.children.map((w) => w))
                          .flat()
                          .filter((w) =>
                            Array.from(option.entries())
                              .filter(([_k, b]) => _k && b)
                              .map(([k]) => k)
                              .includes(w.name)
                          ),
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
                    {v.level}
                  </span>
                  {gitRepo &&
                    getGithubByLink(v.links).map((link) => (
                      <GithubView key={link} url={link} />
                    ))}
                  {v.links.map((link) => (
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
