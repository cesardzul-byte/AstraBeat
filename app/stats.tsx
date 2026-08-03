// Pantalla de estadísticas tipo "AstraBeat Wrapped"
import { StyleSheet, View, Text } from 'react-native';


// Uso de tokens reutilizables que definen la identidad visual de AstraBeat
import {
    colors, 
    spacing, 
    fontSizes,
} from '../src/theme/tokens';


/**
 * Pantalla de estadísticas de música
 * 
 * Por ahora muestra contenido temporal. Más adelante contendrá
 * estadísticas de canciones, artistas y géneros más escuchados
 */
export default function Statistics() {
    return (
        <View style={styles.container}>
            {/* Título de la pantalla */}
            <Text style={styles.title}>
                Estadísticas
            </Text>

            {/* Descripción secundaria */}
            <Text style={styles.description}>
                Contenido de las estadísticas de música
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