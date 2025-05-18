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

interface TotalsBarChartProps {
  groupTotals: GroupTotal[];
}

export const TotalsBarChart: React.FC<TotalsBarChartProps> = ({
  groupTotals,
}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={groupTotals}
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
            const groupData = groupTotals.find((g) => g.title === label);
            if (groupData) {
              return `${label}: ${groupData.total}${
                groupData.negativeCount > 0 && groupData.positiveCount > 0
                  ? ` (${groupData.positiveTotal} pos, ${groupData.negativeTotal} neg)`
                  : ""
              }`;
            }
            return label;
          }}
        />
        <Legend />
        <Bar dataKey="total" name="Valor Total">
          {groupTotals.map((entry, index) => (
            <Cell
              key={`cell-value-${index}`}
              fill={entry.total >= 0 ? entry.color : `var(--color-danger)`}
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
  );
};
