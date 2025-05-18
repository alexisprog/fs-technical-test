/**
 * Tipo para documentos GraphQL con tipado
 */
export interface TypedDocumentString<TResult = any, TVariables = any> {
  /** El documento GraphQL como string */
  readonly document: string;
  /** Propiedad para inferencia de tipos, nunca usada en tiempo de ejecución */
  readonly __result?: TResult;
  /** Propiedad para inferencia de tipos, nunca usada en tiempo de ejecución */
  readonly __variables?: TVariables;
  /** Método toString para convertir el documento a string */
  toString(): string;
}

/**
 * Definición de tipos para las interfaces de la respuesta GraphQL
 */
export interface EnergyAttributes {
  title: string;
  description: string;
  lastUpdate: string;
}

export interface IncludedItem {
  id: string;
  type: string;
  attributes: {
    title: string;
    description?: string | null;
    lastUpdate: string;
    content?: Array<{
      id: string;
      type: string;
      groupId: string;
      attributes: {
        title: string;
        description?: string | null;
        color: string;
        total: number;
        totalPercentage: number;
        values: Array<{
          datetime: string;
          value: number;
          percentage: number;
        }>;
      };
    }>;
  };
}

export interface EnergyBalanceResponse {
  data: {
    type: string;
    id: string;
    attributes: EnergyAttributes;
    meta: {
      cacheControl: {
        cache: string;
      };
    };
  };
  included: IncludedItem[];
}

export interface QueryResponse {
  latestEnergyBalance: EnergyBalanceResponse;
}

export interface QueryByDateResponse {
  energyBalancesByDateRange: EnergyBalanceResponse;
}
