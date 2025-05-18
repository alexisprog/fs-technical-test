import { describe, it, expect } from "vitest";
import { processChartData } from "./dataProcessor";
import { IncludedItem } from "../../../types/graphql";

describe("dataProcessor", () => {
  describe("processChartData", () => {
    it("debería procesar correctamente los datos para gráficos", () => {
      // Mock de los datos de entrada
      const mockIncludedItems: IncludedItem[] = [
        {
          id: "group1",
          type: "group",
          attributes: {
            title: "Generación",
            description: "Fuentes de generación de energía",
            lastUpdate: "2023-01-01",
            content: [
              {
                id: "total1",
                type: "subgroup",
                groupId: "group1",
                attributes: {
                  title: "Total Generación",
                  color: "#44B39D",
                  total: 1500,
                  totalPercentage: 100,
                  values: [
                    { datetime: "2023-01-01", value: 1500, percentage: 100 },
                  ],
                  // @ts-ignore - La propiedad composite es usada por las funciones de la aplicación
                  composite: true,
                },
              },
              {
                id: "subgroup1",
                type: "subgroup",
                groupId: "group1",
                attributes: {
                  title: "Solar",
                  color: "#F1C40F",
                  total: 800,
                  totalPercentage: 53.3,
                  values: [
                    { datetime: "2023-01-01", value: 800, percentage: 53.3 },
                  ],
                },
              },
              {
                id: "subgroup2",
                type: "subgroup",
                groupId: "group1",
                attributes: {
                  title: "Eólica",
                  color: "#3498DB",
                  total: 700,
                  totalPercentage: 46.7,
                  values: [
                    { datetime: "2023-01-01", value: 700, percentage: 46.7 },
                  ],
                },
              },
            ],
          },
        },
        {
          id: "group2",
          type: "group",
          attributes: {
            title: "Consumo",
            description: "Consumo de energía",
            lastUpdate: "2023-01-01",
            content: [
              {
                id: "total2",
                type: "subgroup",
                groupId: "group2",
                attributes: {
                  title: "Total Consumo",
                  color: "#E74C3C",
                  total: -800,
                  totalPercentage: 100,
                  values: [
                    { datetime: "2023-01-01", value: -800, percentage: 100 },
                  ],
                  // @ts-ignore - La propiedad composite es usada por las funciones de la aplicación
                  composite: true,
                },
              },
              {
                id: "subgroup3",
                type: "subgroup",
                groupId: "group2",
                attributes: {
                  title: "Residencial",
                  color: "#9B59B6",
                  total: -500,
                  totalPercentage: 62.5,
                  values: [
                    { datetime: "2023-01-01", value: -500, percentage: 62.5 },
                  ],
                },
              },
              {
                id: "subgroup4",
                type: "subgroup",
                groupId: "group2",
                attributes: {
                  title: "Industrial",
                  color: "#E67E22",
                  total: -300,
                  totalPercentage: 37.5,
                  values: [
                    { datetime: "2023-01-01", value: -300, percentage: 37.5 },
                  ],
                },
              },
            ],
          },
        },
      ];

      // Ejecutar la función a probar
      const result = processChartData(mockIncludedItems);

      // Verificaciones generales
      expect(result).toHaveProperty("mainGroups");
      expect(result).toHaveProperty("subGroups");
      expect(result).toHaveProperty("groupTotals");
      expect(result).toHaveProperty("stats");
      expect(result).toHaveProperty("mainGroupIds");

      // Verificar grupos principales
      expect(result.mainGroups).toHaveLength(2);
      expect(result.mainGroups[0].id).toBe("group1");
      expect(result.mainGroups[0].title).toBe("Generación");
      expect(result.mainGroups[0].total).toBe(1500);
      expect(result.mainGroups[0].subGroups).toHaveLength(2);
      expect(result.mainGroups[0].color).toBe("#44B39D");

      expect(result.mainGroups[1].id).toBe("group2");
      expect(result.mainGroups[1].title).toBe("Consumo");
      expect(result.mainGroups[1].total).toBe(-800);

      // Verificar subgrupos
      expect(result.subGroups).toHaveLength(4);

      // Verificar que los subgrupos pertenecen al grupo correcto
      const group1Subgroups = result.subGroups.filter(
        (sg) => sg.groupId === "group1"
      );
      expect(group1Subgroups).toHaveLength(2);
      expect(group1Subgroups[0].title).toBe("Solar");
      expect(group1Subgroups[1].title).toBe("Eólica");

      const group2Subgroups = result.subGroups.filter(
        (sg) => sg.groupId === "group2"
      );
      expect(group2Subgroups).toHaveLength(2);
      expect(group2Subgroups[0].title).toBe("Residencial");
      expect(group2Subgroups[1].title).toBe("Industrial");

      // Verificar totales de grupos
      expect(result.groupTotals).toHaveLength(2);

      const generationTotal = result.groupTotals.find(
        (gt) => gt.id === "group1"
      );
      expect(generationTotal).toBeDefined();
      expect(generationTotal?.total).toBe(1500);
      expect(generationTotal?.positiveTotal).toBe(1500);
      expect(generationTotal?.negativeTotal).toBe(0);
      expect(generationTotal?.subgroupsCount).toBe(2);
      expect(generationTotal?.positiveCount).toBe(2);
      expect(generationTotal?.negativeCount).toBe(0);

      const consumptionTotal = result.groupTotals.find(
        (gt) => gt.id === "group2"
      );
      expect(consumptionTotal).toBeDefined();
      expect(consumptionTotal?.total).toBe(-800);
      expect(consumptionTotal?.positiveTotal).toBe(0);
      expect(consumptionTotal?.negativeTotal).toBe(-800);
      expect(consumptionTotal?.subgroupsCount).toBe(2);
      expect(consumptionTotal?.positiveCount).toBe(0);
      expect(consumptionTotal?.negativeCount).toBe(2);

      // Verificar estadísticas
      expect(result.stats.grandTotal).toBe(1500);
      expect(result.stats.totalGroups).toBe(2);
      expect(result.stats.totalSubgroups).toBe(4);
      expect(result.stats.largestGroup.id).toBe("group1");

      // Verificar IDs de grupos principales
      expect(result.mainGroupIds).toEqual(["group1", "group2"]);
    });

    it("debería manejar grupos sin subgrupos", () => {
      const mockItemsWithEmptyGroup: IncludedItem[] = [
        {
          id: "emptyGroup",
          type: "group",
          attributes: {
            title: "Grupo Vacío",
            description: "Sin subgrupos",
            lastUpdate: "2023-01-01",
            content: [],
          },
        },
      ];

      const result = processChartData(mockItemsWithEmptyGroup);

      expect(result.mainGroups).toHaveLength(1);
      expect(result.subGroups).toHaveLength(0);
      expect(result.groupTotals).toHaveLength(1);

      const emptyGroupTotal = result.groupTotals[0];
      expect(emptyGroupTotal.total).toBe(0);
      expect(emptyGroupTotal.subgroupsCount).toBe(0);
    });

    it("debería manejar un array vacío de elementos incluidos", () => {
      const result = processChartData([]);

      expect(result.mainGroups).toHaveLength(0);
      expect(result.subGroups).toHaveLength(0);
      expect(result.groupTotals).toHaveLength(0);
      expect(result.stats.grandTotal).toBe(0);
      expect(result.stats.totalGroups).toBe(0);
      expect(result.stats.totalSubgroups).toBe(0);
      expect(result.stats.largestGroup).toBeUndefined();
      expect(result.mainGroupIds).toEqual([]);
    });
  });
});
