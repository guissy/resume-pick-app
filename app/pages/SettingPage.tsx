import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { JSONEditor } from 'react-json-editor-viewer';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectConfig,
  updateConfig,
  saveConfig,
  initConfig,
} from '../features/configSlice';
import styles from './SettingPage.css';
import routes from '../constants/routes.json';
import settingPageStyle from './SettingPage.style';
import { Config } from '../features/type';

const SettingPage: React.FC<unknown> = () => {
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(initConfig());
  }, [dispatch]);
  const onChange = React.useCallback(
    (_key: string, _value: unknown, _parent: unknown, data: Config) => {
      dispatch(updateConfig({ default: data }));
      dispatch(saveConfig());
    },
    [dispatch]
  );
  return (
    <div className={styles.container}>
      <JSONEditor
        data={config}
        view="dual"
        collapsible
        onChange={onChange}
        styles={settingPageStyle}
      />
      <Link className={styles.back} to={routes.SINGLE}>
        返回
      </Link>
    </div>
  );
};

export default SettingPage;
