import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './ScoreList.css';
import Image, { imgKey } from '../icon/image';
import { Config } from '../type';
import { updateConfig } from '../configSlice';

type Props = {
  config: Config;
  setTechNames: (names: string[]) => void;
};
const TechGroup: React.FC<Props> = ({ config, setTechNames }) => {
  const dispatch = useDispatch();
  const optionDefault = React.useMemo(() => {
    return imgKey.filter((img) =>
      (config || [])
        .map((c) => c.children.map((w) => w.name))
        .flat()
        .includes(img)
    );
  }, [config]);
  const [cacheScore] = React.useState(new Map<string, number>()); // 缓存大于0
  const [option, setOption] = React.useState(
    new Map(optionDefault.map((opt) => [opt, true]))
  );
  React.useEffect(() => {
    if (Array.isArray(config)) {
      setOption((opt) => {
        config.forEach((k) => {
          k.children.forEach((w) => {
            if (optionDefault.includes(w.name)) {
              opt.set(w.name, w.score !== 0);
              if (w.score !== 0) {
                cacheScore.set(w.name, w.score);
              }
            }
          });
        });
        return new Map(opt);
      });
    }
  }, [optionDefault, cacheScore, config]);
  const [checkedAll, setCheckedAll] = React.useState(true);
  const onClickOpt = React.useCallback(
    (opt: string) => {
      option.set(opt, !option.get(opt));
      setOption(new Map(option));
      const configOk = config.map((k) => ({
        ...k,
        children: k.children.map((w) => {
          let score = w.score || 0;
          if (option.has(w.name)) {
            score = option.get(w.name) ? cacheScore.get(w.name) || score : 0;
          }
          return {
            ...w,
            score,
          };
        }),
      }));
      setCheckedAll(false);
      dispatch(updateConfig({ default: configOk }));
    },
    [option, config, cacheScore, dispatch]
  );
  const onClickCheckAll = React.useCallback(() => {
    setCheckedAll(!checkedAll);
    if (config) {
      setOption(new Map(optionDefault.map((opt) => [opt, true])));
      const configOk = config.map((k) => ({
        ...k,
        children: k.children.map((w) => {
          let score = w.score || 0;
          if (option.has(w.name)) {
            score = !checkedAll ? cacheScore.get(w.name) || w.score : 0;
          }
          return {
            ...w,
            score,
          };
        }),
      }));
      dispatch(updateConfig({ default: configOk }));
    }
  }, [checkedAll, config, cacheScore, option, optionDefault, dispatch]);
  React.useEffect(() => {
    setTechNames(
      Array.from(option.entries())
        .filter(([_k, b]) => _k && b)
        .map(([k]) => k)
    );
  }, [option, setTechNames]);
  return (
    <div className={styles.opts}>
      <label htmlFor="optCheckbox">
        <input
          id="optCheckbox"
          type="checkbox"
          onChange={onClickCheckAll}
          checked={checkedAll}
        />
        全选
      </label>
      <ul className={styles.icons}>
        {config
          .map((k) => k.children.map((w) => w.name))
          .flat()
          .filter((w) => option.has(w))
          .map((w) => (
            <li
              key={w}
              style={{
                backgroundColor: option.get(w) ? '#333' : '#aaa',
              }}
            >
              <button
                type="button"
                onClick={() => onClickOpt(w)}
                className={styles.opt}
                style={{
                  filter: option.get(w) ? 'unset' : 'grayscale(0.9)',
                }}
              >
                <img src={Image[`${w}_png` as keyof typeof Image]} alt={w} />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TechGroup;
