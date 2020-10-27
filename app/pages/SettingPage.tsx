import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import {
  selectConfig,
  updateConfig,
  saveConfig,
  initConfigAsync,
  resetConfigAsync,
} from '../features/configSlice';
import styles from './SettingPage.css';
import routes from '../constants/routes.json';
// import settingPageStyle from './SettingPage.style';
// import { Config } from '../features/type';

const SettingPage: React.FC<unknown> = () => {
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(initConfigAsync());
  }, [dispatch]);
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
  return (
    <div className={styles.container}>
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
