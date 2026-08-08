// Convierte una duración expresada en milisegundos a un formato legible de minutos
export function formatDuration(ms: number) {
    // Convierte los milisegundos a sefundos y redondea la parte decimal 
    const totalSeconds = Math.floor(ms/1000); 

    // Obtiene la cantidad de minutos completos a partir de los segundos 
    const minutes = Math.floor(totalSeconds/60);

    // Obtiene los segundos restantes después de calcular los minutos totales
    const second = totalSeconds % 60;  

    // PadStart agrega un cero a la izquierda si los segundos son menores a 10
    return  `${minutes}:${second.toString().padStart(2, '0')}`;
}