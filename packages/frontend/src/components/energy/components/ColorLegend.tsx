import React from "react";

export const ColorLegend: React.FC = () => {
  return (
    <div className="color-legend">
      <div className="color-item">
        <div className="color-box positive"></div>
        <div>Valores Positivos (Generación/Entrada)</div>
      </div>
      <div className="color-item">
        <div className="color-box negative"></div>
        <div>Valores Negativos (Consumo/Salida)</div>
      </div>
    </div>
  );
};
