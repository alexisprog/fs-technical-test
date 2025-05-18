# Variables de Entorno para el Frontend

Este proyecto utiliza variables de entorno para configurar diferentes aspectos de la aplicación. A continuación, se detallan las variables disponibles y cómo configurarlas.

## Variables disponibles

- `VITE_API_URL`: URL del API GraphQL (por defecto: "http://localhost:4000/graphql")
- `VITE_NODE_ENV`: Entorno de la aplicación (por defecto: "development")
- `VITE_CACHE_TIME`: Tiempo de caché en segundos (por defecto: 300)

## Configuración en desarrollo local

Para configurar las variables de entorno en desarrollo local, crea un archivo `.env` en la raíz del directorio `packages/frontend` con el siguiente contenido:

```
# URL del API GraphQL
VITE_API_URL="http://localhost:4000/graphql"

# Modo de entorno (development, production, etc.)
VITE_NODE_ENV="development"

# Tiempo de caché (en segundos)
VITE_CACHE_TIME=300
```

Puedes ajustar estos valores según tus necesidades.

## Configuración en Docker

Para configurar las variables de entorno en Docker, puedes modificar el archivo `docker-compose.dev.yml` para incluir las variables de entorno en el servicio de frontend:

```yaml
frontend:
  build:
    context: ./packages/frontend
    dockerfile: Dockerfile
  environment:
    - VITE_API_URL=http://backend:4000/graphql
    - VITE_NODE_ENV=development
    - VITE_CACHE_TIME=300
  ports:
    - "3000:3000"
  volumes:
    - ./packages/frontend:/app
    - /app/node_modules
  depends_on:
    - backend
```

## Configuración en producción

Para entornos de producción, debes configurar estas variables según la plataforma donde estés desplegando la aplicación. Por ejemplo, en un servicio de hosting como Vercel o Netlify, puedes configurar las variables de entorno en su interfaz de administración.
