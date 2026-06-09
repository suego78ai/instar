import React from 'react';
import styles from './EditorPanel.module.css';
import MediaUploader from './MediaUploader';
import { SubtitleItem, GlobalSubtitleSettings } from '../types';

interface EditorPanelProps {
  onMediaAdded: (files: File[]) => void;
  hasMedia: boolean;
  subtitles: SubtitleItem[];
  subtitleSettings: GlobalSubtitleSettings;
  setSubtitleSettings: React.Dispatch<React.SetStateAction<GlobalSubtitleSettings>>;
  onStartWebSpeech: () => void;
}

export default function EditorPanel({
  onMediaAdded,
  hasMedia,
  subtitles,
  subtitleSettings,
  setSubtitleSettings,
  onStartWebSpeech
}: EditorPanelProps) {

  const handleStyleChange = (key: keyof GlobalSubtitleSettings['style'], value: any) => {
    setSubtitleSettings(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [key]: value
      }
    }));
  };

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. 미디어 관리</h2>
        <MediaUploader onMediaAdded={onMediaAdded} />
        {!hasMedia && <p className={styles.helperText}>사진이나 동영상을 업로드하세요.</p>}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. AI 자동 자막 (무료/로컬)</h2>
        <div className={styles.speechContainer}>
          <p className={styles.helperText}>
            Web Speech API를 사용하여 브라우저에서 무료로 자막을 생성합니다. 
            <strong>스피커 볼륨을 키우고 마이크 권한을 허용</strong>해 주세요. (크롬 권장)
          </p>
          <button 
            className={styles.speechButton}
            onClick={onStartWebSpeech}
            disabled={!hasMedia}
          >
            🎙️ 영상 재생하며 실시간 자막 추출
          </button>
          {subtitles.length > 0 && (
            <p className={styles.successText}>현재 {subtitles.length}개의 자막이 생성되었습니다.</p>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 자막 스타일링</h2>
        <div className={styles.styleControls}>
          <div className={styles.controlGroup}>
            <label>폰트 크기 ({subtitleSettings.style.fontSize}rem)</label>
            <input 
              type="range" min="0.5" max="3" step="0.1" 
              value={subtitleSettings.style.fontSize}
              onChange={(e) => handleStyleChange('fontSize', parseFloat(e.target.value))}
            />
          </div>
          
          <div className={styles.controlGroup}>
            <label>글자 색상</label>
            <input 
              type="color" 
              value={subtitleSettings.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>

          <div className={styles.controlGroup}>
            <label>애니메이션 효과</label>
            <select 
              value={subtitleSettings.style.animation}
              onChange={(e) => handleStyleChange('animation', e.target.value)}
              className={styles.select}
            >
              <option value="none">효과 없음</option>
              <option value="pop">통통 튀기 (Pop)</option>
              <option value="fade">페이드 인 (Fade)</option>
              <option value="typewriter">타이핑 효과 (Typewriter)</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>세로 위치 (Y축)</label>
            <input 
              type="range" min="10" max="90" step="1" 
              value={subtitleSettings.style.position.y}
              onChange={(e) => handleStyleChange('position', { ...subtitleSettings.style.position, y: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. 내보내기</h2>
        <button 
          className={styles.exportButton}
          disabled={!hasMedia}
          onClick={() => alert('웹 환경에서의 고해상도 영상 렌더링은 준비 중입니다!')}
        >
          편집본 저장하기
        </button>
      </div>
    </div>
  );
}
