import React, { useRef } from 'react';
import styles from './MediaUploader.module.css';

interface MediaUploaderProps {
  onMediaAdded: (files: File[]) => void;
}

export default function MediaUploader({ onMediaAdded }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onMediaAdded(filesArray);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploaderContainer}>
      <input
        type="file"
        multiple
        accept="video/*,image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />
      <button className={styles.uploadButton} onClick={handleUploadClick}>
        <div className={styles.icon}>+</div>
        <span>사진 및 동영상 추가</span>
      </button>
    </div>
  );
}
