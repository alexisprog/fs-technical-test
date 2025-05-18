import React from "react";
import { TotalsBarChart } from "../components/TotalsBarChart";
import { SubgroupBarChart } from "../components/SubgroupBarChart";
import { ColorLegend } from "../components/ColorLegend";

interface Group {
  id: string;
  type: string;
  title: string;
  description?: string;
  total: number;
  subGroups: Array<{
    id: string;
    type: string;
    groupId: string;
    title: string;
    total: number;
    color: string;
    parentTitle: string;
  }>;
  color: string;
}

interface GroupTotal {
  id: string;
  type: string;
  title: string;
  total: number;
  positiveTotal: number;
  negativeTotal: number;
  color: string;
  subgroupsCount: number;
  positiveCount: number;
  negativeCount: number;
}

interface ChartData {
  mainGroups: Group[];
  subGroups: Array<{
    id: string;
    type: string;
    groupId: string;
    title: string;
    total: number;
    color: string;
    parentTitle: string;
  }>;
  groupTotals: GroupTotal[];
  stats: {
    grandTotal: number;
    totalGroups: number;
    totalSubgroups: number;
    largestGroup: GroupTotal;
  };
  mainGroupIds: string[];
}

interface GroupsOverviewPanelProps {
  chartData: ChartData;
}

export const GroupsOverviewPanel: React.FC<GroupsOverviewPanelProps> = ({
  chartData,
}) => {
  return (
    <div className="chart-section">
      <h5>Distribución de Subgrupos por Grupo Principal</h5>

      <div className="chart-subsection">
        <h6>Valores Totales por Grupo Principal</h6>
        <TotalsBarChart groupTotals={chartData.groupTotals} />
        <ColorLegend />
      </div>

      <div className="group-tabs">
        {chartData.mainGroups.map((group) => (
          <div
            key={`group-tab-${group.id}`}
            className="group-section"
            style={{ borderTopColor: group.color }}
          >
            <h6>
              {group.title} ({group.subGroups.length} subgrupos)
            </h6>
            {group.description && (
              <p className="group-description">{group.description}</p>
            )}
            <SubgroupBarChart group={group} vertical={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
