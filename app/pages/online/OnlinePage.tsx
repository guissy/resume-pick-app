import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import delay from 'lodash/delay';
import dayjs from 'dayjs';
import { useFirstMountState, usePrevious } from 'react-use';
import routes from '../../constants/routes.json';
import styles from '../desktop/DesktopPage.css';
import { HTMLWebview, MyApp, ScoreFile } from '../../features/type';
import {
  selectSearch,
  updateNameScore,
  updateSearch,
} from '../../features/scoreSlice';
import { selectConfig } from '../../features/configSlice';
import ScoreList from '../../features/explorer/ScoreList';
import userAgent from '../../utils/userAgent';
import useNameScore from '../../utils/useNameScore';

const userInfoScript = `
console.log(JSON.stringify({
  appName: navigator.appName,
  appVersion: navigator.appVersion,
  platform: navigator.platform,
  product: navigator.product,
  userAgent: navigator.userAgent,
}));
window.userNameCache = new Set();
const targetNode = document.querySelector('.resume-content');
const style = document.createElement('style');
style.appendChild(document.createTextNode('.transform-resume-modal { opacity: 0.05 }')); 
document.querySelector('head').appendChild(style);
async function printUserInfo() {
  const userName = targetNode.querySelector('.p-name')?.textContent.trim();
  if (userName) {
    if (!userNameCache.has(userName)) {
      document.querySelector('body').classList.add('inject');
      await new Promise((resolve) => setTimeout(resolve, 10));
      document.querySelector("div.opera-bar > div.opera-content > div.btn-wrapper-left > div:nth-child(2) > button")?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const link = document.querySelector(".transform-resume-modal input")?.value;
      const userInfo = {
        path: link || userName,
        name: userName,
        workAge: targetNode.querySelector('.basic-info > p:nth-child(4)')?.textContent.trim(),
        basic: targetNode.querySelector('.basic-info')?.textContent.trim(),
        text: targetNode.querySelector('.resume-info')?.textContent.trim(),
      }
      console.log(JSON.stringify(userInfo));
      document.querySelector(".transform-resume-modal button")?.click();
      document.querySelector('body').classList.remove('inject');
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
        // 'https://easy.lagou.com/talent/search/list.htm?positionName=web前端开发',
        'https://www.baidu.com',
    },
  } = useLocation<{
    url: string;
  }>();
  const dispatch = useDispatch();
  const config = useSelector(selectConfig);
  const [updating, setUpdating] = React.useState(false);
  const [updateMap] = React.useState(new Map<string, number>());
  const [scoreMap] = React.useState(new Map<string, string>());
  const [levelMap] = React.useState(new Map<string, string>());
  const search = useSelector(selectSearch);
  const onUpdateSearch = React.useCallback(
    (kw: string) => {
      dispatch(updateSearch(kw));
    },
    [dispatch]
  );
  // config 更改后，重新计算
  const updateOne = React.useCallback(
    (f: ScoreFile) => {
      if (!updateMap.has(f.path)) {
        updateMap.set(f.path, 0);
        setUpdating(true);
        (remote.app as MyApp).parseResumeText(
          f.path,
          config,
          search,
          (r) => {
            dispatch(
              updateNameScore({
                name: f.name,
                path: f.path,
                score: r.score,
                level: r.level,
                levelValue: r.levelValue,
                school: r.school,
                degree: r.degree,
                salary: r.salary,
                keywords: cloneDeep(r.keywords),
                text: r.text,
                phone: r.phone,
                workAge: r.workAge || f.workAge,
                links: r.links,
                sentiment: r.sentiment,
                search: r.search,
              })
            );
            updateMap.set(f.path, Date.now());
            scoreMap.set(f.name, r.score.toFixed(1));
            levelMap.set(f.name, r.level);
            if (Array.from(updateMap.values()).every((time) => !!time)) {
              delay(() => setUpdating(false), 500);
            }
          },
          f.text
        );
      }
    },
    [config, dispatch, updateMap, scoreMap, levelMap, search]
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
      webviewRef.current?.addEventListener('console-message', (evt) => {
        const e = evt as Event & { sourceId: string; message: string };
        if (e.sourceId === '') {
          try {
            const json = JSON.parse(e.message) as ScoreFile & { basic: string };
            if (json.path) {
              const text = (json.text + json.basic).replace(
                /Created with Sketch./g,
                ''
              );
              const file = { ...json, text };
              setOnlineFile(file);
              updateOne(file);
            } else {
              // eslint-disable-next-line no-console
              console.warn(json);
            }
          } catch {
            // eslint-disable-next-line no-console
            console.warn('parse json error: ', e.message);
          }
        }
      });
      webviewRef.current?.addEventListener('dom-ready', async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await webviewRef.current?.executeJavaScript(
          `document.querySelector("#root .talent-item-content .item-user .name")?.click();`,
          false
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await webviewRef.current?.executeJavaScript(userInfoScript, false);
      });
    }
  }, [webviewRef, isFirstMount, updateOne]);
  const nameScoreRef = useNameScore();
  const configPrev = usePrevious(config);
  const searchPrev = usePrevious(search);
  React.useEffect(() => {
    if (
      (!!configPrev && config !== configPrev) ||
      ((!!searchPrev || !!search) && search !== searchPrev)
    ) {
      const ns = nameScoreRef.current;
      updateMap.clear();
      if (ns) {
        ns.forEach(updateOne);
      }
    }
  }, [
    search,
    searchPrev,
    config,
    configPrev,
    updateOne,
    nameScoreRef,
    updateMap,
  ]);
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
        <ScoreList search={search} setSearch={onUpdateSearch} />
      </dialog>
      <main className={styles.main}>
        <webview
          ref={webviewRef}
          src={url}
          style={{ width: '100%', height: '100vh' }}
          useragent={userAgent()}
        />
        <button
          key={onlineFile?.name}
          className={styles.found}
          type="button"
          onClick={onClickShow}
          style={{
            opacity: onlineFile?.name ? 1 : 0.3,
            animationDuration: onlineFile?.name ? '1s' : '0s',
          }}
        >
          <span className={styles.nameBig}>{onlineFile?.name}</span>
          <span className={styles.scoreBig}>
            {scoreMap.get(onlineFile?.name || '')}
          </span>
          <span className={styles.levelBig}>
            {levelMap.get(onlineFile?.name || '')}
          </span>
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
