// Pantalla del reproductor a pantalla completa
import { StyleSheet, View, Text } from 'react-native';

// Uso de tokens reutilizables que definen la identidad visual de AstraBeat
import{
    colors, 
    fontSizes, 
    spacing,
} from '../src/theme/tokens';

/**
 * Pantalla del reproductor de música
 * 
 * Por ahora muestra contenido temporal. Más adelante contendrá
 * los datos de la canción y los controles de reproducción.
 */
export default function MusicPlayer() {
    return (
        // Contenedor principal de la pantalla
        <View style={styles.container}>
            {/* Título de la pantalla */}
            <Text style={styles.title}>
                Reproductor de música
                </Text>
            
            {/* Descripción secundaria */}
            <Text style={styles.description}>
                Contenido del reproductor de música
            </Text>
        </View>
    ); 
}
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
}); 
