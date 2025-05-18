/**
 * Configuración de variables de entorno para la aplicación frontend
 */

// Acceso tipado a las variables de entorno de Vite
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_CACHE_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Configuración de la aplicación
 */
export const config = {
  // URL de la API GraphQL
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:4000/graphql",

  // Entorno de la aplicación
  nodeEnv: import.meta.env.VITE_NODE_ENV || "development",

  // Tiempo de caché en segundos
  cacheTime: parseInt(import.meta.env.VITE_CACHE_TIME || "300", 10),

  // Indica si estamos en desarrollo
  isDevelopment:
    (import.meta.env.VITE_NODE_ENV || "development") === "development",
};

export default config;
