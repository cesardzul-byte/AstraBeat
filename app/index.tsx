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
    const [permissionState, setPermissionState]=
    useState<PermissionState>('idle');

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
                <Text style={styles.status}>
                    Acceso concedido. La biblioteca de música está disponible.
                </Text>
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
}); 
