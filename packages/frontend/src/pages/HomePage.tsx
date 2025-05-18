import { useState } from "react";
import {
  useLatestEnergyBalance,
  useEnergyBalancesByDateRange,
} from "../hooks/useEnergyData";

// Importar componentes
import SearchSection from "./home/components/SearchSection";
import LatestEnergyBalance from "./home/components/LatestEnergyBalance";
import DateRangeResults from "./home/components/DateRangeResults";

// Importar estilos
import "./styles/HomePage.css";

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

  // Manejador para limpiar el rango de fechas
  const handleClearRange = () => {
    setStartDate("");
    setEndDate("");
    setShouldFetchRange(false);
  };

  return (
    <div className="home-page container">
      <h1 className="text-center">Visualización de Balances Energéticos</h1>

      {/* Componente de búsqueda por rango de fechas */}
      <SearchSection
        onSearch={handleSearch}
        isLoading={isLoadingRange}
        showClear={shouldFetchRange}
        onClear={handleClearRange}
      />

      {/* Renderizado condicional basado en si hay un filtro de rango de fechas activo */}
      {shouldFetchRange ? (
        <DateRangeResults
          data={rangeData}
          isLoading={isLoadingRange}
          error={rangeError}
        />
      ) : (
        <LatestEnergyBalance
          data={latestData}
          isLoading={isLoadingLatest}
          error={latestError}
          refetch={refetchLatest}
        />
      )}
    </div>
  );
};

export default HomePage;
