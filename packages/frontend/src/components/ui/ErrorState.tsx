import React from "react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Ha ocurrido un error al cargar los datos.",
  onRetry,
}) => {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Reintentar
        </button>
      )}
      <style>{`
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-8);
          border: 1px solid var(--color-error-light);
          background-color: var(--color-error-light);
          border-radius: var(--radius-lg);
          min-height: 200px;
        }
        
        .error-icon {
          font-size: var(--font-size-3xl);
          margin-bottom: var(--spacing-2);
        }
        
        .error-message {
          color: var(--color-error);
          margin-bottom: var(--spacing-4);
          text-align: center;
          max-width: 100%;
        }
        
        .retry-button {
          padding: var(--spacing-2) var(--spacing-4);
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 500;
          transition: background-color var(--transition-fast);
        }
        
        .retry-button:hover {
          background-color: var(--color-primary-dark);
        }
        
        .retry-button:focus {
          outline: 2px solid var(--color-primary-light);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default ErrorState;
