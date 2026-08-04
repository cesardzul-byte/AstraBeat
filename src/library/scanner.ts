// Lee los archivos de música del dispositivo y sus metadatos (expo-media-library)

// Función de Expo que muestra la solicitud de permisos para acceder a la 
// biblioteca multimedia del dispositivo
import { requestPermissionsAsync } from 'expo-media-library'; 

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