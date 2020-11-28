import styles from './ScoreList.css';

export function toggleSort([up, down]: [string, string]) {
  return (sorting: string) => {
    if (sorting !== up && sorting !== down) {
      return down;
    }
    if (sorting === up) {
      return '';
    }
    if (sorting === down) {
      return up;
    }
    return '';
  };
}

export function getLevelStyle(level: string) {
  const classNames = [
    styles.level1,
    styles.level2,
    styles.level3,
    styles.level4,
    styles.level5,
    styles.level6,
    styles.level7,
    styles.level8,
    styles.level9,
  ];
  const [n] = level?.match(/\d/g) || ['1'];
  const index = parseInt(n, 10);
  if (index > 0 && index <= classNames.length) {
    return `${styles.level} ${classNames[index - 1]}`;
  }
  return '';
}

export default {
  getLevelStyle,
};
