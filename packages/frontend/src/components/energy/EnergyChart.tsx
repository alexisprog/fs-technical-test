import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { IncludedItem } from "../../types/graphql";

interface EnergyChartProps {
  includedItems: IncludedItem[];
}

/**
 * Determina si un elemento es un grupo principal
 */
const isMainGroup = (item: IncludedItem): boolean => {
  return !!item.attributes.content && Array.isArray(item.attributes.content);
};

/**
 * Determina si un elemento es un total de grupo (composite)
 */
const isGroupTotal = (item: any): boolean => {
  return item && item.attributes && item.attributes.composite === true;
};

/**
 * Componente Tab para el sistema de pestañas
 */
interface TabProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ id, label, isActive, onClick }) => {
  return (
    <button
      id={id}
      className={`tab ${isActive ? "active" : ""}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-panel`}
    >
      {label}
    </button>
  );
};

/**
 * Componente Panel para el contenido de cada pestaña
 */
interface TabPanelProps {
  id: string;
  isActive: boolean;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ id, isActive, children }) => {
  if (!isActive) return null;

  return (
    <div
      id={`${id}-panel`}
      className="tab-panel"
      role="tabpanel"
      aria-labelledby={id}
    >
      {children}
    </div>
  );
};

/**
 * Componente para mostrar resumen estadístico
 */
interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
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

