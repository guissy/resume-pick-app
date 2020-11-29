import React from 'react';
import uniqBy from 'lodash/uniqBy';
import styles from './ScoreList.css';
import Image from '../icon/image';
import { Keyword } from '../type';

type Props = {
  techNames: string[];
  keywords: Keyword[];
};
const TechRow: React.FC<Props> = ({ techNames, keywords }) => {
  return (
    <ul className={styles.icons}>
      {uniqBy(
        keywords
          .map((k) => k.children.map((w) => w))
          .flat()
          .filter((w) => techNames.includes(w.name)),
        'name'
      ).map((w) => (
        <li
          key={w.name}
          style={{
            backgroundColor: `rgba(235, 235, 235, ${w.gained / w.score + 0.2})`,
          }}
        >
          <img
            src={Image[`${w.name}_png` as keyof typeof Image]}
            style={{ opacity: w.gained / w.score }}
            alt={w.name}
          />
        </li>
      ))}
    </ul>
  );
};

export default TechRow;
