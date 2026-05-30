import React, { useState, useEffect, useRef } from 'react';
import styles from './AutoPlayer.module.css';

interface AutoPlayerProps {
  files: File[];
}

export default function AutoPlayer({ files }: AutoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setObjectUrls(urls);
    setCurrentIndex(0);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    if (files.length === 0 || !objectUrls.length) return;
    const currentFile = files[currentIndex];
    
    if (currentFile.type.startsWith('image/')) {
      const timer = setTimeout(() => {
        handleNext();
      }, 3000);
      return () => clearTimeout(timer);
    } else if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay prevented", e));
    }
  }, [currentIndex, files, objectUrls]);

  const handleNext = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop
    }
  };

  if (files.length === 0 || objectUrls.length === 0) return null;

  const currentFile = files[currentIndex];
  const currentUrl = objectUrls[currentIndex];

  return (
    <div className={styles.playerContainer}>
      {currentFile.type.startsWith('image/') ? (
        <img src={currentUrl} alt="media" className={styles.media} />
      ) : (
        <video 
          ref={videoRef}
          src={currentUrl} 
          className={styles.media} 
          onEnded={handleNext}
          playsInline
          muted // Muted to allow auto-play without interaction on mobile
        />
      )}
      
      <div className={styles.timeline}>
        {files.map((_, idx) => (
          <div 
            key={idx} 
            className={`${styles.timelineDot} ${idx === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
