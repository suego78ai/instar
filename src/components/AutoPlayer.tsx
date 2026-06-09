import React, { useState, useEffect, useRef } from 'react';
import styles from './AutoPlayer.module.css';

interface AutoPlayerProps {
  files: File[];
}

export default function AutoPlayer({ files }: AutoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Convert files to URLs
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setObjectUrls(urls);
    setCurrentIndex(0);
    setIsPlaying(true);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  // Reset current time when media changes
  useEffect(() => {
    setCurrentTime(0);
  }, [currentIndex]);

  // Handle Playback and Timers
  useEffect(() => {
    if (files.length === 0 || !objectUrls.length) return;
    const currentFile = files[currentIndex];
    
    if (currentFile.type.startsWith('image/')) {
      const IMAGE_DURATION = 3; // 3 seconds per image
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
            // Trigger next frame after interval
            setTimeout(() => handleNext(), 0);
            return 0; // Immediately reset to avoid overshooting
          }
          return nextTime;
        });
      }, 50); // 20fps for smooth slider update
      
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

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
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
          muted // Muted to allow auto-play without interaction on mobile
        />
      )}
      
      {/* Playback Controls & Slider */}
      <div className={styles.controlsOverlay}>
        {/* Clip Indicators (Dots) */}
        <div className={styles.clipIndicators}>
          {files.map((_, idx) => (
            <div 
              key={idx} 
              className={`${styles.clipDot} ${idx === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
        
        {/* Slider & Time */}
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
