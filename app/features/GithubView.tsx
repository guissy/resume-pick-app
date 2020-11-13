import React from 'react';
import { remote } from 'electron';
import { exec } from 'child_process';
import fs from 'fs';
import { GhOpt, HTMLWebview } from './type';
import styles from './ScoreList.css';

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
  const [host, path] = tail?.split('/') || [];
  const urlOk = `https://${host}/${path.split('?').shift()}`;
  const [status, setStatus] = React.useState('prepare...');
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
            await new Promise((resolve) => setTimeout(resolve, 2500));
            const json = await webviewRef.current?.executeJavaScript(
              `JSON.stringify(Array.from(document
              .querySelectorAll("#user-repositories-list > ul > li"))
              .map(li => {
                const href = li.querySelector('[itemprop*="codeRepository"]')?.href;
                const commits = Array.from(li.querySelector('svg polyline')?.points || [])
                .map(p => p.y)
                .reduce((s, v) => s += v - 1, 0);
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
              const cloneCli = `(cd ${dir} && git clone ${repo} ${name})`;
              setStatus(`git clone ${first.split('/').pop()}`);
              exec(cloneCli, (err) => {
                if (err) {
                  setStatus(`git error ${err}`);
                } else {
                  const src = [
                    'src',
                    'app',
                    'App',
                    'front',
                    'web',
                    'server',
                  ].find((folder) => fs.existsSync(`${dir}${name}/${folder}`));
                  const inspectCli =
                    'PYTHONIOENCODING=utf-8 npx gitinspector -lmrTw -fjs,ts,jsx,tsx ' +
                    ` && npx cloc ${src} && eslintcc -r=all -sr -a -nlc ${src}/**/*.* && jscpd ${src} `;
                  exec(inspectCli, (er, stdout) => {
                    if (er) {
                      setStatus(`inspect error ${er}`);
                    } else {
                      setStatus(stdout);
                    }
                  });
                }
              });
            }
          } else {
            setStatus('');
          }
        }
      }
    });
  }, [webviewRef, status]);

  return url.includes('github') ? (
    <div>
      <webview
        ref={webviewRef}
        src={urlOk}
        style={{
          width: '100vw',
          opacity: 0.5,
          position: 'absolute',
          zIndex: -1,
        }}
      />
      <span style={{ color: '#444444', display: 'block' }}>{status}</span>
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
      {/* <br /> */}
      {/* <span dangerouslySetInnerHTML={{ __html: calendar }} /> */}
    </div>
  ) : (
    <></>
  );
};

export default GithubView;
