# Frontend

## Configuración de Pruebas Unitarias

Este proyecto utiliza Vitest y React Testing Library para las pruebas unitarias.

### Estructura de pruebas

- Los archivos de prueba se nombran con el sufijo `.test.tsx` o `.test.ts`
- El directorio `src/test` contiene la configuración y utilidades comunes para las pruebas
- Cada prueba debe estar ubicada junto al componente o hook que prueba

### Comandos para ejecutar pruebas

```bash
# Ejecutar todas las pruebas
yarn test

# Ejecutar pruebas en modo watch (desarrollo)
yarn test:watch

# Ejecutar pruebas con cobertura
yarn test:coverage

# Ejecutar un archivo de prueba específico
yarn test path/to/file.test.tsx
```

### Utilidades para pruebas

- `src/test/utils.tsx` - Proporciona una API unificada para renderizar componentes
- `src/test/setup.ts` - Configuración global para todas las pruebas

### Ejemplos

Para ver ejemplos de cómo implementar pruebas, revisa:

- `src/components/energy/DateRangeSearch.test.tsx` - Ejemplo de prueba de componente
- `src/hooks/useEnergyData.test.ts` - Ejemplo de prueba de hook (con Apollo Client)

### Buenas prácticas

1. Preferir pruebas enfocadas en comportamiento sobre implementación
2. Usar los roles ARIA para encontrar elementos en el DOM
3. Mantener las pruebas simples y directas
4. Probar diferentes estados (inicial, cargando, error, éxito)
5. Mockear servicios externos como peticiones GraphQL
