// Contrato del reproductor de audio (fase 2.1). La única puerta de entrada al motor
// de audio: la UI y usePlayer.ts (fase 2.3) solo conocen este archivo, nunca expo-audio
// directamente, para poder sustituirlo por react-native-track-player en la fase 3
// (reproducción en segundo plano, controles del sistema y pantalla de bloqueo) sin
// tocar nada más. Esa sustitución es justo lo que este archivo existe para abaratar.

import { Track } from '../library/scanner';

/**
 * Estados posibles del reproductor
 *
 * Igual que PermissionState y ScanState en app/index.tsx, un booleano 
 * no alcanza, hace falta distinguir "no hay nada cargado todavía" de "cargado pero
 * en pausa".
 */
export type PlaybackStatus =
    | 'idle'
    | 'playing'
    | 'paused';

/**
 * Estado observable del reproductor.
 *
 * En vez de que cada pantalla pregunte activamente por la posición o el estado,
 * se suscribe una sola vez mediante subscribe() y recibe este objeto cada vez
 * que algo cambia.
 */
export type PlayerState = {
    status: PlaybackStatus;
    currentTrack: Track | null;
    positionMillis: number;
    durationMillis: number;
};

type Listener = (state: PlayerState) => void;

/**
 * Todas las funciones de este archivo son, por ahora, solo la firma: el cuerpo
 * real (con expo-audio) llega en la fase 2.2. Lanzan un error explícito en vez
 * de quedar vacías para que un uso accidental antes de tiempo falle de forma
 * clara, en vez de fallar en silencio.
 */

/**
 * Reemplaza la cola de reproducción y empieza a reproducir desde startIndex.
 *
 * Se llama setQueue y no play(track) como sugiere el roadmap porque el
 * reproductor es quien posee la cola: reproducir una sola canción es, 
 * para este contrato, una cola de un elemento (setQueue([track])).
 */
export async function setQueue(tracks: Track[], startIndex: number = 0): Promise<void> {
    throw new Error('setQueue: not implemented (fase 2.2)');
}

// Pausa la reproducción actual sin perder la posición 
export async function pause(): Promise<void> {
    throw new Error('pause: not implemented (fase 2.2)');
}

// Reanuda la reproducción desde donde se pausó 
export async function resume(): Promise<void> {
    throw new Error('resume: not implemented (fase 2.2)');
}

// Mueve la posición de reproducción a ms milisegundos desde el inicio 
export async function seek(ms: number): Promise<void> {
    throw new Error('seek: not implemented (fase 2.2)');
}

// Avanza a la siguiente pista de la cola 
export async function next(): Promise<void> {
    throw new Error('next: not implemented (fase 2.2)');
}

// Retrocede a la pista anterior de la cola 
export async function prev(): Promise<void> {
    throw new Error('prev: not implemented (fase 2.2)');
}

/**
 * Se suscribe a los cambios del estado del reproductor.
 *
 * @returns una función para cancelar la suscripción. Es el mismo patrón que
 * usa zustand internamente (getState/setState/subscribe), y el motivo por el
 * que usePlayer.ts (fase 2.3) podrá envolver este módulo casi sin esfuerzo.
 */
export function subscribe(listener: Listener): () => void {
    throw new Error('subscribe: not implemented (fase 2.2)');
}
