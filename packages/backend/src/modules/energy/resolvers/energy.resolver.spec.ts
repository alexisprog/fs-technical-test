import { Test, TestingModule } from "@nestjs/testing";
import { EnergyResolver } from "./energy.resolver";
import { EnergyDataService } from "../services/energy-data.service";
import { Response } from "../../../common/interfaces";

describe("EnergyResolver", () => {
  let resolver: EnergyResolver;
  let energyDataService: EnergyDataService;

  const mockEnergyDataService = {
    getLatestEnergyBalance: jest.fn(),
    getEnergyDataFromApi: jest.fn(),
  };

  const mockApiResponse: Response = {
    data: {
      type: "energy-balance",
      id: "1",
      attributes: {
        title: "Balance energético",
        "last-update": "2025-01-01T00:00:00.000Z",
        description: "Descripción del balance energético",
      },
      meta: {
        "cache-control": {
          cache: "public",
        },
      },
    },
    included: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnergyResolver,
        {
          provide: EnergyDataService,
          useValue: mockEnergyDataService,
        },
      ],
    }).compile();

    resolver = module.get<EnergyResolver>(EnergyResolver);
    energyDataService = module.get<EnergyDataService>(EnergyDataService);
  });

  it("debe estar definido", () => {
    expect(resolver).toBeDefined();
  });

  describe("latestEnergyBalance", () => {
    it("debe devolver el último balance energético", async () => {
      mockEnergyDataService.getLatestEnergyBalance.mockResolvedValue({
        responseData: mockApiResponse,
      });

      const result = await resolver.latestEnergyBalance();
      expect(result).toBeDefined();
      expect(result.data.type).toEqual(mockApiResponse.data.type);
      expect(result.data.id).toEqual(mockApiResponse.data.id);
      expect(result.data.attributes.title).toEqual(
        mockApiResponse.data.attributes.title
      );
      expect(result.data.attributes.description).toEqual(
        mockApiResponse.data.attributes.description
      );
      expect(mockEnergyDataService.getLatestEnergyBalance).toHaveBeenCalled();
    });

    it("debe lanzar un error si no hay datos disponibles", async () => {
      mockEnergyDataService.getLatestEnergyBalance.mockResolvedValue(null);

      await expect(resolver.latestEnergyBalance()).rejects.toThrow(
        "No se encontró ningún balance energético"
      );
    });
  });

  describe("energyBalancesByDateRange", () => {
    it("debe obtener los balances energéticos por rango de fechas", async () => {
      mockEnergyDataService.getEnergyDataFromApi.mockResolvedValue(
        mockApiResponse
      );

      const dateRange = {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-02"),
      };

      const result = await resolver.energyBalancesByDateRange(dateRange);
      expect(result).toBeDefined();
      expect(result.data.type).toEqual(mockApiResponse.data.type);
      expect(result.data.id).toEqual(mockApiResponse.data.id);
      expect(result.data.attributes.title).toEqual(
        mockApiResponse.data.attributes.title
      );
      expect(result.data.attributes.description).toEqual(
        mockApiResponse.data.attributes.description
      );
      expect(mockEnergyDataService.getEnergyDataFromApi).toHaveBeenCalledWith(
        expect.objectContaining({
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        })
      );
    });

    it("debe lanzar un error si no hay datos disponibles", async () => {
      mockEnergyDataService.getEnergyDataFromApi.mockResolvedValue(null);

      const dateRange = {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-02"),
      };

      await expect(
        resolver.energyBalancesByDateRange(dateRange)
      ).rejects.toThrow(
        "No se encontraron balances energéticos para el rango de fechas especificado"
      );
    });
  });
});
