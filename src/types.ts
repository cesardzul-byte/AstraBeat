// Tipos compartidos entre módulos

export type Track = {
  id: string;
  uri: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // ms
  artwork?: string;
};

export type PlayEvent = {
  trackId: string;
  startedAt: number; // timestamp unix ms
  msPlayed: number;
};
