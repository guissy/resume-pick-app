import React from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import delay from 'lodash/delay';
import dayjs from 'dayjs';
import routes from '../constants/routes.json';
import styles from './SingleFilePage.css';
import DropZone from '../features/DropZone';
import ScoreList from '../features/ScoreList';
import { DocFile, MyApp, ScoreFile } from '../features/type';
import { selectNameScore, updateNameScore } from '../features/scoreSlice';
import { initConfigAsync, selectConfig } from '../features/configSlice';
import ResumeView from '../features/ResumeView';

function useNameScore() {
  const nameScore = useSelector(selectNameScore);
  const nameScoreRef = React.useRef<ScoreFile[] | null>(null);
  nameScoreRef.current = React.useMemo(() => nameScore, [nameScore]);
  return nameScoreRef;
}
type File = ScoreFile | undefined;
export default function SingleFilePage(): JSX.Element {
  const dispatch = useDispatch();
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
  const config = useSelector(selectConfig);
  const [updating, setUpdating] = React.useState(false);
  const [updateMap] = React.useState(new Map<string, number>());
  React.useEffect(() => {
    dispatch(initConfigAsync());
  }, [dispatch]);
  // config 更改后，重新计算
  const nameScoreRef = useNameScore();
  const updateOne = React.useCallback(
    (f: ScoreFile | DocFile) => {
      updateMap.set(f.path, 0);
      setUpdating(true);
      (remote.app as MyApp).parseResume(f.path, config, (r) => {
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
          })
        );
        updateMap.set(f.path, Date.now());
        if (Array.from(updateMap.values()).every((time) => !!time)) {
          delay(() => setUpdating(false), 500);
        }
      });
    },
    [config, dispatch, updateMap]
  );
  React.useEffect(() => {
    const ns = nameScoreRef.current;
    if (ns) {
      ns.forEach(updateOne);
    }
  }, [updateOne, nameScoreRef]);
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
      <dialog
        open={showDialog}
        style={{ padding: 0, zIndex: 100, width: '70vw', top: 10 }}
      >
        <ResumeView resume={resumeActive} onClose={onCloseResume} />
      </dialog>
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
        <ScoreList onClickResume={onOpenResume} onClickTable={onCloseResume} />
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
