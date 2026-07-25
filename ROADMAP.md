# Roadmap — AstraBeat

Camino desde el esqueleto actual hasta un reproductor de música completo en Android.

## Decisiones fijadas

| Decisión | Elección | Consecuencia |
|---|---|---|
| Plataforma | Android ahora, iOS después | Todo el acceso a archivos y a audio vive detrás de una interfaz, para poder sustituir la implementación sin tocar la UI |
| Formatos | Los que Android decodifica nativamente | mp3, aac/m4a, wav, flac, ogg/opus. Sin decodificadores propios, sin FFmpeg |
| Edición de metadatos | En base local; escritura de tags ID3 como fase final opcional | El archivo original nunca se toca hasta (y si) se llega a la Fase 10 |
| Letras | Importar `.lrc` **y** editor de sincronización propio | Dos fases separadas: primero leer, luego crear |

Cada fase lleva marcado su esfuerzo relativo como S, M o L (pequeño, medio, grande) y termina en una app instalable y funcional.

---

## Fase 0 — Cimientos · S

Objetivo: el proyecto arrancará en un teléfono y el usuario podrá navegar.

- Corregir `package.json`: el nombre actual es `astrabeat-tmp`.
- Instalar y configurar `expo-router`. Los archivos de `app/` ya están creados pero vacíos.
- `_layout.tsx` con la navegación; `index`, `player` y `stats` como pantallas placeholder que navegan entre sí.
- `src/theme/`: los tokens de diseño (colores, tamaños de fuente, espaciados, radios).

**Entregable:** app corriendo en un teléfono con Expo Go, tres pantallas vacías navegables y el tema aplicado.

**Check:** las tres pantallas se abren y vuelven sin recargar la app.

> El tema va en la Fase 0 y no al final por un motivo práctico: si se empieza escribiendo colores a mano en cada componente, "personalizar la app" luego significa buscar y reemplazar en cuarenta archivos. Centralizarlo cuesta media hora ahora y cero después.

---

## Fase 1 — Biblioteca · M

Objetivo: la app mostrará la música que hay en el dispositivo.

- `expo-media-library`: pedir permisos y escanear el dispositivo.
- `src/library/scanner.ts`: devuelve `Track[]`. Esta es la interfaz. La UI nunca llama a `expo-media-library` directamente, de modo que al llegar iOS (o el streaming) solo cambia esta implementación.
- `app/index.tsx`: `FlatList` con las canciones (título, artista, duración).
- Estados: cargando, sin permisos y biblioteca vacía.

**Entregable:** lista completa de la música del teléfono.

**Check:** comparar el número de canciones detectadas con el que muestra otro reproductor. Una diferencia grande indica un filtro de formatos mal puesto.

---

## Fase 2 — Reproducir · L

Objetivo: la app reproducirá audio y gestionará una cola.

- `src/audio/player.ts`: la interfaz de audio, con `play(track)`, `pause()`, `resume()`, `seek(ms)`, `next()`, `prev()` y un estado observable. Implementada con `expo-audio`.
- `src/audio/usePlayer.ts`: store de `zustand` con la cola, el índice actual, la posición, shuffle y repeat.
- `app/player.tsx`: carátula, título, barra de progreso arrastrable y controles.
- Mini-player fijo abajo, visible desde cualquier pantalla.

**Entregable:** reproducción de cualquier canción de la biblioteca, con cola, shuffle y repeat.

**Check:** un `assert` sobre la lógica de cola (siguiente y anterior con shuffle y repeat activados, y en los bordes de la lista).

> Al terminar esta fase la app ya es usable, pero se calla al bloquear la pantalla. Eso se resuelve en la Fase 3.

---

## Fase 3 — Reproducción en segundo plano · M

Objetivo: el audio seguirá sonando con la pantalla bloqueada y se controlará desde la notificación.

- Crear un development build. A partir de aquí se deja de usar Expo Go, que no admite librerías con código nativo propio.
- Sustituir `expo-audio` por `react-native-track-player` detrás de la misma interfaz de la Fase 2. La UI no cambia.
- Notificación de reproducción, controles en pantalla bloqueada y botones de los auriculares.
- Audio focus: pausar cuando entra una llamada o suena una notificación, y reanudar después.

**Entregable:** comportamiento equivalente al de un reproductor convencional.

**Check:** reproducir, bloquear la pantalla, controlar desde la notificación y recibir una llamada. La reproducción debe sobrevivir a las cuatro cosas.

> Punto de decisión: cabe montar el development build desde la Fase 0 y usar `react-native-track-player` desde el principio, evitando la sustitución. El orden propuesto busca que la configuración del entorno nativo de Android en Windows, que puede llevar un día entero, no bloquee el proyecto antes de tener nada funcionando. La sustitución resulta barata precisamente porque la interfaz de la Fase 2 aísla el motor de audio.

---

## Fase 4 — Base de datos · M

Objetivo: los datos de la biblioteca se guardarán localmente y se podrán consultar por artista y álbum.

- `expo-sqlite` en `src/stats/db.ts`: tablas `tracks` (caché del escaneo), `track_overrides` (ediciones del usuario, vacía por ahora) y `play_events`.
- El escaneo pasa a ser incremental: escanea una vez, guarda, y en arranques posteriores solo busca cambios.
- Clasificadores: vistas por artista, por álbum y por carpeta.
- Búsqueda por título, artista y álbum.

**Entregable:** arranque instantáneo y navegación por artista y álbum.

**Check:** un `assert` sobre las queries de agrupación con datos de prueba: un artista con dos álbumes y un álbum con varios artistas.

