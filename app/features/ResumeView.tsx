import React from 'react';

type Props = {
  resume: string;
  onClose: () => void;
};
const ResumeView: React.FC<Props> = ({ resume, onClose }) => {
  return (
    <div
      style={{
        color: '#ffffff',
        background: '#333333',
      }}
    >
      <header style={{ textAlign: 'right' }}>
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
        {resume}
      </article>
    </div>
  );
};

export default ResumeView;
