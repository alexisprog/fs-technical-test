# Monorepo NestJS + React

Proyecto monorepo con NestJS (backend) y React/Vite (frontend) utilizando TypeScript, GraphQL, MongoDB y Docker.

## Tecnologías

- **Backend**: NestJS, GraphQL Apollo Server, MongoDB, TypeScript
- **Frontend**: React, Vite, Apollo Client, TypeScript
- **Infraestructura**: Docker, Docker Compose, Yarn Workspaces

## Estructura del Proyecto

```
/
├── packages/
│   ├── backend/         # Aplicación NestJS
│   └── frontend/        # Aplicación React con Vite
├── docker/
│   └── docker-compose.dev.yml  # Configuración para desarrollo
└── package.json         # Configuración del monorepo
```

## Requisitos Previos

- Docker y Docker Compose
- Node.js (>=20.x)
- Yarn (=4.9.1)

## Instalación de Yarn

Este proyecto requiere específicamente Yarn 4.9.1. Sigue estos pasos para instalarlo:

```bash
# Paso 1: Instalar corepack (incluido con Node.js desde la versión 16.10)
# Si usas una versión anterior, instálalo globalmente:
npm install -g corepack

# Paso 2: Habilitar corepack
corepack enable

# Paso 3: Configurar la versión específica de Yarn
corepack prepare yarn@4.9.1 --activate

# Paso 4: Verificar que la versión correcta esté instalada
yarn --version  # Debería mostrar 4.9.1
```

Si necesitas cambiar entre versiones de Yarn para diferentes proyectos:

```bash
# Para usar temporalmente otra versión en un proyecto
yarn -v 4.9.1 <comando>

# Para cambiar a la versión global por defecto
corepack prepare yarn@4.9.1 --activate
```

## Instalación y Ejecución

### Desarrollo con Docker

```bash
# Instalar dependencias
yarn install

# Levantar los servicios (backend, frontend, mongodb)
yarn docker:up

# Para bajar los servicios
yarn docker:down
```

_Nota: El comando `yarn docker:up` construirá las imágenes si es necesario y se asegurará de que las dependencias estén instaladas dentro de los contenedores._

### Desarrollo Local (Sin Docker)

```bash
# Instalar dependencias
yarn install

# Iniciar el backend
yarn dev:backend

# Iniciar el frontend (en otra terminal)
yarn dev:frontend
```

## Endpoints

- **Frontend**: http://localhost:3000
- **GraphQL Studio Sandbox**: http://localhost:4000/graphql
- **MongoDB**: mongodb://localhost:27017/fs-technical-test

## Modelo de Datos y Pipeline de Datos

### Modelo de Datos

#### Backend

El modelo de datos se basa en dos esquemas principales de MongoDB:

1. **EnergyBalance**: Almacena los datos de balances energéticos obtenidos de la API externa.

   - `queryParams`: Parámetros utilizados para la consulta a la API externa.
   - `responseData`: Datos de respuesta de la API externa.
   - `createdAt`: Fecha de creación del registro.
   - `updatedAt`: Fecha de última actualización.
   - `cacheTTLDays`: Tiempo de expiración de la caché en días (por defecto 30).
   - `isScheduled`: Indica si esta entrada proviene de una tarea programada.

2. **EnergyQueryCache**: Gestiona la caché de consultas para optimizar el rendimiento.

#### Frontend

En el frontend, los datos se modelan mediante interfaces TypeScript:

1. **EnergyBalanceResponse**: Estructura de la respuesta principal.

   - `data`: Contiene metadatos (título, descripción, fecha de actualización).
   - `included`: Array de elementos incluidos con datos detallados.

2. **IncludedItem**: Representa un elemento incluido en la respuesta.
   - `id`: Identificador único.
   - `type`: Tipo de elemento.
   - `attributes`: Atributos del elemento, incluyendo título, descripción, fecha de actualización y contenido.
   - `content`: Datos específicos sobre generación/consumo de energía.

### Pipeline de Datos

1. **Obtención de Datos**:

   - La API externa de Red Eléctrica Española (REE) es consultada por el servicio `EnergyApiService`.
   - Las consultas se pueden realizar por fechas específicas o para obtener el último balance disponible.

2. **Procesamiento y Almacenamiento**:

   - Los datos recibidos son procesados por el servicio `EnergyDataService`.
   - Se almacenan en MongoDB con un esquema estructurado.
   - Se implementa un sistema de caché para optimizar las consultas repetidas.

