import React, { useEffect } from 'react';
import { shell } from 'electron';
import { useKey } from 'react-use';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Highlighter from 'react-highlight-words';
import { ScoreFile } from './type';
import styles from './ResumeView.css';

type Props = {
  resume: ScoreFile | undefined;
  onClose: () => void;
};
const ResumeView: React.FC<Props> = ({ resume, onClose }) => {
  const topElmRef = React.useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (resume && topElmRef.current) {
      topElmRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [resume]);
  const clickOpenNative = React.useCallback(() => {
    if (resume?.path) {
      if (resume?.path.startsWith('http')) {
        shell.openExternal(resume?.path);
      } else {
        shell.openItem(resume.path);
      }
    }
  }, [resume]);
  const [searchTxt, setSearchTxt] = React.useState('2020');
  const keywords = React.useMemo(
    () =>
      (resume?.keywords || [])
        .map((k) => k.children.map((w) => [w.name, ...(w.alias || [])]))
        .flat(2)
        .concat(searchTxt.split(' ')),
    [resume, searchTxt]
  );
  const keywordClassName = React.useMemo(
    () =>
      (resume?.keywords || [])
        .map((k, i) =>
          k.children.map((w) =>
            [w.name, ...(w.alias || [])].map((n) => ({
              [n]: `kw${i} ${w.score > 0 ? 'pos' : 'neg'}_${(w.gained / w.score)
                .toFixed(1)
                .replace('.', '_')}`,
            }))
          )
        )
        .flat(2)
        .concat(searchTxt.split(' ').map((s) => ({ [s]: 'kws' })))
        .reduce((s, v) => ({ ...s, ...v }), {}),
    [resume, searchTxt]
  );
  useKey('Escape', onClose);

  return (
    <div className={styles.wrap}>
      <header style={{ textAlign: 'right' }}>
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
        <button
          type="button"
          onClick={clickOpenNative}
          style={{
            background: 'none',
            border: '1px solid #fff',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          使用本地软件打开此文件
        </button>
        <button type="button" onClick={onClose}>
          <i className="fa fa-times fa-2x" />
        </button>
      </header>
      <article className={styles.article} key={searchTxt}>
        {(resume?.text || '').split('\n').map((content, i) => (
          <p
            key={String(i)}
            style={{ marginBlockStart: 5, marginBlockEnd: 5 }}
            ref={i === 0 ? topElmRef : undefined}
          >
            <Highlighter
              highlightClassName={keywordClassName}
              searchWords={keywords}
              textToHighlight={content}
            />
          </p>
        ))}
      </article>
    </div>
  );
};

export default ResumeView;
