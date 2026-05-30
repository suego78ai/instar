"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AutoPlayer from "../components/AutoPlayer";
import DraggableSubtitle from "../components/DraggableSubtitle";
import EditorPanel from "../components/EditorPanel";

export default function Home() {
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
        <div className={styles.splitLayout}>
          {/* Left / Top: Player Section */}
          <div className={styles.playerSection}>
            {mediaFiles.length === 0 ? (
              <div className={styles.playerPlaceholder}>
                <p>미디어를 추가하여 영상 편집을 시작하세요</p>
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <AutoPlayer files={mediaFiles} />
                {hasSubtitle && <DraggableSubtitle />}
              </div>
            )}
          </div>
          
          {/* Right / Bottom: Editor Section */}
          <div className={styles.editorSection}>
            <EditorPanel 
              onMediaAdded={handleMediaAdded}
              hasSubtitle={hasSubtitle}
              onAddSubtitle={handleAddSubtitle}
              hasMedia={mediaFiles.length > 0}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