3. **Actualización Automática**:

   - El servicio `EnergySchedulerService` programa actualizaciones periódicas para mantener los datos actualizados.
   - Las tareas programadas obtienen el último balance energético de forma automática.

4. **Exposición de Datos vía GraphQL**:

   - El backend expone los datos mediante resolvers GraphQL.
   - Dos consultas principales: `latestEnergyBalance` y `energyBalancesByDateRange`.

5. **Consumo desde Frontend**:
   - El frontend utiliza hooks personalizados (`useLatestEnergyBalance`, `useEnergyBalancesByDateRange`) para consultar los datos.
   - React Query gestiona el estado, caché y reintento de las consultas.
   - Los componentes React presentan los datos de forma visual al usuario.

## Pruebas (Backend)

Para ejecutar las pruebas del backend, navega al directorio `packages/backend`.

```bash
cd packages/backend

# Ejecutar todas las pruebas (unitarias y e2e)
yarn test

# Ejecutar solo pruebas unitarias
yarn test:unit

# Ejecutar solo pruebas e2e
yarn test:e2e

# Ejecutar pruebas con cobertura de código
yarn test:cov
```

_Nota: Las pruebas e2e utilizan `mongodb-memory-server` y no requieren una instancia de MongoDB externa. Asegúrate de que el entorno esté limpio antes de ejecutarlas._

### Estructura de Pruebas Backend

Las pruebas están organizadas por funcionalidad:

- **Pruebas Unitarias**: Prueban servicios individuales y funciones aisladas.

  - `energy-api.service.spec.ts`: Verifica la conexión con la API externa.
  - `energy-data.service.spec.ts`: Prueba el procesamiento y almacenamiento de datos.
  - `energy-scheduler.service.spec.ts`: Valida el sistema de tareas programadas.

- **Pruebas E2E**: Prueban la integración completa de los componentes.
  - Utilizan `mongodb-memory-server` para crear una base de datos aislada.
  - Verifican los resolvers GraphQL en un entorno similar a producción.

## Pruebas (Frontend)

Las pruebas del frontend utilizan Vitest y Testing Library. Para ejecutarlas, navega al directorio `packages/frontend`.

```bash
cd packages/frontend

# Ejecutar todas las pruebas
yarn test

# Ejecutar pruebas de un directorio específico
yarn test src/components

# Ejecutar pruebas de un componente específico
yarn test src/components/energy/DateRangeSearch.test.tsx

# Ejecutar pruebas con cobertura de código
yarn test:coverage
```

Las pruebas están organizadas por carpetas, siguiendo la estructura del proyecto:

- `src/components`: Pruebas de componentes UI reutilizables
- `src/pages`: Pruebas de páginas y componentes específicos de cada página
- `src/hooks`: Pruebas de hooks personalizados
- `src/utils`: Pruebas de utilidades y funciones auxiliares

Para añadir nuevas pruebas, crea archivos con extensión `.test.tsx` o `.test.ts` junto al código que deseas probar.

### Cobertura de Código

El proyecto utiliza Vitest con el proveedor de cobertura V8 para generar informes detallados de cobertura. Estos informes muestran:

- Porcentaje de líneas cubiertas
- Porcentaje de ramas cubiertas
- Porcentaje de funciones cubiertas
- Porcentaje de declaraciones cubiertas

Para generar un informe de cobertura completo:

```bash
cd packages/frontend
yarn test:coverage
```

Este comando generará un informe en consola y también creará un directorio `coverage` con informes detallados en formato HTML que puedes abrir en tu navegador para una visualización interactiva:

```bash
# Abrir el informe HTML (en macOS)
open coverage/index.html

# Abrir el informe HTML (en Linux)
xdg-open coverage/index.html
```

## Cómo Obtener y Actualizar los Datos de REE

Los datos de Red Eléctrica Española (REE) se obtienen y actualizan de varias maneras:

### Actualización Automática

El sistema implementa un servicio de actualización programada (`EnergySchedulerService`) que:

1. Obtiene periódicamente el último balance energético de la API de REE.
2. Almacena los datos en la base de datos con marcado de tiempo.
3. Gestiona la caché para optimizar las consultas futuras.

### Actualización Manual

Desde el frontend, se puede forzar la actualización de datos:

1. **Último Balance**: En la página principal, hay un botón "Actualizar" que permite obtener el último balance energético disponible.

2. **Consulta por Rango de Fechas**: El componente `DateRangeSearch` permite consultar datos para un período específico.

### Configuración de la API

