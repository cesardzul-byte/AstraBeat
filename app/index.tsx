// Pantalla principal: biblioteca de canciones del dispositivo
import { View, Text } from 'react-native';

// Link representa navegación declarativa: Se declara el destino mediante 'href' y Expo Router se encarga de cambiar de pantalla sin tener
// que llamar manualmente a una función. 
// Los usuarios pueden hacer clic en él para navegar a otra pantalla.
import { Link } from 'expo-router'; 

export default function Library() {
    return (
        <View>
            <Text>Contenido de la biblioteca de musica</Text>

            <Link href="/player">Abrir el reproductor</Link> 

            <Link href="/stats">Ver estadísticas</Link>
        </View>
    ); 
}

