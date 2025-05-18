import React from "react";
import { SubgroupBarChart } from "../components/SubgroupBarChart";

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

interface GroupPanelProps {
  group: Group;
}

export const GroupPanel: React.FC<GroupPanelProps> = ({ group }) => {
  return (
    <div className="chart-section">
      <h5>{group.title}</h5>
      {group.description && (
        <p className="group-description">{group.description}</p>
      )}
      <div className="chart-subsection">
        <h6>Valores de Subgrupos en {group.title}</h6>
        <SubgroupBarChart group={group} />
      </div>
    </div>
  );
};
