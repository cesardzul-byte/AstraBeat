// Lee los archivos de música del dispositivo y sus metadatos (expo-media-library)

// Función de Expo que muestra la solicitud de permisos para acceder a la 
// biblioteca multimedia del dispositivo, y la función que consulta los archivos
// audio ya autorizados
import { requestPermissionsAsync, getAssetsAsync } from 'expo-media-library'; 

export type Track = {
    id: string; 
    title: string; 
    artist: string; 
    duration: number; 
    uri: string; 
}

/**
 * Solicita permiso para leer los archivos de audio del dispositivo
 * 
 * La función espera la respuesta del usuario y devuelve: 
 * - true: si el permiso fue concedido
 * - false: si el permiso fue rechazado
 * 
 * @returns un booleano indicando si el permiso fue concedido o no
 */
export async function requestLibraryPermission(): Promise<boolean>{
    // Espera que el usuario acepte o rechace la solicitud
    const permission = await requestPermissionsAsync(
        // false indica que no se solicita permiso únicamente de escritura
        // se necesita consultar los archivos existentes de los dispositivos
        false,

        // Limita la solicitud al contenido de audio
        ['audio'],
    ); 

    // Expo devuelve información sobre el permiso
    // pero esta función expone solamente si fue concedido o no
    return permission.granted; 
}

export async function scanTracks(): Promise<Track[]>{
    /**
     * Llama a getAssetsAsync de expo-media-library
     * Parámetros que se se pasan: 
     *  - mediaType: 'audio' para limitar la búsqueda a archivos de audio
     *  - first: 5000 para limitar la cantidad de resultados a 5000, por ahora no 
     *    se implementa paginación
     */ 
    const assets = await getAssetsAsync({
        mediaType: 'audio', 
        first: 5000,
    })

    /**
     * Transformar cada Asset en un objeto Track: 
     *  - id -> asset.id
     *  - title -> derivar de asset.filaname
     *  - artist -> "" (no disponible todavía)
     *  - duration -> asset.duration * 1000 (pasar a milisegundos)
     *  - uri -> asset.uri
     */
    const tracks: Track[] = assets.assets.map((asset) => {
        // Deriva el título eliminando la última extensión del archivo
        const derivedTitle = asset.filename.replace(/\.[^/.]+$/, ""); 

        return {
           id: asset.id,
            title: derivedTitle,
            duration: asset.duration * 1000,
            uri: asset.uri,
            artist: "", 
        }; 
    }); 

    // Devolver el array de track resultante
    return tracks; 
}