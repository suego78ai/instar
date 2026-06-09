export interface SubtitleStyle {
  fontSize: number; // in rem or px
  color: string;
  fontFamily: string;
  animation: 'none' | 'pop' | 'typewriter' | 'fade';
  position: { x: number, y: number }; // percentage 0-100
}

export interface SubtitleItem {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface GlobalSubtitleSettings {
  style: SubtitleStyle;
}
