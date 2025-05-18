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

interface ComparisonBarChartProps {
  subGroups: Subgroup[];
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  subGroups,
}) => {
  // Formateador para tooltips
  const formatTooltip = (value: any, name: string): [string, string] => {
    return [value.toString(), name === "value" ? "Valor Total" : name];
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart
        data={subGroups}
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
            `${value} (${subGroups.find((s) => s.title === value)?.parentTitle})`
          }
        />
        <Tooltip
          formatter={formatTooltip}
          labelFormatter={(label) => {
            const subGroup = subGroups.find((s) => s.title === label);
            return `${label} - ${subGroup?.parentTitle || ""}`;
          }}
        />
        <Legend />
        <Bar dataKey="total" name="Valor Total">
          {subGroups.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
