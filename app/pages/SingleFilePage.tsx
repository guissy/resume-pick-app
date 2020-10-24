import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './WelcomePage.css';

export default function SingleFilePage(): JSX.Element {
  const onDrop = React.useCallback(() => {
    // console.log('☞☞☞ 9527 e =', e, new Date().toLocaleTimeString(), 'SingleFilePage');
  }, []);
  return (
    <div className={styles.container} data-tid="container">
      <main className={styles.main}>
        <div className={styles.dropBox}>
          <p className={styles.placeholder} onDrop={onDrop}>
            拖拽文件到这里
          </p>
        </div>
        <Link to={routes.WELCOME}>返回</Link>
      </main>
    </div>
  );
}
