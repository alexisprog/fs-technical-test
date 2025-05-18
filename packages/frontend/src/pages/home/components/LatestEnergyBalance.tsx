import React from "react";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorState from "../../../components/ui/ErrorState";
import EnergyChart from "../../../components/energy/EnergyChart";
import { QueryResponse } from "../../../types/graphql";

interface LatestEnergyBalanceProps {
  data: QueryResponse | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const LatestEnergyBalance: React.FC<LatestEnergyBalanceProps> = ({
  data,
  isLoading,
  error,
  refetch,
}) => {
  return (
    <section className="card">
      <div className="section-header">
        <h2>Último Balance Energético</h2>
        <button
          className="refresh-button"
          onClick={refetch}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {isLoading ? (
        <LoadingState message="Cargando último balance..." />
      ) : error ? (
        <ErrorState
          message="Error al cargar los datos del último balance"
          onRetry={refetch}
        />
      ) : data ? (
        <div className="energy-data">
          <h3>{data.latestEnergyBalance.data.attributes.title}</h3>
          <p>
            <span className="text-label">Descripción:</span>{" "}
            {data.latestEnergyBalance.data.attributes.description}
          </p>
          <p>
            <span className="text-label">Última actualización:</span>{" "}
            {data.latestEnergyBalance.data.attributes.lastUpdate}
          </p>

          {/* Mostrar algunos elementos incluidos si existen */}
          {data.latestEnergyBalance.included?.length > 0 && (
            <EnergyChart includedItems={data.latestEnergyBalance.included} />
          )}
        </div>
      ) : (
        <p className="text-center">No hay datos disponibles</p>
      )}
    </section>
  );
};

export default LatestEnergyBalance;
