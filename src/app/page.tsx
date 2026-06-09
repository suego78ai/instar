"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AutoPlayer from "../components/AutoPlayer";
import EditorPanel from "../components/EditorPanel";
import { SubtitleItem, GlobalSubtitleSettings } from "../types";

export default function Home() {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [subtitleSettings, setSubtitleSettings] = useState<GlobalSubtitleSettings>({
    style: {
      fontSize: 1.5,
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      animation: 'pop',
      position: { x: 50, y: 80 }
    }
  });
  const [playTrigger, setPlayTrigger] = useState(0);

  const handleMediaAdded = (files: File[]) => {
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleStartWebSpeech = () => {
    if (!mediaFiles[0] || !mediaFiles[0].type.startsWith('video/')) {
        alert("첫 번째 업로드 파일이 동영상이어야 자막 생성이 가능합니다.");
        return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("현재 브라우저는 Web Speech API를 지원하지 않습니다. (Chrome 브라우저를 사용해주세요)");
        return;
    }

    alert("마이크 권한을 허용해 주세요. 동영상이 스피커로 재생되며, 마이크가 소리를 듣고 자막을 생성합니다.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = false;

    let startTime = Date.now();

    recognition.onstart = () => {
      startTime = Date.now();
      setPlayTrigger(Date.now()); // Tell AutoPlayer to restart from 0 and play
    };

    recognition.onresult = (event: any) => {
      const currentIdx = event.resultIndex;
      const transcript = event.results[currentIdx][0].transcript;
      const timeElapsed = (Date.now() - startTime) / 1000;
      
      const newSub: SubtitleItem = {
        id: Date.now().toString() + Math.random(),
        startTime: timeElapsed > 2 ? timeElapsed - 2 : 0, // Roughly assume phrase took 2 seconds
        endTime: timeElapsed + 2, // Keep on screen for 2 more seconds
        text: transcript.trim()
      };
      
      setSubtitles(prev => [...prev, newSub]);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        alert("마이크 접근이 거부되었습니다.");
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
    };

    recognition.start();
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
                <AutoPlayer 
                  files={mediaFiles} 
                  subtitles={subtitles} 
                  subtitleSettings={subtitleSettings}
                  playTrigger={playTrigger}
                />
              </div>
            )}
          </div>
          
          {/* Right / Bottom: Editor Section */}
          <div className={styles.editorSection}>
            <EditorPanel 
              onMediaAdded={handleMediaAdded}
              hasMedia={mediaFiles.length > 0}
              subtitles={subtitles}
              subtitleSettings={subtitleSettings}
              setSubtitleSettings={setSubtitleSettings}
              onStartWebSpeech={handleStartWebSpeech}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
