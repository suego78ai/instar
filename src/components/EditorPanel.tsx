import React from 'react';
import styles from './EditorPanel.module.css';
import MediaUploader from './MediaUploader';

interface EditorPanelProps {
  onMediaAdded: (files: File[]) => void;
  hasSubtitle: boolean;
  onAddSubtitle: () => void;
  hasMedia: boolean;
}

export default function EditorPanel({
  onMediaAdded,
  hasSubtitle,
  onAddSubtitle,
  hasMedia
}: EditorPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>미디어 관리</h2>
        <MediaUploader onMediaAdded={onMediaAdded} />
        {!hasMedia && <p className={styles.helperText}>사진이나 동영상을 업로드하세요.</p>}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>자막 도구</h2>
        {hasSubtitle ? (
          <div className={styles.activeTool}>
            <p>자막이 활성화되었습니다. 화면의 자막을 터치하여 위치를 이동하거나 수정할 수 있습니다.</p>
            {/* Future enhancements: Font size, Color picker etc */}
          </div>
        ) : (
          <button 
            className={styles.primaryButton}
            onClick={onAddSubtitle}
            disabled={!hasMedia}
          >
            + 자막 추가하기
          </button>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>내보내기</h2>
        <button 
          className={styles.exportButton}
          disabled={!hasMedia}
          onClick={() => alert('실제 영상 렌더링 기능은 추후 추가될 예정입니다!')}
        >
          영상 렌더링 시작
        </button>
      </div>
    </div>
  );
}
