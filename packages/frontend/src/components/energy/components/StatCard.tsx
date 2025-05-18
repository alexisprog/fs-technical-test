import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  color,
}) => (
  <div className="stat-card" style={{ borderTopColor: color }}>
    <h6 className="stat-title">{title}</h6>
    <div className="stat-value">{value}</div>
    {description && <div className="stat-description">{description}</div>}
  </div>
);