const EnergyChart: React.FC<EnergyChartProps> = ({ includedItems }) => {
  const [activeTab, setActiveTab] = useState<string>("groups");

  const chartData = useMemo(() => {
    const mainGroups = includedItems.filter(isMainGroup);

    const subGroups: Array<{
      id: string;
      type: string;
      groupId: string;
      title: string;
      total: number;
      color: string;
      parentTitle: string;
    }> = [];

    const groupTotals: Array<{
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
    }> = [];

    mainGroups.forEach((group) => {
      const groupId = group.id;
      const groupTitle = group.attributes.title;

      const groupSubgroups: Array<{
        id: string;
        type: string;
        groupId: string;
        title: string;
        total: number;
        color: string;
        parentTitle: string;
      }> = [];

      if (group.attributes.content) {
        group.attributes.content.forEach((subGroup) => {
          if (!isGroupTotal(subGroup)) {
            const subgroupData = {
              id: subGroup.id,
              type: subGroup.type,
              groupId,
              title: subGroup.attributes.title,
              total: subGroup.attributes.total || 0,
              color: subGroup.attributes.color || "#666666",
              parentTitle: groupTitle,
            };
            subGroups.push(subgroupData);
            groupSubgroups.push(subgroupData);
          }
        });
      }

      const calculatedTotal = groupSubgroups.reduce(
        (sum, sg) => sum + sg.total,
        0
      );

      const negativeSubgroups = groupSubgroups.filter((sg) => sg.total < 0);
      const positiveSubgroups = groupSubgroups.filter((sg) => sg.total > 0);

      const positiveTotal = positiveSubgroups.reduce(
        (sum, sg) => sum + sg.total,
        0
      );
      const negativeTotal = negativeSubgroups.reduce(
        (sum, sg) => sum + sg.total,
        0
      );

      const groupColor = `hsl(${((mainGroups.indexOf(group) * 30) % 60) + 500}, 40%, 65%)`;

      groupTotals.push({
        id: groupId,
        type: group.type,
        title: groupTitle,
        total: calculatedTotal,
        positiveTotal: positiveTotal,
        negativeTotal: negativeTotal,
        color: groupColor,
        subgroupsCount: groupSubgroups.length,
        positiveCount: positiveSubgroups.length,
        negativeCount: negativeSubgroups.length,
      });
    });

    const grandTotal = groupTotals
      .filter((group) => group.total > 0)
      .reduce((sum, group) => sum + group.total, 0);

    const groupData = mainGroups.map((group) => {
      const groupId = group.id;
      const subGroupsForGroup = subGroups.filter(
        (sg) => sg.groupId === groupId
      );

      const totalElement = group.attributes.content?.find(isGroupTotal);
      const groupTotal = totalElement?.attributes.total || 0;

      return {
        id: groupId,
        type: group.type,
        title: group.attributes.title,
        description: group.attributes.description,
        total: groupTotal,
        subGroups: subGroupsForGroup,
        color: totalElement?.attributes.color || "#666666",
      };
    });

    const stats = {
      grandTotal,
      totalGroups: groupTotals.length,
      totalSubgroups: subGroups.length,
      largestGroup: groupTotals.sort((a, b) => b.total - a.total)[0],
    };

    return {
      mainGroups: groupData,
      subGroups,
      groupTotals,
      stats,
      mainGroupIds: groupData.map((group) => group.id),
    };
  }, [includedItems]);

  if (!includedItems.length) {
    return null;
  }

  const tabs = [
    { id: "groups", label: "Grupos y Subgrupos" },
    { id: "details", label: "Detalles por Grupo" },
    ...chartData.mainGroups.map((group) => ({
      id: `group-${group.id}`,
      label: group.title,
    })),
  ];

  // Formateador para tooltips que mantiene los valores exactos
  const formatTooltip = (value: any, name: string): [string, string] => {
    return [value.toString(), name === "value" ? "Valor Total" : name];
  };

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
          <div className="chart-section">
            <h5>Distribución de Subgrupos por Grupo Principal</h5>

            <div className="chart-subsection">
              <h6>Valores Totales por Grupo Principal</h6>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData.groupTotals}
                  margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(value, name) => [
                      value.toString(),
                      name === "total" ? "Valor Total" : name,
                    ]}
                    labelFormatter={(label) => {
                      const groupData = chartData.groupTotals.find(
                        (g) => g.title === label
                      );
                      if (groupData) {
                        return `${label}: ${groupData.total}${
                          groupData.negativeCount > 0 &&
                          groupData.positiveCount > 0
                            ? ` (${groupData.positiveTotal} pos, ${
                                groupData.negativeTotal
                              } neg)`
                            : ""
                        }`;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Valor Total">
                    {chartData.groupTotals.map((entry, index) => (
                      <Cell
                        key={`cell-value-${index}`}
                        fill={
                          entry.total >= 0 ? entry.color : `var(--color-danger)`
                        }
                      />
                    ))}
                    <LabelList
                      dataKey="total"
                      position="insideTop"
                      fill="var(--color-gray-700)"
                      formatter={(value: number) => value.toString()}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

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
                  <p className="group-description">{group.description}</p>

                  <ResponsiveContainer
                    width="100%"
                    height={Math.max(200, group.subGroups.length * 40)}
                  >
                    <BarChart
                      data={group.subGroups}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="title" type="category" width={150} />
                      <Tooltip formatter={formatTooltip} />
                      <Legend />
                      <Bar dataKey="total" name="Total" fill={group.color}>
                        {group.subGroups.map((entry, entryIndex) => (
                          <Cell
                            key={`cell-group-${group.id}-${entryIndex}`}
                            fill={entry.color}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel id="details" isActive={activeTab === "details"}>
          <div className="chart-section">
            <h5>Comparación de Todos los Subgrupos</h5>
            <ResponsiveContainer width="100%" height={600}>
              <BarChart
                data={chartData.subGroups}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="title"
                  type="category"
                  width={150}
                  tickFormatter={(value) =>
                    `${value} (${chartData.subGroups.find((s) => s.title === value)?.parentTitle})`
                  }
                />
                <Tooltip
                  formatter={formatTooltip}
                  labelFormatter={(label) => {
                    const subGroup = chartData.subGroups.find(
                      (s) => s.title === label
                    );
                    return `${label} - ${subGroup?.parentTitle || ""}`;
                  }}
                />
                <Legend />
                <Bar dataKey="total" name="Valor Total">
                  {chartData.subGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabPanel>

        {chartData.mainGroups.map((group) => (
          <TabPanel
            key={`panel-${group.id}`}
            id={`group-${group.id}`}
            isActive={activeTab === `group-${group.id}`}
          >
            <div className="chart-section">
              <h5>{group.title}</h5>
              {group.description && (
                <p className="group-description">{group.description}</p>
              )}
              <div className="chart-subsection">
                <h6>Valores de Subgrupos en {group.title}</h6>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={group.subGroups}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="title"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip formatter={formatTooltip} />
                    <Legend />
                    <Bar dataKey="total" name="Valor Total" fill={group.color}>
                      {group.subGroups.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="total"
                        position="insideTop"
                        fill="var(--color-gray-700)"
                        formatter={(value: number) => value.toString()}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabPanel>
        ))}
      </div>

      <style>{`
        .energy-chart {
          margin-top: var(--spacing-8);
          padding-top: var(--spacing-4);
          border-top: 1px solid var(--color-gray-200);
        }
        
        h4 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-4);
          color: var(--color-gray-800);
        }
        
        h5 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-3);
          color: var(--color-gray-700);
          text-align: center;
        }
        
        h6 {
          font-size: var(--font-size-base);
          margin-bottom: var(--spacing-2);
          color: var(--color-gray-700);
          text-align: center;
        }
        
        .group-description {
          text-align: center;
          color: var(--color-gray-600);
          margin-bottom: var(--spacing-4);
          font-style: italic;
          max-width: 80%;
          margin-left: auto;
          margin-right: auto;
        }
        
        .chart-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
        }
        
        .chart-section {
          background-color: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-4);
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--spacing-4);
        }
        
        .chart-subsection {
          margin-top: var(--spacing-6);
          padding-top: var(--spacing-4);
          border-top: 1px solid var(--color-gray-200);
        }
        
        .group-tabs {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
        }
        
        .group-section {
          background-color: white;
          border-radius: var(--radius-md);
          padding: var(--spacing-4);
          box-shadow: var(--shadow-sm);
          border-top: 3px solid;
        }
        
        .stats-row {
          display: flex;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-4);
        }
        
        .stats-row .stat-card {
          flex: 1;
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-6);
        }
        
        .stat-card {
          background-color: white;
          border-radius: var(--radius-md);
          padding: var(--spacing-4);
          box-shadow: var(--shadow-sm);
          text-align: center;
          border-top: 4px solid var(--color-primary);
          transition: transform var(--transition-fast);
          height: 100%;
        }
        
        .stat-card:hover {
          transform: translateY(-3px);
        }
        
        .stat-title {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
          margin-bottom: var(--spacing-2);
          font-weight: 500;
        }
        
        .stat-value {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          color: var(--color-gray-900);
          margin-bottom: var(--spacing-1);
        }
        
        .stat-description {
          font-size: var(--font-size-sm);
          color: var(--color-gray-500);
        }
        
        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-4);
          border-bottom: 2px solid var(--color-gray-200);
          margin-bottom: var(--spacing-6);
          padding: var(--spacing-3) var(--spacing-1) var(--spacing-3) var(--spacing-1);
          overflow-x: auto;
        }
        
        .tab {
          padding: var(--spacing-4) var(--spacing-6);
          background-color: var(--color-gray-100);
          border: none;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          cursor: pointer;
          font-weight: 600;
          color: var(--color-gray-700);
          transition: all 0.2s ease;
          position: relative;
          margin-right: var(--spacing-2);
          box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
          min-width: 120px;
          text-align: center;
          white-space: nowrap;
        }
        
        .tab:hover {
          background-color: var(--color-primary-light);
          color: white;
          transform: translateY(-3px);
        }
        
        .tab.active {
          background-color: var(--color-primary);
          color: white;
          transform: translateY(-3px);
        }
        
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--color-primary);
        }
        
        .tab-content {
          padding: var(--spacing-2) 0;
        }
        
        .tab-panel {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (min-width: 768px) {
          .chart-container {
            flex-direction: row;
          }
          
          .chart-section {
            flex: 1;
          }
        }
        
        .color-legend {
          display: flex;
          justify-content: center;
          gap: var(--spacing-6);
          margin-top: var(--spacing-4);
          padding: var(--spacing-2);
          background-color: var(--color-gray-50);
          border-radius: var(--radius-md);
        }
        
        .color-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-size: var(--font-size-sm);
          color: var(--color-gray-700);
        }
        
        .color-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        
        .color-box.positive {
          background-color: var(--color-primary);
        }
        
        .color-box.negative {
          background-color: var(--color-danger);
        }
      `}</style>
    </div>
  );
};

export default EnergyChart;
