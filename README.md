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
