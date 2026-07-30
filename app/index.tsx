// Pantalla principal: biblioteca de canciones del dispositivo
import { StyleSheet, View, Text } from 'react-native';

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

/**
 * Vista principal de AstraBeat
 * 
 * Representa la pantalla de la biblioteca de música y permite navegar hacia 
 * las vistas de reproductor y estadísticas.
 */
export default function Library() {
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
        // Usa un color que destaca menos para la información secundaria
        color: colors.textMuted,
        // Aplica el tamaño normal del texto
        fontSize: fontSizes.body,
    },
    link: {
        // Usa el violeta de AstraBeat para los enlaces (destacar)
        color: colors.accent,
        // Coloca el enlace sobre una superficie más clara
        backgroundColor: colors.surface,
        // Mantiene un tamaño de fuente legible y coherente con el resto del texto 
        fontSize: fontSizes.body,
        // Agrega espacio en el interior para darle apariencia de botón
        padding: spacing.md, 
        // Redondea las esquinas del enlace
        borderRadius: radii.md,
    },
}); 
