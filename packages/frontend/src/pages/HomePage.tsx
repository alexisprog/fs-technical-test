import { useState } from "react";
import {
  useLatestEnergyBalance,
  useEnergyBalancesByDateRange,
} from "../hooks/useEnergyData";
import { IncludedItem } from "../types/graphql";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import DateRangeSearch from "../components/energy/DateRangeSearch";
import EnergyChart from "../components/energy/EnergyChart";

const HomePage = () => {
  // Estados para la búsqueda por rango de fechas
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [shouldFetchRange, setShouldFetchRange] = useState<boolean>(false);

  // Uso del hook personalizado para obtener el último balance energético
  const {
    data: latestData,
    isLoading: isLoadingLatest,
    error: latestError,
    refetch: refetchLatest,
  } = useLatestEnergyBalance();

  // Uso del hook personalizado para obtener balances por rango de fechas
  const {
    data: rangeData,
    isLoading: isLoadingRange,
    error: rangeError,
  } = useEnergyBalancesByDateRange(startDate, endDate, shouldFetchRange);

  // Manejador para la búsqueda por rango de fechas
  const handleSearch = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setShouldFetchRange(true);
  };

  return (
    <div className="home-page container">
      <h1 className="text-center">Visualización de Balances Energéticos</h1>

      {/* Sección para el último balance energético */}
      <section className="card">
        <h2>Último Balance Energético</h2>

        {isLoadingLatest ? (
          <LoadingState message="Cargando último balance..." />
        ) : latestError ? (
          <ErrorState
            message="Error al cargar los datos del último balance"
            onRetry={refetchLatest}
          />
        ) : latestData ? (
          <div className="energy-data">
            <h3>{latestData.latestEnergyBalance.data.attributes.title}</h3>
            <p>
              <span className="text-label">Descripción:</span>{" "}
              {latestData.latestEnergyBalance.data.attributes.description}
            </p>
            <p>
              <span className="text-label">Última actualización:</span>{" "}
              {latestData.latestEnergyBalance.data.attributes.lastUpdate}
            </p>

            {/* Mostrar algunos elementos incluidos si existen */}
            {latestData.latestEnergyBalance.included?.length > 0 && (
              <EnergyChart
                includedItems={latestData.latestEnergyBalance.included}
              />
            )}
          </div>
        ) : (
          <p className="text-center">No hay datos disponibles</p>
        )}
      </section>

      {/* Componente de búsqueda por rango de fechas */}
      <DateRangeSearch onSearch={handleSearch} isLoading={isLoadingRange} />

      {/* Resultados por rango de fechas */}
      {shouldFetchRange && (
        <section className="card">
          <h2>Resultados de la búsqueda</h2>

          {isLoadingRange ? (
            <LoadingState message="Cargando resultados..." />
          ) : rangeError ? (
            <ErrorState message="Error al cargar los datos por rango de fechas" />
          ) : rangeData && rangeData.energyBalancesByDateRange ? (
            <div className="energy-data">
              <h3>
                {rangeData.energyBalancesByDateRange.data.attributes.title}
              </h3>
              <p>
                <span className="text-label">Descripción:</span>{" "}
                {
                  rangeData.energyBalancesByDateRange.data.attributes
                    .description
                }
              </p>
              <p>
                <span className="text-label">Última actualización:</span>{" "}
                {rangeData.energyBalancesByDateRange.data.attributes.lastUpdate}
              </p>

              {/* Mostrar algunos elementos incluidos si existen */}
              {rangeData.energyBalancesByDateRange.included?.length > 0 && (
                <EnergyChart
                  includedItems={rangeData.energyBalancesByDateRange.included}
                />
              )}
            </div>
          ) : (
            <p className="text-center">
              No se encontraron datos para el rango seleccionado
            </p>
          )}
        </section>
      )}

      <style>{`
        .home-page {
          padding-top: var(--spacing-6);
          padding-bottom: var(--spacing-12);
        }
        
        h1 {
          margin-bottom: var(--spacing-8);
        }
        
        .energy-data {
          padding: var(--spacing-4);
          background-color: var(--color-gray-50);
          border-radius: var(--radius-md);
        }
        
        .included-items {
          margin-top: var(--spacing-6);
          padding-top: var(--spacing-4);
          border-top: 1px solid var(--color-gray-200);
        }
        
        ul {
          margin-top: var(--spacing-2);
          padding-left: var(--spacing-6);
          list-style-type: circle;
        }
        
        li {
          margin-bottom: var(--spacing-2);
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-2);
        }
        
        .text-label {
          font-weight: 600;
          color: var(--color-gray-700);
        }
        
        .tag {
          display: inline-block;
          padding: var(--spacing-1) var(--spacing-2);
          background-color: var(--color-primary-light);
          color: white;
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
