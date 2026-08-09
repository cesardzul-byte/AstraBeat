# Actividades F0 - F10

Registro cronológico de lo hecho en cada fase del [roadmap](../ROADMAP.md). Cada entrada describe el cambio y dónde vive.

## Fase 0 — Cimientos

### Fase 0.1 — Arranque con expo-router

Se cambia `main` de `index.ts` a `expo-router/entry` para que Expo arranque usando el router en vez del entry point manual. `_layout.tsx` y las pantallas pasan a ser componentes válidos.

**Archivos:** `app.json`, `package.json`

### Fase 0.2 — Pantallas placeholder

Los archivos de `app/` dejan de ser comentarios vacíos y exportan un componente real (`Library`, `MusicPlayer`, `Statistics`) con un `<Text>` de marcador. `_layout.tsx` monta el `Stack` de `expo-router`. Además, se corrige el nombre provisional `astrabeat-tmp` del proyecto por el definitivo en `app.json` y `package.json`.

**Archivos:** `app/_layout.tsx`, `app/index.tsx`, `app/player.tsx`, `app/stats.tsx`, `app.json`, `package.json`

### Fase 0.3 — Navegación entre pantallas

Se agrega `Link` de `expo-router` en la biblioteca para navegar a `/player` y `/stats` de forma declarativa, sin llamar una función a mano.

**Archivo:** `app/index.tsx`

### Fase 0.4 — Tokens de diseño

Se crea `src/theme/tokens.ts` con la paleta oscura, espaciados, tamaños de fuente y radios de la app. `userInterfaceStyle` pasa a `dark` en `app.json`.

**Archivo:** `src/theme/tokens.ts`

### Fase 0.5 — Tokens de diseño en la biblioteca

Se hizo uso de `StyleSheet.create()`. Método que reúne los estilos de un componente, detecta propiedades inválidas mediante TypeScript y evita repetir objetos dentro del JSX.

**Archivo:** `app/index.tsx`

### Fase 0.6 — Tema oscuro del stack de navegación

Se configura el stack en `_layout` mediante:

1. Importación de `colors` desde los tokens.
2. Uso de `screenOptions` para oscurecer el encabezado.
3. Declaración de las pantallas para establecer títulos adecuados.

El resultado ha sido una interfaz completamente oscura, encabezados con nombres legibles y flechas de regreso visibles en Reproductor y Estadísticas.

**Archivo:** `app/_layout.tsx`

## Fase 1 — Biblioteca

### Fase 1.1 — Función de solicitud de permiso

Se prepara el acceso a la música, creando la función que solicita acceso.

**Archivo:** `src/library/scanner.ts`

### Fase 1.2 — Flujo visual de permisos

Se integró en la pantalla de biblioteca el flujo para solicitar acceso a los archivos de audio del dispositivo.

**Archivo:** `app/index.tsx`

### Fase 1.3 — Escaneo de audio

Se agrega en `scanner.ts`:

1. El tipo `Track`, la interfaz o contrato declarada en el roadmap.
2. La función de escaneo usando `getAssetsAsync` de `expo-media-library`.

**Archivo:** `src/library/scanner.ts`

### Fase 1.4 — Lista de canciones

Se conecta el escaneo a la pantalla de biblioteca:

1. `ScanState`, un tipo de tres valores (`idle`, `scanning`, `ready`) para distinguir "aún no se sabe" de "se escaneó y no hay canciones", el mismo razonamiento detrás de `PermissionState`.
2. Un `useEffect` con `[permissionState]` como dependencia, que dispara el escaneo cuando el permiso pasa a `granted`.
3. `FlatList` para mostrar las canciones, con los tres estados visibles: cargando, biblioteca vacía y lista con datos.
4. `src/library/format.ts`, con `formatDuration` para convertir milisegundos a `m:ss`.

**Archivos:** `app/index.tsx`, `src/library/format.ts`

## Fase 2 — Reproducir

### Fase 2.1 — Contrato del reproductor de audio

Se define en `player.ts` la interfaz del motor de audio, sin implementación todavía (llega en la fase 2.2 con `expo-audio`):

1. `PlaybackStatus` y `PlayerState`, el estado observable del reproductor.
2. Las firmas `setQueue`, `pause`, `resume`, `seek`, `next`, `prev` y `subscribe`, cada una lanzando un error explícito de "no implementado".

Decisión de diseño (Opción A): el reproductor posee la cola internamente, por lo que `next()`/`prev()` no reciben parámetros. Por eso se usa `setQueue(tracks, startIndex)` en vez de `play(track)` — reproducir una sola canción es una cola de un elemento. `usePlayer.ts` (fase 2.3) reflejará este estado para React y añadirá shuffle/repeat.

**Archivo:** `src/audio/player.ts`
