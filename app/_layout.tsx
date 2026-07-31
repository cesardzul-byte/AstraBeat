// Layout raíz de navegación de la aplicación. 
import { Stack } from 'expo-router'; 

// Se realiza la importanción correspondiente del objeto de tokens 
import { colors} from '../src/theme/tokens';

/**
 * Layout raíz de AstraBEat
 * 
 * Define la configuración visual compartida del encabezado 
 * y registra las pantallas principales de la aplicación
 */
export default function RootLayout() {
    return (
        <Stack
        screenOptions={{
            //Define el color de fondo del encabezado
            headerStyle: {
                backgroundColor: colors.surface,
            },

            // Define el color del título y del botón para regresar
            headerTintColor: colors.text,

            // Define el fondo del área donde aparece cada pantalla
            contentStyle: {
                backgroundColor: colors.background,
            }, 
        }}
        >
        {/* Configuración de la pantalla app/index.tsx */}
        <Stack.Screen
            name="index"
            options={{ title: 'Biblioteca' }}
        />

        {/* Configuración de la pantalla app/player.tsx */}
        <Stack.Screen
            name="player"
            options={{ title: 'Reproductor' }}
        />

        {/* Configuración de la pantalla app/stats.tsx */}
        <Stack.Screen
            name="stats"
            options={{title: 'Estadísticas'}}
        />
        </Stack>
    ); 
}
