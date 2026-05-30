import React, { useState, useRef } from 'react';
import styles from './DraggableSubtitle.module.css';

interface DraggableSubtitleProps {
  initialText?: string;
  onPositionChange?: (x: number, y: number) => void;
  onTextChange?: (text: string) => void;
}

export default function DraggableSubtitle({ 
  initialText = "여기를 터치해 자막을 수정하세요", 
  onPositionChange,
  onTextChange
}: DraggableSubtitleProps) {
  const [text, setText] = useState(initialText);
  const [position, setPosition] = useState({ x: 50, y: 80 }); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag if we click the container, not typing in input
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
    
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    
    const x = ((e.clientX - parentRect.left) / parentRect.width) * 100;
    const y = ((e.clientY - parentRect.top) / parentRect.height) * 100;
    
    const newX = Math.max(0, Math.min(100, x));
    const newY = Math.max(0, Math.min(100, y));

    setPosition({ x: newX, y: newY });
    if (onPositionChange) onPositionChange(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (onTextChange) onTextChange(e.target.value);
  };

  return (
    <div 
      ref={containerRef}
      className={`${styles.draggableTextContainer} ${isDragging ? styles.dragging : ''}`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <input 
        type="text" 
        value={text} 
        onChange={handleTextChange}
        className={styles.textInput}
      />
    </div>
  );
}
