import React, { useState, useEffect, useRef } from 'react';
import styles from './AutoPlayer.module.css';
import { SubtitleItem, GlobalSubtitleSettings } from '../types';

interface AutoPlayerProps {
  files: File[];
  subtitles?: SubtitleItem[];
  subtitleSettings?: GlobalSubtitleSettings;
  playTrigger?: number;
}

export default function AutoPlayer({ files, subtitles = [], subtitleSettings, playTrigger = 0 }: AutoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger from outside to play from start
  useEffect(() => {
    if (playTrigger > 0 && videoRef.current) {
      setCurrentIndex(0);
      setCurrentTime(0);
      videoRef.current.currentTime = 0;
      setIsPlaying(true);
      // We must unmute temporarily if we want Web Speech API to hear it from speakers
      // but browsers might block programmatic unmuting. We'll leave it muted for now or try to unmute.
      videoRef.current.muted = false; 
      videoRef.current.play().catch(e => console.error(e));
    }
  }, [playTrigger]);

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setObjectUrls(urls);
    setCurrentIndex(0);
    setIsPlaying(true);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    setCurrentTime(0);
  }, [currentIndex]);

  useEffect(() => {
    if (files.length === 0 || !objectUrls.length) return;
    const currentFile = files[currentIndex];
    
    if (currentFile.type.startsWith('image/')) {
      const IMAGE_DURATION = 3;
      setDuration(IMAGE_DURATION);
      
      if (!isPlaying) return;

      let lastTime = Date.now();
      const timer = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        setCurrentTime(prev => {
          const nextTime = prev + delta;
          if (nextTime >= IMAGE_DURATION) {
            setTimeout(() => handleNext(), 0);
            return 0;
          }
          return nextTime;
        });
      }, 50);
      
      return () => clearInterval(timer);
    } else if (currentFile.type.startsWith('video/') && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => {
          console.error("Autoplay prevented", e);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, files, objectUrls, isPlaying]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev < files.length - 1 ? prev + 1 : 0));
  };

  const togglePlay = () => setIsPlaying(prev => !prev);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    const currentFile = files[currentIndex];
    if (currentFile.type.startsWith('video/') && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (files.length === 0 || objectUrls.length === 0) return null;

  const currentFile = files[currentIndex];
  const currentUrl = objectUrls[currentIndex];

  // Filtering subtitles that should be visible right now (only for first clip, assuming single video for now)
  const activeSubtitles = subtitles.filter(
    sub => currentIndex === 0 && currentTime >= sub.startTime && currentTime <= sub.endTime
  );

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
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          playsInline
          muted
        />
      )}
      
      {/* Subtitle Overlay layer */}
      {subtitleSettings && (
        <div className={styles.subtitleOverlay}>
          {activeSubtitles.map(sub => (
            <div 
              key={sub.id} 
              className={`${styles.subtitleText} ${styles[subtitleSettings.style.animation]}`}
              style={{
                fontSize: `${subtitleSettings.style.fontSize}rem`,
                color: subtitleSettings.style.color,
                fontFamily: subtitleSettings.style.fontFamily,
                top: `${subtitleSettings.style.position.y}%`,
                left: `${subtitleSettings.style.position.x}%`,
              }}
            >
              {sub.text}
            </div>
          ))}
        </div>
      )}

      {/* Playback Controls & Slider */}
      <div className={styles.controlsOverlay}>
        <div className={styles.clipIndicators}>
          {files.map((_, idx) => (
            <div 
              key={idx} 
              className={`${styles.clipDot} ${idx === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
        
        <div className={styles.sliderContainer}>
          <button className={styles.playPauseBtn} onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <span className={styles.timeText}>{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min={0} 
            max={duration || 100} 
            step={0.1}
            value={currentTime} 
            onChange={handleSeek}
            className={styles.slider}
          />
          <span className={styles.timeText}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
