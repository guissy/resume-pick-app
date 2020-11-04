import React from 'react';
import { GhOpt, HTMLWebview } from './type';
import styles from './ScoreList.css';

type Props = {
  url: string;
};
const GithubView: React.FC<Props> = ({ url }) => {
  const webviewRef = React.useRef<HTMLWebview | null>(null);
  const [repos, setRepos] = React.useState(0);
  const [contrib, setContrib] = React.useState(0);
  // const [calendar, setCalendar] = React.useState('');
  React.useEffect(() => {
    webviewRef.current?.addEventListener('dom-ready', () => {
      webviewRef.current
        ?.executeJavaScript(
          `JSON.stringify({
            repos: parseInt(document.querySelector('.Counter').textContent),
            contrib: parseInt(document.querySelector('.js-yearly-contributions h2').textContent.trim()),
            calendar: document.querySelector('.js-calendar-graph-svg').outerHTML,
          })`,
          false
        )
        .then((data) => {
          const result = JSON.parse(data) as GhOpt;
          setRepos(result.repos);
          setContrib(result.contrib);
          // setCalendar(result.calendar);
        });
    });
  }, [webviewRef]);
  return (
    <div>
      <webview ref={webviewRef} src={url} style={{ display: 'none' }} />
      <span className={styles.subName}>repo</span>
      <span className={styles.gained}>{repos}</span>
      <br />
      <span className={styles.subName}>contrib</span>
      <span className={styles.gained}>{contrib}</span>
      {/* <br /> */}
      {/* <span dangerouslySetInnerHTML={{ __html: calendar }} /> */}
    </div>
  );
};

export default GithubView;
