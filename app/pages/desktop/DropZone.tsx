import React from 'react';
// Import the useDropzone hooks from react-dropzone
import { DropzoneProps, useDropzone } from 'react-dropzone';
import styles from './DropZone.css';

const DropZone = ({ onDrop, accept }: Partial<DropzoneProps>) => {
  // Initializing useDropzone hooks with options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  /*
    useDropzone hooks exposes two functions called getRootProps and getInputProps
    and also exposes isDragActive boolean
  */

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...getRootProps()} className={styles.mainBox}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...getInputProps()} />
      <div className={styles.dropBox}>
        <section className={styles.placeholder}>
          {isDragActive ? (
            <p className={styles.textCenter}>文件放在这里</p>
          ) : (
            <p className={styles.textCenter}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              拖拽简历文件到这里（或者点击弹窗选择）
              <br />
              <span>支持 doc / docx 和 pdf</span>
            </p>
          )}
          <p className={`${styles.textCenter} ${styles.upload}`}>
            <i className="fa fa-upload fa-3x" />
          </p>
        </section>
      </div>
    </div>
  );
};

export default DropZone;
