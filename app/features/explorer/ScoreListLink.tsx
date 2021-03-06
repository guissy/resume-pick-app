import React, { MouseEvent } from 'react';
import styles from './ScoreList.css';
import { getBlogByLink } from '../parser/tractWorkAge';
import Image from '../icon/image';

type Props = {
  link: string;
  onClick: (e: MouseEvent, link: string) => void;
};
const ScoreListLink: React.FC<Props> = ({ link, onClick }) => {
  const blogName = React.useMemo(() => getBlogByLink(link), [link]);
  return (
    <a
      href={link}
      className={styles.alink}
      style={{
        color: blogName ? '#f1f1f1' : '#999999',
      }}
      onClick={(e) => onClick(e, link)}
    >
      <img
        className={styles.blogIcon}
        src={Image[`${blogName}_png` as keyof typeof Image]}
        alt={blogName}
      />
      {link.replace(/(https?:\/\/|www\.)/, '')}
    </a>
  );
};

export default ScoreListLink;
