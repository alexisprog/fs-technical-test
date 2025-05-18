/**
 * Función para realizar peticiones GraphQL usando fetch
 */
import { config } from "../config/env";
import { TypedDocumentString } from "../types/graphql";

/**
 * Realiza una petición GraphQL
 * @param query La consulta GraphQL como string o documento tipado
 * @param variables Variables opcionales para la consulta
 * @returns Resultado de la consulta tipado
 */
export const fetchGraphQL = async <
  TResult,
  TVariables extends Record<string, any> = Record<string, never>,
>(
  query: string | TypedDocumentString<TResult, TVariables>,
  variables?: TVariables
): Promise<TResult> => {
  // Asegurarse de que la consulta sea un string
  let queryString: string;

  if (typeof query === "string") {
    queryString = query;
  } else if (query && typeof query.document === "string") {
    queryString = query.document; // Usar el campo document si está disponible
  } else if (query && typeof query.toString === "function") {
    queryString = query.toString(); // Usar toString() como último recurso
  } else {
    throw new Error(
      "La consulta debe ser un string o un objeto con método toString"
    );
  }

  console.log("Query enviada:", queryString); // Para depuración

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: queryString,
      variables: variables || {},
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error en la petición:", errorText);
    throw new Error(`Error en la petición: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error("GraphQL errores:", json.errors);
    const { message } = json.errors[0] || {
      message: "Error desconocido en GraphQL",
    };
    throw new Error(message);
  }

  return json.data as TResult;
};
