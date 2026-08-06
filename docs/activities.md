# Actividades F0 - F10

## Fase 0

### Fase 0.5

Se hizo uso de StyleSheet.create(). Método que reúne los estilos de un componente, detecta propiedades inválidas mediante TypeScript y evita repetir objetos dentro del JSX.

Cambio en app/index.tsx

### Fase 0.6

Se  configura el stack en _layout mediante:

1. Importación de colors desde los tokens
2. Uso de screenOptions para oscurecer el encabezado
3. Declaración de las pantallas para establecer títulos adecuados

El resultado ha sido una interfaz completamente oscura, encabezados con nombres legibles y flechas de regreso visible en Reproductor y Estadística.

## Fase 1

### Fase 1.1

Se prepara el accedo a la música, creando la función que solicita acceso en src/library/scanner.ts

### Fase 1.2

Se integró en la pantalla de biblioteca el flujo para solicitar acceso a los archivos de audio del dispositivo

### Fase 1.3

Se agrega en scanner.ts:

1. El tipo Track. El cuál es la interfaz o contrato declarada en el roadmap.
2. La función de escaneo usando getAssetsAsync de expo-media-library
