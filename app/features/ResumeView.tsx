import React, { useEffect } from 'react';
import { shell } from 'electron';
import { ScoreFile } from './type';

type Props = {
  resume: ScoreFile | undefined;
  onClose: () => void;
};
const ResumeView: React.FC<Props> = ({ resume, onClose }) => {
  const topElmRef = React.useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (resume && topElmRef.current) {
      topElmRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [resume]);
  const clickOpenNative = React.useCallback(() => {
    if (resume?.path) {
      shell.openItem(resume.path);
    }
  }, [resume]);
  return (
    <div
      style={{
        color: '#ffffff',
        background: '#333333',
      }}
    >
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
        <button type="button" onClick={onClose}>
          <i className="fa fa-times fa-2x" />
        </button>
      </header>
      <article
        style={{
          height: 'calc(100vh - 120px)',
          overflow: 'auto',
          paddingBottom: 100,
          padding: 20,
        }}
      >
        {(resume?.text || '').split('\n').map((content, i) => (
          <p
            key={String(i)}
            style={{ marginBlockStart: 5, marginBlockEnd: 5 }}
            ref={i === 0 ? topElmRef : undefined}
          >
            {content}
          </p>
        ))}
      </article>
    </div>
  );
};

export default ResumeView;
