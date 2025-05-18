import React from "react";
import { ComparisonBarChart } from "../components/ComparisonBarChart";

interface Subgroup {
  id: string;
  type: string;
  groupId: string;
  title: string;
  total: number;
  color: string;
  parentTitle: string;
}

interface ChartData {
  mainGroups: any[];
  subGroups: Subgroup[];
  groupTotals: any[];
  stats: any;
  mainGroupIds: string[];
}

interface DetailsPanelProps {
  chartData: ChartData;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ chartData }) => {
  return (
    <div className="chart-section">
      <h5>Comparación de Todos los Subgrupos</h5>
      <ComparisonBarChart subGroups={chartData.subGroups} />
    </div>
  );
};