La URL base de la API de REE se configura mediante variables de entorno:

```
ENERGY_API_URL=https://apidatos.ree.es/es/datos/balance/balance-electrico
```

Esta URL puede modificarse en los archivos de configuración o mediante variables de entorno.

## Consultas GraphQL de Ejemplo y Respuestas Esperadas

### Consulta: Último Balance Energético

```graphql
query LatestEnergyBalance {
  latestEnergyBalance {
    data {
      type
      id
      attributes {
        title
        description
        lastUpdate
      }
      meta {
        cacheControl {
          cache
        }
      }
    }
    included {
      id
      type
      attributes {
        title
        description
        lastUpdate
        content {
          id
          type
          groupId
          attributes {
            title
            description
            color
            total
            totalPercentage
            values {
              datetime
              value
              percentage
            }
          }
        }
      }
    }
  }
}
```

### Respuesta Esperada:

```json
{
  "data": {
    "latestEnergyBalance": {
      "data": {
        "type": "Balance de energía eléctrica",
        "id": "bal1",
        "attributes": {
          "title": "Balance de energía eléctrica",
          "last-update": "2025-05-16T16:42:31.000+02:00",
          "description": "Balance eléctrico: asignación de unidades de producción según combustible principal."
        },
        "meta": {
          "cache-control": {
            "cache": "MISS"
          }
        }
      },
      "included": [
        {
          "id": "2",
          "type": "chart_data",
          "attributes": {
            "title": "Datos de Consumo",
            "lastUpdate": "2023-06-15",
            "content": [
              {
                "id": "3",
                "type": "energy_line",
                "groupId": "g1",
                "attributes": {
                  "title": "Consumo Residencial",
                  "color": "#FF5733",
                  "total": 1500,
                  "totalPercentage": 45,
                  "values": [
                    {
                      "datetime": "2023-06-01",
                      "value": 500,
                      "percentage": 45
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

### Consulta: Balances Energéticos por Rango de Fechas

```graphql
query EnergyBalancesByDateRange($startDate: DateTime!, $endDate: DateTime!) {
  energyBalancesByDateRange(startDate: $startDate, endDate: $endDate) {
    data {
      type
      id
      attributes {
        title
        description
        lastUpdate
      }
      meta {
        cacheControl {
          cache
        }
      }
    }
    included {
      id
      type
      attributes {
        title
        description
        lastUpdate
        content {
          id
          type
          groupId
          attributes {
            title
            description
            color
            total
            totalPercentage
            values {
              datetime
              value
              percentage
            }
          }
        }
      }
    }
  }
}
```

### Variables:

```json
{
  "startDate": "2025-05-01T00:00:00Z",
  "endDate": "2025-05-16T23:59:59Z"
}
```

### Respuesta Esperada:

```json
{
  "data": {
    "energyBalancesByDateRange": {
      "data": {
        "type": "Balance de energía eléctrica",
        "id": "bal1",
        "attributes": {
          "title": "Balance de energía eléctrica",
          "last-update": "2025-05-16T16:42:31.000+02:00",
          "description": "Balance eléctrico: asignación de unidades de producción según combustible principal."
        },
        "meta": {
          "cache-control": {
            "cache": "MISS"
          }
        }
      },
      "included": [
        {
          "id": "4",
          "type": "chart_data",
          "attributes": {
            "title": "Datos de Producción",
            "lastUpdate": "2023-07-15",
            "content": [
              {
                "id": "5",
                "type": "energy_line",
                "groupId": "g1",
                "attributes": {
                  "title": "Producción Eólica",
                  "color": "#33FF57",
                  "total": 2500,
                  "totalPercentage": 65,
                  "values": [
                    {
                      "datetime": "2023-07-01",
                      "value": 800,
                      "percentage": 65
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

### Capturas del frontend:

![image](https://github.com/user-attachments/assets/1d90566c-bf3a-4772-a2f4-42fa972e5859)

![image](https://github.com/user-attachments/assets/3012c85e-17d0-4869-9dbc-53c3513454f2)

![image](https://github.com/user-attachments/assets/c7a81017-cedd-49e2-aa13-7dee99f8713e)

![image](https://github.com/user-attachments/assets/26c6137a-107d-448e-8f75-9c2ab14efc26)

### Capturas del backend:

![image](https://github.com/user-attachments/assets/7d55cbb1-120f-4d37-b697-d8b9a1e285a6)

![image](https://github.com/user-attachments/assets/caf48aef-a9e2-47f3-868d-6160ce5b7fe6)

