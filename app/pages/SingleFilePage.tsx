import React from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import delay from 'lodash/delay';
import dayjs from 'dayjs';
import { usePrevious } from 'react-use';
import routes from '../constants/routes.json';
import styles from './SingleFilePage.css';
import DropZone from '../features/DropZone';
import ScoreList from '../features/ScoreList';
import { DocFile, MyApp, ScoreFile } from '../features/type';
import {
  selectNameScore,
  selectSearch,
  updateNameScore,
  updateSearch,
} from '../features/scoreSlice';
import { selectConfig } from '../features/configSlice';

export function useNameScore() {
  const nameScore = useSelector(selectNameScore);
  const nameScoreRef = React.useRef<ScoreFile[] | null>(null);
  nameScoreRef.current = React.useMemo(() => nameScore, [nameScore]);
  return nameScoreRef;
}

export default function SingleFilePage(): JSX.Element {
  const dispatch = useDispatch();
  const config = useSelector(selectConfig);
  const [updating, setUpdating] = React.useState(false);
  const [updateMap] = React.useState(new Map<string, number>());
  // config 更改后，重新计算
  const nameScoreRef = useNameScore();
  const configPrev = usePrevious(config);
  const search = useSelector(selectSearch);
  const searchPrev = usePrevious(search);
  const onUpdateSearch = React.useCallback(
    (kw: string) => {
      dispatch(updateSearch(kw));
    },
    [dispatch]
  );
  const updateOne = React.useCallback(
    (f: ScoreFile | DocFile) => {
      updateMap.set(f.path, 0);
      setUpdating(true);
      (remote.app as MyApp).parseResume(f.path, config, search, (r) => {
        dispatch(
          updateNameScore({
            name: f.name,
            path: f.path,
            score: r.score,
            keywords: cloneDeep(r.keywords),
            text: r.text,
            phone: r.phone,
            workAge: r.workAge,
            links: r.links,
            sentiment: r.sentiment,
            search: r.search,
          })
        );
        updateMap.set(f.path, Date.now());
        if (Array.from(updateMap.values()).every((time) => !!time)) {
          delay(() => setUpdating(false), 500);
        }
      });
    },
    [config, dispatch, updateMap, search]
  );
  React.useEffect(() => {
    if (
      (!!configPrev && config !== configPrev) ||
      ((!!searchPrev || !!search) && search !== searchPrev)
    ) {
      const ns = nameScoreRef.current;
      if (ns) {
        ns.forEach(updateOne);
      }
    }
  }, [search, searchPrev, config, configPrev, updateOne, nameScoreRef]);
  const onDrop = React.useCallback(
    (_files: DocFile[]) => {
      if (_files.length > 0) {
        _files.forEach(updateOne);
      }
    },
    [updateOne]
  );

  const day =
    updateMap.size > 0
      ? dayjs([...updateMap.values()][0]).format('YYYY-MM-DD hh:mm:ss')
      : '';
  return (
    <div className={styles.container} data-tid="container">
      <p
        className={styles.updating}
        style={{ position: updating ? 'fixed' : 'absolute' }}
      >
        {(updating || day) && (
          <span>{updating ? 'loading...' : `Update at ${day}`}</span>
        )}
        {updating && (
          <progress
            value={[...updateMap.values()].filter(Boolean).length}
            max={updateMap.size}
          />
        )}
      </p>
      <main className={styles.main}>
        <ScoreList search={search} setSearch={onUpdateSearch} />
        <DropZone onDrop={onDrop} accept={['.doc', '.docx', '.txt', '.pdf']} />
      </main>
      <Link className={styles.back} to={routes.WELCOME}>
        返回
      </Link>
      <Link className={styles.setting} to={routes.SETTING}>
        设置
      </Link>
    </div>
  );
}
