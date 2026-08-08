// Pantalla principal: biblioteca de canciones del dispositivo
import { 
    ActivityIndicator,
    Pressable,
    StyleSheet, 
    View, 
    Text,
    FlatList,
} from 'react-native';

// Link representa navegación declarativa: Se declara el destino mediante 'href' y Expo Router se encarga de cambiar de pantalla sin tener
// que llamar manualmente a una función. 
// Los usuarios pueden hacer clic en él para navegar a otra pantalla.
import { Link } from 'expo-router'; 

// Uso de tokens reutilizables que definen la identidad visual de AstraBeat
import {
    colors,
    spacing,
    fontSizes,
    radii,
} from '../src/theme/tokens'; 

// useEffect es necesario porque el escaneo no ocurre en respuesta a un click, si no como reacción de que el permiso
// cambio a granted
import { useState, useEffect } from 'react';  

import {
    requestLibraryPermission, 
    scanTracks,
    Track
} from '../src/library/scanner'; 
import { formatDuration } from '../src/library/format';

/**
 * Estados posibles de la solicitud de permiso
 * 
 * Se usa un estado de cuatro valores porque un booleano no permitiría
 * diferenciar entre "no solicitado" y "rechazado".
 */
type PermissionState =
    | 'idle'
    | 'requesting'
    | 'granted'
    | 'denied';

/**
 * Son necesarias tres piezas de estado, separadas del permissionState, ya que son
 * preguntas distintas las que debe responder: (ej: ¿tengo permiso? vs ¿ya terminé de escanear y qué encontré?)
 */
type ScanState =
    | 'idle'
    | 'scanning'
    | 'ready'

/**
 * Vista principal de AstraBeat
 * 
 * Representa la pantalla de la biblioteca de música y permite navegar hacia 
 * las vistas de reproductor y estadísticas.
 */
export default function Library() {
    // Al iniciar la pantalla, el permiso aún no se ha solicitdo
    const [permissionState, setPermissionState]= useState<PermissionState>('idle');

    const [scanState, setScanState] = useState<ScanState>('idle');

    const [tracks, setTracks] = useState<Track[]>([]); 

    /**
     * useEffect se ejecuta cada vez que permissionState cambia, y si el permiso fue concedido,
     * inicia el escaneo de la biblioteca de música del dispositivo
     */
    useEffect(() => {
        // Se ejecuta solamente si el permiso ha sido concedido
        if (permissionState === 'granted') {
            // Función asíncrona dentro de useEffect para manejar la promesa devuelta por scanTracks
            const startScanning = async () => {
                setScanState('scanning'); 

                try {
                    const foundTracks = await scanTracks(); 

                    setTracks(foundTracks); 
                    setScanState('ready'); 
                } catch (error) {
                    console.error('error al escanear la biblioteca de música:', error);
                    setScanState('idle'); 
                }
            }; 
            startScanning();
        }
    }, [permissionState])

    /**
     * Solicita acceso a la biblioteca de música del dispositivo y actualiza la interfaz
     * de acuerdo a la respuesta del usuario
     */

    async function handleRequestPermission(){
        // Evita que el botón apareza mientras se espera la respuesta del usuario
        setPermissionState('requesting');

        try {
            const granted = await requestLibraryPermission();

            setPermissionState(granted ? 'granted' : 'denied');
        } catch {
            /**
             * Durante esta etapa cualquier error inesperado se considera como acceso rechazado
             * (Más adelante se revisará la posibilidad de añadir un estado independiente para distinguir
             * errores técnicos)
             */
            setPermissionState('denied');
        } 
    }
    return (
        // Contenedor principal de la pantalla
        <View style={styles.container}>
            {/* Título de la pantalla */}
            <Text style={styles.title}>
                Biblioteca
                </Text>

            {/* Descripción secundaria */}
            <Text style={styles.description}>
                Contenido de la biblioteca de musica
                </Text>
            {/**
             * Renderizado condicional del permiso, solo se mmuestra el elemento correspondiente
             * al estado actual de la solicitud de permiso
             */}
            {permissionState === 'idle' && (
                <Pressable
                    style={styles.permissionButton}
                    onPress={handleRequestPermission}
                >
                    <Text style={styles.buttonText}>
                    Permitir acceso a la biblioteca de música
                    </Text>
                </Pressable>
            )}

            {permissionState === 'requesting' && (
                <ActivityIndicator color={colors.accent}/>
            )}

            {permissionState === 'granted' && (
                // Se usa un fragmento <> o view para agrupar los estados
                <View style={styles.listContainer}>

                    {/* Estado 1. Escaneado */}
                    {scanState === 'scanning' && (
                        <ActivityIndicator size="large" color={colors.accent}/>
                    )}

                    {/* Estado 2. Escaneo terminado, pero sin canciones */}
                    {scanState === 'ready' && tracks.length === 0 && (
                        <Text style={styles.status}>
                            No se encontró música en el dispositivo.
                        </Text>
                    )}

                    {/* Estado 3. Escaneo terminado y hay canciones */}
                    {scanState === 'ready' && tracks.length > 0 && (
                        <FlatList
                        data={tracks}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (

                            <View style={styles.trackItem}>
                                <View style={styles.trackInfo}>

                                    {/* Tìtulo de la cancion */}
                                    <Text style={styles.trackTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>

                                    {/* Artista */}
                                    <Text style={styles.trackArtist} numberOfLines={1}>
                                        {item.artist || 'Artista desconocido'}
                                    </Text>

                                </View>

                                {/* Duraciòn ya formateada */}
                                <Text style={styles.trackDuration}>
                                    {formatDuration(item.duration)}
                                </Text>
                            </View>
                        )}
                        // Da un pequeño margen al final de la lista para que la ùltima cancion no quede pegada al borde
                        contentContainerStyle={{ paddingBottom: spacing.lg }}
                        />
                    )}

                </View>
            )}

            {permissionState === 'denied' && (
                <Text style={styles.status}>
                    AstraBeat no tiene permiso para acceder a la biblioteca de música. 
                    Por favor, habilite el acceso en la configuración del dispositivo.
                </Text>
            )}

            {/* Enlace de navegación hacia app/player.tsx */}
            <Link href="/player" style={styles.link}>
            Abrir el reproductor
            </Link> 

            {/* Enlace de navegación hacia app/stats.tsx */}
            <Link href="/stats" style={styles.link}>
            Ver estadísticas
            </Link>
        </View>
    ); 
}

