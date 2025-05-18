import React from "react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Cargando datos...",
}) => {
  return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>{message}</p>
      <style>{`
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-8);
          min-height: 200px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--color-gray-200);
          border-radius: 50%;
          border-left-color: var(--color-primary);
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-4);
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        p {
          color: var(--color-gray-600);
          font-size: var(--font-size-base);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
