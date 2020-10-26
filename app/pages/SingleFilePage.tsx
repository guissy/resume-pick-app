import React from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import routes from '../constants/routes.json';
import styles from './WelcomePage.css';
import DropZone from '../features/DropZone';
import ScoreList from '../features/ScoreList';
import { DocFile, MyApp, ScoreFile } from '../features/type';
import { selectNameScore, updateNameScore } from '../features/scoreSlice';
import { initConfigAsync, selectConfig } from '../features/configSlice';

function useNameScore() {
  const nameScore = useSelector(selectNameScore);
  const nameScoreRef = React.useRef<ScoreFile[] | null>(null);
  nameScoreRef.current = React.useMemo(() => nameScore, [nameScore]);
  return nameScoreRef;
}

export default function SingleFilePage(): JSX.Element {
  const dispatch = useDispatch();
  const config = useSelector(selectConfig);
  React.useEffect(() => {
    dispatch(initConfigAsync());
  }, [dispatch]);
  // config 更改后，重新计算
  const nameScoreRef = useNameScore();
  React.useEffect(() => {
    const ns = nameScoreRef.current;
    if (ns) {
      ns.forEach((f) => {
        (remote.app as MyApp).parseResume(
          f.path,
          config,
          (_p, score, keywords) => {
            dispatch(
              updateNameScore({
                name: f.name,
                path: f.path,
                score,
                keywords: cloneDeep(keywords),
              })
            );
          }
        );
      });
    }
  }, [dispatch, nameScoreRef, config]);
  const onDrop = React.useCallback(
    (_files: DocFile[]) => {
      if (_files.length > 0) {
        _files.forEach((f) => {
          (remote.app as MyApp).parseResume(
            f.path,
            config,
            (_p, score, keywords) => {
              dispatch(
                updateNameScore({
                  name: f.name,
                  path: f.path,
                  score,
                  keywords: cloneDeep(keywords),
                })
              );
            }
          );
        });
      }
    },
    [dispatch, config]
  );
  return (
    <div className={styles.container} data-tid="container">
      <main className={styles.main}>
        <ScoreList />
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
