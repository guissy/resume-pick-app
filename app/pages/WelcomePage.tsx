import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './WelcomePage.css';

export default function WelcomePage(): JSX.Element {
  return (
    <div className={styles.container} data-tid="container">
      <h2>简历关键字检索评分工具</h2>
      <main className={styles.main}>
        <article className={styles.article}>
          <ol>
            <li>
              <p>拖动个人简历文件（支持 doc 和 pdf）到上传文件区</p>
            </li>
            <li>
              <p>
                系统分析简历，按时间段，对各技术关键字分别打分，最后汇总分数
              </p>
            </li>
            <li>
              <p>
                支持一次分析多个简历，汇总以关键字为要素的评分表格，导出为Excel表格
              </p>
            </li>
          </ol>
        </article>
        <footer className={styles.footer}>
          <Link to={routes.SINGLE}>开始</Link>
        </footer>
      </main>
    </div>
  );
}
