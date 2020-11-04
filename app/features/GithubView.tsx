import React from 'react';
import { GhOpt, HTMLWebview } from './type';
import styles from './ScoreList.css';

type Props = {
  url: string;
};
const GithubView: React.FC<Props> = ({ url }) => {
  const webviewRef = React.useRef<HTMLWebview | null>(null);
  const [repos, setRepos] = React.useState(NaN);
  const [contrib, setContrib] = React.useState(NaN);
  const [followers, setFollowers] = React.useState(NaN);
  // const [calendar, setCalendar] = React.useState('');
  React.useEffect(() => {
    webviewRef.current?.addEventListener('dom-ready', () => {
      webviewRef.current
        ?.executeJavaScript(
          `JSON.stringify({
            repos: parseInt(document.querySelector('.Counter')?.textContent),
            followers: parseInt(document.querySelector(".js-profile-editable-area a")?.textContent?.trim()),
            contrib: parseInt(document.querySelector('.js-yearly-contributions h2')?.textContent?.trim()),
            calendar: "document.querySelector('.js-calendar-graph-svg').outerHTML",
          })`,
          false
        )
        .then((data) => {
          const result = JSON.parse(data) as GhOpt;
          if (typeof result.repos === 'number') {
            setRepos(result.repos);
          }
          if (typeof result.contrib === 'number') {
            setContrib(result.contrib);
          }
          if (typeof result.followers === 'number') {
            setFollowers(result.followers);
          }
          // setCalendar(result.calendar);
        });
    });
  }, [webviewRef]);
  const tail = url.split('://').pop();
  const [host, path] = tail?.split('/') || [];
  const urlOk = `https://${host}/${path.split('?').shift()}`;
  return url.includes('github') ? (
    <div>
      <webview ref={webviewRef} src={urlOk} style={{ display: 'none' }} />
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
