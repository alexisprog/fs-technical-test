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

# Iniciar todo el entorno de desarrollo
yarn dev
```

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
- **Backend API**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000/graphql
- **MongoDB**: mongodb://localhost:27017/fs-technical-test
