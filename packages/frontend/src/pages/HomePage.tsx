import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "../utils/graphql-fetcher";
import { config } from "../config/env";
import {
  LATEST_ENERGY_BALANCE,
  ENERGY_BALANCES_BY_DATE_RANGE,
} from "../graphql/queries";
import {
  QueryResponse,
  QueryByDateResponse,
  IncludedItem,
} from "../types/graphql";

// Definición de tipos para los datos a recibir
interface EnergyAttributes {
  title: string;
  description: string;
  lastUpdate: string;
}

interface EnergyBalanceResponse {
  data: {
    type: string;
    id: string;
    attributes: EnergyAttributes;
  };
  included: IncludedItem[];
}

const HomePage = () => {
  // Estados para los inputs de fechas
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [shouldFetchRange, setShouldFetchRange] = useState<boolean>(false);

  // Query para obtener el último balance energético
  const {
    data: latestData,
    isLoading: isLoadingLatest,
    error: latestError,
  } = useQuery({
    queryKey: ["latestEnergyBalance"],
    queryFn: async (): Promise<QueryResponse> => {
      return fetchGraphQL<QueryResponse>(LATEST_ENERGY_BALANCE);
    },
    staleTime: config.cacheTime * 1000, // Convertir segundos a milisegundos
  });

  // Query para obtener balances por rango de fechas
  const {
    data: rangeData,
    isLoading: isLoadingRange,
    error: rangeError,
    refetch: refetchRange,
  } = useQuery({
    queryKey: ["energyBalancesByDateRange", startDate, endDate],
    queryFn: async (): Promise<QueryByDateResponse> => {
      return fetchGraphQL<
        QueryByDateResponse,
        { startDate: string; endDate: string }
      >(ENERGY_BALANCES_BY_DATE_RANGE, { startDate, endDate });
    },
    enabled: shouldFetchRange,
    staleTime: config.cacheTime * 1000, // Convertir segundos a milisegundos
  });

  // Manejador para el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetchRange(true);
  };

  return (
    <div className="home-page">
      <h1>Bienvenido a la Aplicación Monorepo</h1>

      {/* Sección para el último balance energético */}
      <section>
        <h2>Último Balance Energético</h2>
        {isLoadingLatest ? (
          <p>Cargando último balance...</p>
        ) : latestError ? (
          <p>Error al cargar los datos del último balance</p>
        ) : latestData ? (
          <div>
            <h3>{latestData.latestEnergyBalance.data.attributes.title}</h3>
            <p>
              Descripción:{" "}
              {latestData.latestEnergyBalance.data.attributes.description}
            </p>
            <p>
              Última actualización:{" "}
              {latestData.latestEnergyBalance.data.attributes.lastUpdate}
            </p>

            {/* Mostrar algunos elementos incluidos si existen */}
            {latestData.latestEnergyBalance.included?.length > 0 && (
              <div>
                <h4>Elementos incluidos:</h4>
                <ul>
                  {latestData.latestEnergyBalance.included.map(
                    (item: IncludedItem) => (
                      <li key={item.id}>
                        {item.attributes.title} ({item.type})
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </section>

      {/* Formulario para consultar por rango de fechas */}
      <section>
        <h2>Consultar por Rango de Fechas</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="startDate">Fecha de inicio:</label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate">Fecha de fin:</label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button type="submit">Consultar</button>
        </form>

        {/* Resultados por rango de fechas */}
        {shouldFetchRange && (
          <div>
            {isLoadingRange ? (
              <p>Cargando resultados...</p>
            ) : rangeError ? (
              <p>Error al cargar los datos por rango de fechas</p>
            ) : rangeData ? (
              <div>
                <h3>
                  {rangeData.energyBalancesByDateRange.data.attributes.title}
                </h3>
                <p>
                  Descripción:{" "}
                  {
                    rangeData.energyBalancesByDateRange.data.attributes
                      .description
                  }
                </p>
                <p>
                  Última actualización:{" "}
                  {
                    rangeData.energyBalancesByDateRange.data.attributes
                      .lastUpdate
                  }
                </p>

                {/* Mostrar algunos elementos incluidos si existen */}
                {rangeData.energyBalancesByDateRange.included?.length > 0 && (
                  <div>
                    <h4>Elementos incluidos:</h4>
                    <ul>
                      {rangeData.energyBalancesByDateRange.included.map(
                        (item: IncludedItem) => (
                          <li key={item.id}>
                            {item.attributes.title} ({item.type})
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>No se encontraron datos para el rango seleccionado</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
