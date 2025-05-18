import React from "react";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorState from "../../../components/ui/ErrorState";
import EnergyChart from "../../../components/energy/EnergyChart";
import { QueryByDateResponse } from "../../../types/graphql";

interface DateRangeResultsProps {
  data: QueryByDateResponse | undefined;
  isLoading: boolean;
  error: unknown;
}

const DateRangeResults: React.FC<DateRangeResultsProps> = ({
  data,
  isLoading,
  error,
}) => {
  return (
    <section className="card">
      <h2>Resultados de la búsqueda</h2>

      {isLoading ? (
        <LoadingState message="Cargando resultados..." />
      ) : error ? (
        <ErrorState message="Error al cargar los datos por rango de fechas" />
      ) : data && data.energyBalancesByDateRange ? (
        <div className="energy-data">
          <h3>{data.energyBalancesByDateRange.data.attributes.title}</h3>
          <p>
            <span className="text-label">Descripción:</span>{" "}
            {data.energyBalancesByDateRange.data.attributes.description}
          </p>
          <p>
            <span className="text-label">Última actualización:</span>{" "}
            {data.energyBalancesByDateRange.data.attributes.lastUpdate}
          </p>

          {/* Mostrar algunos elementos incluidos si existen */}
          {data.energyBalancesByDateRange.included?.length > 0 && (
            <EnergyChart
              includedItems={data.energyBalancesByDateRange.included}
            />
          )}
        </div>
      ) : (
        <p className="text-center">
          No se encontraron datos para el rango seleccionado
        </p>
      )}
    </section>
  );
};

export default DateRangeResults;
