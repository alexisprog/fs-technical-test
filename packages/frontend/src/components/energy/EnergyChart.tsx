import React, { useMemo, useState } from "react";
import { ChartData, Group, processChartData } from "./utils/dataProcessor";
import { IncludedItem } from "../../types/graphql";
import { Tab } from "./components/Tab";
import { TabPanel } from "./components/TabPanel";
import { GroupsOverviewPanel } from "./panels/GroupsOverviewPanel";
import { DetailsPanel } from "./panels/DetailsPanel";
import { GroupPanel } from "./panels/GroupPanel";

// Importar estilos
import "./styles/EnergyChart.css";

interface EnergyChartProps {
  includedItems: IncludedItem[];
}

// Componente principal
const EnergyChart: React.FC<EnergyChartProps> = ({ includedItems }) => {
  const [activeTab, setActiveTab] = useState<string>("groups");

  const chartData = useMemo<ChartData>(() => {
    return processChartData(includedItems);
  }, [includedItems]);

  if (!includedItems.length) {
    return null;
  }

  const tabs = [
    { id: "groups", label: "Grupos y Subgrupos" },
    { id: "details", label: "Detalles por Grupo" },
    ...chartData.mainGroups.map((group: Group) => ({
      id: `group-${group.id}`,
      label: group.title,
    })),
  ];

  return (
    <div className="energy-chart">
      <h4>Análisis del Balance Energético</h4>

      <div className="tabs" role="tablist">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      <div className="tab-content">
        <TabPanel id="groups" isActive={activeTab === "groups"}>
          <GroupsOverviewPanel chartData={chartData} />
        </TabPanel>

        <TabPanel id="details" isActive={activeTab === "details"}>
          <DetailsPanel chartData={chartData} />
        </TabPanel>

        {chartData.mainGroups.map((group: Group) => (
          <TabPanel
            key={`panel-${group.id}`}
            id={`group-${group.id}`}
            isActive={activeTab === `group-${group.id}`}
          >
            <GroupPanel group={group} />
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default EnergyChart;
