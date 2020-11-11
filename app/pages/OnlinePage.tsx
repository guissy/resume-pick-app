import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import delay from 'lodash/delay';
import dayjs from 'dayjs';
import { useFirstMountState } from 'react-use';
import routes from '../constants/routes.json';
import styles from './SingleFilePage.css';
import { HTMLWebview, MyApp, ScoreFile } from '../features/type';
import { updateNameScore } from '../features/scoreSlice';
import { selectConfig } from '../features/configSlice';
import ScoreList from '../features/ScoreList';

const userInfoScript = `
window.userNameCache = new Set();
const targetNode = document.querySelector('.resume-content');
function printUserInfo() {
  const userName = targetNode.querySelector('.p-name')?.textContent.trim();
  if (userName) {
    if (!userNameCache.has(userName)) {
      const userInfo = {
        path: userName,
        name: userName,
        workAge: targetNode.querySelector('.basic-info > p:nth-child(4)')?.textContent.trim(),
        text: targetNode.querySelector('.resume-info')?.textContent.trim(),
      }
      console.log(JSON.stringify(userInfo));
    }
    userNameCache.add(userName);
  }
}
if (targetNode) {
  const observer = new MutationObserver(printUserInfo);
  observer.observe(targetNode, { childList: true });
  printUserInfo();
}`;

export default function OnlinePage(): JSX.Element {
  const {
    state: { url } = {
      url:
        'https://easy.lagou.com/talent/search/list.htm?positionName=web前端开发',
    },
  } = useLocation<{
    url: string;
  }>();
  const dispatch = useDispatch();
  const config = useSelector(selectConfig);
  const [updating, setUpdating] = React.useState(false);
  const [updateMap] = React.useState(new Map<string, number>());
  // config 更改后，重新计算
  const updateOne = React.useCallback(
    (f: ScoreFile) => {
      updateMap.set(f.path, 0);
      setUpdating(true);
      (remote.app as MyApp).parseResumeText(
        f.path,
        config,
        (r) => {
          dispatch(
            updateNameScore({
              name: f.name,
              path: f.path,
              score: r.score,
              keywords: cloneDeep(r.keywords),
              text: r.text,
              phone: r.phone,
              workAge: r.workAge || f.workAge,
              links: r.links,
              sentiment: r.sentiment,
            })
          );
          updateMap.set(f.path, Date.now());
          if (Array.from(updateMap.values()).every((time) => !!time)) {
            delay(() => setUpdating(false), 500);
          }
        },
        f.text
      );
    },
    [config, dispatch, updateMap]
  );
  const webviewRef = React.useRef<
    (HTMLWebview & { getURL: () => string }) | null
  >(null);
  const day =
    updateMap.size > 0
      ? dayjs([...updateMap.values()][0]).format('YYYY-MM-DD hh:mm:ss')
      : '';
  const [onlineFile, setOnlineFile] = React.useState<ScoreFile | null>(null);
  const isFirstMount = useFirstMountState();
  React.useEffect(() => {
    if (isFirstMount) {
      webviewRef.current?.addEventListener('did-navigate', async () => {
        webviewRef.current?.executeJavaScript(
          `window.fetch = ((fetch) => {
if (!fetch.inject) {
  return (input, opt) => {
    const p = fetch(input, opt).then(v => v.json());
    p.then(v => console.log(JSON.stringify(v)));
    return p.then(v => ({json: () => v}));
  };
} else {
  return fetch;
}
})(window.fetch)`,
          false
        );
      });
      webviewRef.current?.addEventListener('console-message', (evt) => {
        const e = evt as Event & { sourceId: string; message: string };
        if (e.sourceId === '') {
          const file = JSON.parse(e.message) as ScoreFile;
          if (file.path) {
            file.text?.replace('Created with Sketch.', '');
            setOnlineFile(file);
            updateOne(file);
          } else {
            // eslint-disable-next-line no-console
            console.warn(file);
          }
        }
      });
      webviewRef.current?.addEventListener('dom-ready', async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await webviewRef.current?.executeJavaScript(
          `document.querySelector("#root .talent-item-content .item-user .name")?.click();`,
          false
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        await webviewRef.current?.executeJavaScript(userInfoScript, false);
      });
    }
  }, [webviewRef, isFirstMount, updateOne]);
  const [showDialog, setShowDialog] = React.useState(false);
  const onClickShow = React.useCallback(() => {
    setShowDialog(true);
  }, []);
  const onClickClose = React.useCallback(() => {
    setShowDialog(false);
  }, []);
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
      <dialog
        open={showDialog}
        style={{
          padding: 0,
          zIndex: 100,
          width: '100vw',
          top: 10,
          background: '#333',
        }}
      >
        <button className={styles.close} type="button" onClick={onClickClose}>
          <i className="fa fa-times fa-2x" />
        </button>
        <ScoreList />
      </dialog>
      <main className={styles.main}>
        <webview
          ref={webviewRef}
          src={url}
          style={{ width: '100%', height: '100vh' }}
        />
        <button className={styles.found} type="button" onClick={onClickShow}>
          {onlineFile?.name}
        </button>
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
