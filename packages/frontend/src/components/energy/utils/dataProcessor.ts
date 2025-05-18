import { IncludedItem } from "../../../types/graphql";
import { isMainGroup, isGroupTotal } from "./helpers";

export interface Subgroup {
  id: string;
  type: string;
  groupId: string;
  title: string;
  total: number;
  color: string;
  parentTitle: string;
}

export interface Group {
  id: string;
  type: string;
  title: string;
  description?: string;
  total: number;
  subGroups: Subgroup[];
  color: string;
}

export interface GroupTotal {
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

export interface ChartData {
  mainGroups: Group[];
  subGroups: Subgroup[];
  groupTotals: GroupTotal[];
  stats: {
    grandTotal: number;
    totalGroups: number;
    totalSubgroups: number;
    largestGroup: GroupTotal;
  };
  mainGroupIds: string[];
}

/**
 * Procesa los datos para los gráficos
 */
export const processChartData = (includedItems: IncludedItem[]): ChartData => {
  const mainGroups = includedItems.filter(isMainGroup);

  const subGroups: Subgroup[] = [];

  const groupTotals: GroupTotal[] = [];

  mainGroups.forEach((group) => {
    const groupId = group.id;
    const groupTitle = group.attributes.title;

    const groupSubgroups: Subgroup[] = [];

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
    const subGroupsForGroup = subGroups.filter((sg) => sg.groupId === groupId);

    const totalElement = group.attributes.content?.find(isGroupTotal);
    const groupTotal = totalElement?.attributes.total || 0;

    return {
      id: groupId,
      type: group.type,
      title: group.attributes.title,
      description: group.attributes.description || undefined,
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
};
