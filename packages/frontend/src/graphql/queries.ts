import { graphql } from "../gql";
import {
  TypedDocumentString,
  QueryResponse,
  QueryByDateResponse,
} from "../types/graphql";

// Convertir el documento gql en un string adecuado
function createTypedDocumentString<TResult, TVariables>(
  doc: any
): TypedDocumentString<TResult, TVariables> {
  // Asegurarse de que tenemos un string válido de GraphQL
  let documentString: string;

  if (typeof doc === "string") {
    documentString = doc;
  } else if (doc && typeof doc.toString === "function") {
    // Asumimos que doc.toString() devuelve la representación en string de la consulta
    documentString = doc.toString();

    // Comprobar si el resultado parece un objeto en lugar de una consulta GraphQL
    if (
      documentString.startsWith("[object ") ||
      documentString.includes("__proto__")
    ) {
      // Si obtenemos un [object Object] o similar, hay un problema
      throw new Error(
        "La consulta GraphQL no se pudo convertir correctamente a string"
      );
    }
  } else {
    throw new Error(
      "El documento GraphQL debe ser un string o tener un método toString"
    );
  }

  // Para depuración
  console.log("Documento GraphQL creado:", documentString);

  return {
    document: documentString,
    toString() {
      return this.document;
    },
  };
}

// Query para obtener el último balance energético
export const LATEST_ENERGY_BALANCE = createTypedDocumentString<
  QueryResponse,
  Record<string, never>
>(
  `query LatestEnergyBalance {
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
  }`
);

// Query para obtener balances energéticos por rango de fechas
export const ENERGY_BALANCES_BY_DATE_RANGE = createTypedDocumentString<
  QueryByDateResponse,
  { startDate: string; endDate: string }
>(
  `query EnergyBalancesByDateRange($startDate: DateTime!, $endDate: DateTime!) {
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
  }`
);