/**
 * Estilos de la pantalla
 * StyleSheet.create organiza los estilos y permite que TypeScript
 * compruebe que las propiedades sean válidas en React Native. 
 */
const styles = StyleSheet.create({
    container: {
        // Hace que el contenedor ocupe todo el espacio disponible
        flex: 1,
        // Aplica el fondo oscuro definido 
        backgroundColor: colors.background,
        // Agrega espacio entre el contenido y los bordes de la pantalla
        padding: spacing.lg,
        // Define la separación vertical entre los elementos hijos
        gap: spacing.md,
    },
    title: {
        // Utiliza el color destinado al texto principal 
        color: colors.text,
        // Aplica el tamaño correspondiente a los titulos
        fontSize: fontSizes.title, 
        // Establece un peso de fuente similar a las negritas
        fontWeight: '700',
    },
    description: {
        // Reduce la jerarquí visual de la información secundaria
        color: colors.textMuted,
        fontSize: fontSizes.body,
    },
    link: {
        // Destaca los enlaces mediante el color de acento
        color: colors.accent,
        backgroundColor: colors.surface,
        fontSize: fontSizes.body,
        padding: spacing.md, 
        borderRadius: radii.md,
    },
    permissionButton: {
        // Impide que el botón se extienda por todo el ancho disponible
        alignSelf: 'flex-start',
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.md,
    },
    buttonText: {
        // Contrasta el texto con el fondo violeta del botón
        color: colors.background,
        fontSize: fontSizes.body,
        fontWeight: '700',
    },
    status: {
        // Mantiene los mensajes de información en una jerarquía secundaria
        color: colors.textMuted,
        fontSize: fontSizes.body,
    },
    listContainer: {
        // Permite que la lista tome todo el espacio restante en la pantalla
        flex: 1, 
        marginTop: spacing.sm,
    },
    trackItem: {
        flexDirection: 'row', // Coloca la info y el tiempo lado a lado
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface, // Una línea sutil para separar canciones
    },
    trackInfo: {
        flex: 1, // Toma todo el espacio a la izquierda para empujar el tiempo a la derecha
        paddingRight: spacing.md,
    },
    trackTitle: {
        color: colors.text,
        fontSize: fontSizes.body,
        fontWeight: '600',
    },
    trackArtist: {
        color: colors.textMuted,
        fontSize: fontSizes.body, // Si tienes un fontSizes.small en tus tokens, sería ideal usarlo aquí
    },
    trackDuration: {
        color: colors.textMuted,
        fontSize: fontSizes.body,
    },
});
