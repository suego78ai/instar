"use client";

import { useState } from "react";
import styles from "./page.module.css";
import MediaUploader from "../components/MediaUploader";
import AutoPlayer from "../components/AutoPlayer";
import DraggableSubtitle from "../components/DraggableSubtitle";

export default function Home() {
  const [activeTab, setActiveTab] = useState("editor");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [hasSubtitle, setHasSubtitle] = useState(false);

  const handleMediaAdded = (files: File[]) => {
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleAddSubtitle = () => {
    setHasSubtitle(true);
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Instar Editor</h1>
      </header>
      
      <section className={styles.content}>
        {mediaFiles.length === 0 ? (
          <div className={styles.playerPlaceholder}>
            <p>미디어를 추가하여 영상 편집을 시작하세요</p>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%' }}>
            <AutoPlayer files={mediaFiles} />
            {hasSubtitle && <DraggableSubtitle />}
          </div>
        )}
        
        <div style={{ width: '100%', marginTop: '1rem' }}>
          <MediaUploader onMediaAdded={handleMediaAdded} />
        </div>

        {mediaFiles.length > 0 && !hasSubtitle && (
          <button 
            onClick={handleAddSubtitle}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            + 자막 추가하기
          </button>
        )}
      </section>

      <nav className={styles.bottomNav}>
        <button 
          className={`${styles.navItem} ${activeTab === "editor" ? styles.active : ""}`}
          onClick={() => setActiveTab("editor")}
        >
          편집
        </button>
        <button 
          className={`${styles.navItem} ${activeTab === "export" ? styles.active : ""}`}
          onClick={() => setActiveTab("export")}
        >
          내보내기
        </button>
      </nav>
    </main>
  );
}
