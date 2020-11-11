import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { shell, remote } from 'electron';
import {
  selectConfig,
  updateConfig,
  saveConfig,
  resetConfigAsync,
} from '../features/configSlice';
import styles from './SettingPage.css';
import routes from '../constants/routes.json';
// import settingPageStyle from './SettingPage.style';
// import { Config } from '../features/type';

const SettingPage: React.FC<unknown> = () => {
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();
  const onChange = React.useCallback(
    ({ updated_src }) => {
      dispatch(updateConfig({ default: updated_src }));
      dispatch(saveConfig());
    },
    [dispatch]
  );
  const onClick = React.useCallback(() => {
    dispatch(resetConfigAsync());
  }, [dispatch]);
  const clickOpenNative = React.useCallback(() => {
    shell.openItem(`${remote.app.getPath('userData')}/keywords.json`);
  }, []);
  return (
    <div className={styles.container}>
      <header style={{ textAlign: 'right' }}>
        <button
          type="button"
          onClick={clickOpenNative}
          style={{
            background: 'none',
            border: '1px solid #fff',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          使用本地软件打开此文件
        </button>
      </header>
      <ReactJson
        src={config}
        style={{ marginLeft: 20 }}
        theme="google"
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        onEdit={onChange}
        onDelete={onChange}
        onAdd={onChange}
      />
      <a className={styles.reset} onClick={onClick} href={`#${routes.SINGLE}`}>
        重置
      </a>
      <Link className={styles.back} to={routes.SINGLE}>
        返回
      </Link>
    </div>
  );
};

export default SettingPage;
