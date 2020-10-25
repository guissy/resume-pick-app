import React from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import { useDispatch } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import routes from '../constants/routes.json';
import styles from './WelcomePage.css';
import DropZone from '../features/DropZone';
import ScoreList from '../features/ScoreList';
import { DocFile, MyApp } from '../features/type';
import { updateNameScore } from '../features/scoreSlice';

export default function SingleFilePage(): JSX.Element {
  const dispatch = useDispatch();
  const onDrop = React.useCallback(
    (_files: DocFile[]) => {
      if (_files.length > 0) {
        _files.forEach((f) => {
          (remote.app as MyApp).parseResume(f.path, (_p, score, keywords) => {
            dispatch(
              updateNameScore({
                name: f.name,
                path: f.path,
                score,
                keywords: cloneDeep(keywords),
              })
            );
          });
        });
      }
    },
    [dispatch]
  );
  return (
    <div className={styles.container} data-tid="container">
      <main className={styles.main}>
        <ScoreList />
        <DropZone onDrop={onDrop} accept={['.doc', '.pdf']} />
        <Link className={styles.back} to={routes.WELCOME}>
          返回
        </Link>
      </main>
    </div>
  );
}
