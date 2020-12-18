import React from 'react';
import { remote } from 'electron';
import path from 'path';
import { GhOpt, HTMLWebview } from '../type';
import styles from './ScoreList.css';
import parseRepo from '../parser/parseRepo';

type Props = {
  url: string;
};
const GithubView: React.FC<Props> = ({ url }) => {
  const webviewRef = React.useRef<
    (HTMLWebview & { loadURL: (url: string) => void }) | null
  >(null);
  const [repos, setRepos] = React.useState(NaN);
  const [contrib, setContrib] = React.useState(NaN);
  const [followers, setFollowers] = React.useState(NaN);
  const tail = url.split('://').pop();
  const [host, pathname] = tail?.split('/') || [];
  const urlOk = `https://${host}/${pathname.split('?').shift()}`;
  const [status, setStatus] = React.useState('prepare...');
  const [repoInfo, setRepoInfo] = React.useState('');
  React.useEffect(() => {
    webviewRef.current?.addEventListener('dom-ready', async () => {
      if (status === 'prepare...') {
        setStatus('loading...');
        const data = await webviewRef.current?.executeJavaScript(
          `JSON.stringify({
            repos: parseInt(document.querySelector('.Counter')?.textContent),
            followers: parseInt(document.querySelector(".js-profile-editable-area a")?.textContent?.trim()),
            contrib: parseInt(document.querySelector('.js-yearly-contributions h2')?.textContent?.trim()),
            calendar: "document.querySelector('.js-calendar-graph-svg').outerHTML",
          })`,
          false
        );
        const result = JSON.parse(data || '{}') as GhOpt;
        if (typeof result.repos === 'number') {
          setRepos(result.repos);
        }
        if (typeof result.followers === 'number') {
          setFollowers(result.followers);
        }
        if (typeof result.contrib === 'number') {
          setContrib(result.contrib);
          if (result.contrib > 5) {
            await webviewRef.current?.executeJavaScript(
              `document.querySelector('a[href$="?tab=repositories"]')?.click()`,
              false
            );
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const json = await webviewRef.current?.executeJavaScript(
              `JSON.stringify(Array.from(document
              .querySelectorAll("#user-repositories-list > ul > li"))
              .map(li => {
                const href = li.querySelector('[itemprop*="codeRepository"]')?.href;
                const commits = Array.from(li.querySelector('svg polyline')?.points || [])
                .map(p => p.y)
                .reduce((s, v) => s + v - 1, 0);
                return [href, commits];
              })
              .sort((a, b)=> a[1] - b[1] > 0 ? -1 : 1))`,
              false
            );
            const top30 = JSON.parse(json || '[]') as [string, number][];
            const first = top30[0]?.[0];
            if (first) {
              const repo = `${first}.git`.replace(
                'github.com',
                'github.com.cnpmjs.org'
              );
              const dir = remote.app.getPath('temp');
              const name = `repo_${Date.now()}`;
              const {
                commits,
                nCode,
                commentRate,
                linesInFile,
                linesInCommit,
              } = await parseRepo(repo, path.join(dir, name), setStatus);
              setRepoInfo(`file ${linesInFile}
commits ${commits.length}
lines ${nCode}
comments ${(commentRate * 100).toFixed(1)}%
commit/line ${linesInCommit}
`);
              setStatus('');
            }
          } else {
            setStatus('');
          }
        }
      }
    });
  }, [webviewRef, status]);

  return ['github.com', 'gitee.com'].includes(host) ? (
    <div>
      <webview
        ref={webviewRef}
        src={urlOk}
        style={{
          width: '100vw',
          opacity: 0.5,
          position: 'absolute',
          zIndex: -1,
          display: 'none',
        }}
      />
      {repos >= 0 && (
        <>
          <span className={styles.subName}>repo</span>
          <span className={styles.gained}>{repos}</span>
          <br />
        </>
      )}
      {followers >= 0 && (
        <>
          <span className={styles.subName}>followers</span>
          <span className={styles.gained}>{followers}</span>
          <br />
        </>
      )}
      {contrib >= 0 && (
        <>
          <span className={styles.subName}>contrib</span>
          <span className={styles.gained}>{contrib}</span>
        </>
      )}
      <br />
      <span style={{ color: '#444444', display: 'block', fontSize: '0.8rem' }}>
        {status}
      </span>
      {repoInfo?.split('\n').map((s) => (
        <span key={s} style={{ color: '#eeeeee', display: 'block' }}>
          {s}
        </span>
      ))}
      {/* <span dangerouslySetInnerHTML={{ __html: calendar }} /> */}
    </div>
  ) : (
    <></>
  );
};

export default GithubView;
