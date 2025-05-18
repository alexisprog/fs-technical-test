import React, { useState } from "react";

interface DateRangeSearchProps {
  onSearch: (startDate: string, endDate: string) => void;
  isLoading?: boolean;
}

const DateRangeSearch: React.FC<DateRangeSearchProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onSearch(startDate, endDate);
    }
  };

  return (
    <div className="date-range-search">
      <h2 className="title">Consultar por Rango de Fechas</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="startDate">Fecha de inicio:</label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Fecha de fin:</label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={isLoading}
            min={startDate} // Prevenir que se seleccione una fecha anterior a la fecha de inicio
          />
        </div>
        <button
          type="submit"
          className="search-button"
          disabled={isLoading || !startDate || !endDate}
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      <style>{`
        .date-range-search {
          background-color: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--spacing-6);
        }
        
        .title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-4);
          color: var(--color-gray-800);
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }
        
        label {
          font-weight: 500;
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
        }
        
        input {
          padding: var(--spacing-2) var(--spacing-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          color: var(--color-gray-800);
        }
        
        input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
          outline: none;
        }
        
        input:disabled {
          background-color: var(--color-gray-100);
          cursor: not-allowed;
        }
        
        .search-button {
          padding: var(--spacing-2) var(--spacing-4);
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 500;
          cursor: pointer;
          margin-top: var(--spacing-2);
          transition: background-color var(--transition-fast), transform var(--transition-fast);
        }
        
        .search-button:hover:not(:disabled) {
          background-color: var(--color-primary-dark);
          transform: translateY(-1px);
        }
        
        .search-button:focus {
          outline: 2px solid var(--color-primary-light);
          outline-offset: 2px;
        }
        
        .search-button:disabled {
          background-color: var(--color-gray-300);
          color: var(--color-gray-500);
          cursor: not-allowed;
          transform: none;
        }
        
        @media (min-width: 640px) {
          form {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-end;
          }
          
          .form-group {
            flex: 1;
            min-width: 200px;
          }
          
          .search-button {
            align-self: flex-end;
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DateRangeSearch;
