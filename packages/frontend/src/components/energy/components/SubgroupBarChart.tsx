import React from "react";
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

interface Subgroup {
  id: string;
  type: string;
  groupId: string;
  title: string;
  total: number;
  color: string;
  parentTitle: string;
}

interface Group {
  id: string;
  type: string;
  title: string;
  description?: string;
  total: number;
  subGroups: Subgroup[];
  color: string;
}

interface SubgroupBarChartProps {
  group: Group;
  vertical?: boolean;
}

export const SubgroupBarChart: React.FC<SubgroupBarChartProps> = ({
  group,
  vertical = false,
}) => {
  // Formateador para tooltips
  const formatTooltip = (value: any, name: string): [string, string] => {
    return [value.toString(), name === "value" ? "Valor Total" : name];
  };

  if (vertical) {
    return (
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
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={group.subGroups}
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
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
  );
};