> Puntos de decisión:
> 1. Conectar `tracker.ts` en esta fase y no en la Fase 8. Registrar un `PlayEvent` por cada escucha son unas veinte líneas. Si se deja para cuando se construya la pantalla de estadísticas, esa pantalla nacerá sin datos y habrá que esperar semanas a tener historial que mostrar.
>
> 2. Fijar qué cuenta como escucha. La convención habitual es más de 30 segundos o más del 50% de la canción. Ese umbral evita que saltar diez canciones seguidas contamine las estadísticas.

---

## Fase 5 — Edición y personalización · M

Objetivo: el usuario podrá corregir los metadatos y organizar su biblioteca.

- Editar título, artista, álbum y carátula. Se guarda en `track_overrides` y el archivo de audio no se toca.
- Una función que resuelve el `Track` final: los metadatos del archivo con el override aplicado encima.
- Playlists.
- Exportar e importar las ediciones a JSON, para no perderlas al reinstalar.

**Entregable:** biblioteca ordenada según los criterios del usuario.

**Check:** un `assert` sobre la función de merge: sin override devuelve el original, con override parcial solo pisa los campos editados, y un override vacío (`""`) no se confunde con la ausencia de edición.

---

## Fase 6 — Letras: importar `.lrc` · M

Objetivo: la app mostrará letras sincronizadas a partir de archivos `.lrc` existentes.

- Parser de `.lrc`. El formato base es `[mm:ss.xx] texto de la línea`, con algunas variantes que conviene tolerar.
- Búsqueda automática del `.lrc` junto al audio (mismo nombre, otra extensión) e importación manual desde el selector de archivos.
- Pantalla de letras: scroll automático con la línea activa resaltada y toque en una línea para saltar a ese momento de la canción.

**Entregable:** letras sincronizadas en las canciones que ya dispongan de `.lrc`.

**Check:** un `assert` con un `.lrc` de ejemplo que incluya los casos problemáticos: líneas sin timestamp, timestamps desordenados, líneas vacías y el formato con centésimas y sin ellas.

---

## Fase 7 — Editor de sincronización de letras · L

Objetivo: el usuario podrá sincronizar a mano la letra de una canción que no tenga `.lrc`.

Es una herramienta completa, por ello se realizará en una fase entera.

- Pegar o escribir la letra en texto plano, una línea por verso.
- Modo tap-to-sync: mientras suena la canción, un toque marca el inicio de cada línea.
- Corrección fina: desplazar una línea ±0.1 s, desplazar el bloque entero para corregir un desfase constante y rehacer desde una línea concreta.
- Previsualización antes de guardar y exportación a `.lrc`.

**Entregable:** sincronización manual de cualquier canción.

**Check:** un `assert` sobre las operaciones de edición de timestamps (desplazar una, desplazar todas, reinsertar en medio) verificando que el resultado sigue ordenado y sin tiempos negativos.

> A tomar en cuenta (latencia):  
>Entre el momento en que suena el verso y el momento en que el dedo toca la pantalla hay un retraso, típicamente de 100 a 200 ms. Conviene exponer un ajuste de compensación configurable en lugar de fijar una constante en el código: el valor correcto depende de la persona, del teléfono y de si se usa bluetooth.

---

## Fase 8 — Wrapped · M

Objetivo: la app resumirá los hábitos de escucha por periodos.

- Queries de agregación: top canciones, top artistas, top álbumes y minutos totales, por semana, mes, año y total.
- `app/stats.tsx`: las tarjetas del resumen.
- Rachas, primera escucha de cada canción y canción más repetida en un solo día.

**Entregable:** resumen personal generado en el propio dispositivo, sin que los datos salgan de él.

**Check:** un `assert` sobre las agregaciones con eventos sintéticos de fechas conocidas.

> Esta fase depende del historial acumulado desde la Fase 4. Sin esos datos la pantalla funciona, pero no tiene nada que mostrar.

---

## Fase 9 — Pulido · M

Objetivo: la app estará lista para instalarse y usarse a diario.

- Rendimiento con bibliotecas de miles de canciones: virtualización de listas e imágenes en caché.
- Estados de error reales: archivo borrado desde fuera, tarjeta SD extraída y permiso revocado.
- Temas claro y oscuro, y temas personalizados sobre los tokens de la Fase 0.
- Accesibilidad básica: tamaño de las zonas táctiles, etiquetas para el lector de pantalla y contraste.
- Build de release firmado, instalable como una app normal.

**Entregable:** versión distribuible de AstraBeat.

**Check:** instalar el APK de release en un teléfono sin herramientas de desarrollo y recorrer las funciones principales.

---

## Fases opcionales

**Fase 10 — Escribir tags al archivo · L.** Módulo nativo de Android, `MediaStore.createWriteRequest` para el permiso por archivo, escritura a un temporal con renombrado posterior y backup previo. Solo tiene sentido si las ediciones deben verse fuera de AstraBeat. La capa local de la Fase 5 se mantiene igualmente, porque hay datos (letras, estadísticas, playlists) que ID3 no puede guardar.

**Fase 11 — iOS · L.** iOS no permite escanear la biblioteca de música del sistema como hace Android; los archivos se importan a la sandbox de la app. Requiere una implementación distinta de `src/library/scanner.ts`, que es la razón de que esa interfaz exista. Necesita un Mac o EAS Build de pago.

**Ecualizador · M.** Android expone `AudioEffect` de forma nativa. Encaja con `react-native-track-player`, pero requiere un puente nativo.

---

## Orden general

Ver la música (1) → reproducirla (2) → reproducirla en segundo plano (3) → organizarla (4 y 5) → añadir letras (6 y 7) → resumir la escucha (8) → pulir (9).
