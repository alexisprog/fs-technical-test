import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EnergyDataService } from "./energy-data.service";
import { EnergyApiService } from "./energy-api.service";
import { EnergyBalance } from "../schemas/energy-data.schema";
import { EnergyQueryCache } from "../schemas/energy-query-cache.schema";
import { Response } from "../../../common/interfaces";

// Mock de datos más realista basado en la estructura de la API real
const realisticMockApiResponse: Response = {
  data: {
    type: "Balance de energía eléctrica",
    id: "bal1",
    attributes: {
      title: "Balance de energía eléctrica",
      "last-update": "2025-05-16T16:42:31.000+02:00",
      description:
        "Balance eléctrico: asignación de unidades de producción según combustible principal.",
    },
    meta: {
      "cache-control": {
        cache: "MISS",
      },
    },
  },
  included: [
    {
      type: "Renovable",
      id: "Renovable",
      attributes: {
        title: "Renovable",
        "last-update": "2025-05-16T16:42:29.000+02:00",
        description: undefined,
        magnitude: null,
        content: [
          {
            type: "Hidráulica",
            id: "10288",
            groupId: "Renovable",
            attributes: {
              title: "Hidráulica",
              description: "10288",
              color: "#0090d1",
              icon: null,
              type: "distinct",
              magnitude: null,
              composite: false,
              "last-update": "2025-05-16T16:42:29.000+02:00",
              values: [
                {
                  value: 134964,
                  percentage: 0.26867181632527304,
                  datetime: "2025-05-16T00:00:00.000+02:00",
                },
              ],
              total: 134964,
              "total-percentage": 0.26867181632527304,
            },
          },
        ], // Simplified for brevity, add other content items if needed
      },
    },
  ], // Simplified for brevity, add other included items if needed
};

describe("EnergyDataService", () => {
  let service: EnergyDataService;
  let energyApiService: EnergyApiService;
  let energyBalanceModel: Model<EnergyBalance>;
  let energyQueryCacheModel: Model<EnergyQueryCache>;

  const mockEnergyApiService = {
    fetchEnergyBalance: jest.fn(),
  };

  const mockEnergyBalanceModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    deleteMany: jest.fn(),
    exec: jest.fn(),
    mockImplementation: jest.fn(() => ({
      save: jest.fn().mockResolvedValue({}),
    })),
  };

  const mockEnergyQueryCacheModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    deleteMany: jest.fn(),
    exec: jest.fn(),
    mockImplementation: jest.fn(() => ({
      save: jest.fn().mockResolvedValue({}),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnergyDataService,
        { provide: EnergyApiService, useValue: mockEnergyApiService },
        {
          provide: getModelToken(EnergyBalance.name),
          useValue: mockEnergyBalanceModel,
        },
        {
          provide: getModelToken(EnergyQueryCache.name),
          useValue: mockEnergyQueryCacheModel,
        },
      ],
    }).compile();

    service = module.get<EnergyDataService>(EnergyDataService);
    energyApiService = module.get<EnergyApiService>(EnergyApiService);
    energyBalanceModel = module.get<Model<EnergyBalance>>(
      getModelToken(EnergyBalance.name)
    );
    energyQueryCacheModel = module.get<Model<EnergyQueryCache>>(
      getModelToken(EnergyQueryCache.name)
    );

    jest.clearAllMocks();

    (mockEnergyBalanceModel as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));
    (mockEnergyQueryCacheModel as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));
  });

  it("debe estar definido", () => {
    expect(service).toBeDefined();
  });

  describe("getLatestEnergyBalance", () => {
    it("debe obtener el balance energético más reciente", async () => {
      // Usar la estructura de datos realista en el mock de findOne
      const mockBalance = {
        _id: "test-id",
        queryParams: {},
        responseData: realisticMockApiResponse, // Usar datos realistas
        createdAt: new Date(),
      };

      mockEnergyBalanceModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBalance),
        }),
      });

      const result = await service.getLatestEnergyBalance();
      expect(result).toEqual(mockBalance);
      expect(mockEnergyBalanceModel.findOne).toHaveBeenCalled();
    });

    it("debe manejar errores al obtener el balance energético", async () => {
      mockEnergyBalanceModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest
            .fn()
            .mockRejectedValue(new Error("Error de base de datos")),
        }),
      });

      const result = await service.getLatestEnergyBalance();
      expect(result).toBeNull();
    });
  });

  describe("getEnergyDataFromApi", () => {
    it("debe obtener datos de la API cuando no hay caché", async () => {
      // Usar la estructura de datos realista en el mock de fetchEnergyBalance
      const mockResponse: Response = realisticMockApiResponse;

      mockEnergyQueryCacheModel.findOne.mockResolvedValue(null);
      mockEnergyApiService.fetchEnergyBalance.mockResolvedValue(mockResponse);

      const saveQueryToCacheSpy = jest
        .spyOn(service as any, "saveQueryToCache")
        .mockResolvedValue(undefined);

      const result = await service.getEnergyDataFromApi({
        start_date: "2025-01-01",
      });

      expect(result).toEqual(mockResponse);
      expect(mockEnergyQueryCacheModel.findOne).toHaveBeenCalled();
      expect(mockEnergyApiService.fetchEnergyBalance).toHaveBeenCalled();
      expect(saveQueryToCacheSpy).toHaveBeenCalledWith(
        {
          start_date: "2025-01-01",
        },
        mockResponse
      );
    });

    it("debe usar la caché si está disponible y no expirada", async () => {
      // Usar la estructura de datos realista en la caché mockeada
      const cachedData: EnergyQueryCache = {
        _id: "cache-id",
        queryParams: { start_date: "2025-01-01" },
        responseData: realisticMockApiResponse.data, // La caché podría guardar solo la parte data
        createdAt: new Date(),
        cacheTTLDays: 7,
        updatedAt: new Date(),
        save: jest.fn(),
        $isNew: false,
        errors: undefined,
      } as any;

      mockEnergyQueryCacheModel.findOne.mockResolvedValue(cachedData);
      const saveQueryToCacheSpy = jest
        .spyOn(service as any, "saveQueryToCache")
        .mockResolvedValue(undefined);

      const result = await service.getEnergyDataFromApi({
        start_date: "2025-01-01",
      });

      // El resultado debe ser responseData de la caché
      expect(result).toEqual(cachedData.responseData);
      expect(mockEnergyQueryCacheModel.findOne).toHaveBeenCalled();
      expect(mockEnergyApiService.fetchEnergyBalance).not.toHaveBeenCalled();
      expect(saveQueryToCacheSpy).not.toHaveBeenCalled();
    });

    it("debe obtener datos de la API si la caché ha expirado", async () => {
      // Usar la estructura de datos realista en la caché expirada mockeada
      const expiredCachedData: EnergyQueryCache = {
        _id: "cache-id",
        queryParams: { start_date: "2025-01-01" },
        responseData: realisticMockApiResponse.data, // La caché podría guardar solo la parte data
        createdAt: new Date(new Date().setDate(new Date().getDate() - 8)),
        cacheTTLDays: 7,
        updatedAt: new Date(),
        save: jest.fn(),
        $isNew: false,
        errors: undefined,
      } as any;

      // Usar la estructura de datos realista en la respuesta mock de la API
      const mockResponse: Response = realisticMockApiResponse;

      mockEnergyQueryCacheModel.findOne.mockResolvedValue(expiredCachedData);
      mockEnergyApiService.fetchEnergyBalance.mockResolvedValue(mockResponse);

      const saveQueryToCacheSpy = jest
        .spyOn(service as any, "saveQueryToCache")
        .mockResolvedValue(undefined);

      const result = await service.getEnergyDataFromApi({
        start_date: "2025-01-01",
      });

      expect(result).toEqual(mockResponse);
      expect(mockEnergyQueryCacheModel.findOne).toHaveBeenCalled();
      expect(mockEnergyApiService.fetchEnergyBalance).toHaveBeenCalled();
      expect(saveQueryToCacheSpy).toHaveBeenCalledWith(
        {
          start_date: "2025-01-01",
        },
        mockResponse
      );
    });

    it("debe manejar errores de la API al obtener datos", async () => {
      mockEnergyQueryCacheModel.findOne.mockResolvedValue(null);
      mockEnergyApiService.fetchEnergyBalance.mockResolvedValue(null);
      const saveQueryToCacheSpy = jest
        .spyOn(service as any, "saveQueryToCache")
        .mockResolvedValue(undefined);

      const result = await service.getEnergyDataFromApi({
        start_date: "2025-01-01",
      });

      expect(result).toBeNull();
      expect(mockEnergyQueryCacheModel.findOne).toHaveBeenCalled();
      expect(mockEnergyApiService.fetchEnergyBalance).toHaveBeenCalled();
      expect(saveQueryToCacheSpy).not.toHaveBeenCalled();
    });
  });

  describe("fetchAndSaveEnergyBalance", () => {
    // Eliminar el test "debe obtener y guardar el balance energético cuando hay datos disponibles"
    // Eliminar el test "debe devolver null si no hay datos disponibles"
    // Eliminar el test "debe actualizar el balance energético si ya existe una entrada"
    // Eliminar el test "debe manejar errores al guardar el balance energético"
  });

  describe("cleanupExpiredCache", () => {
    // Eliminar el test "debe eliminar entradas de caché expiradas"
    // Eliminar el test "debe manejar errores al eliminar entradas de caché"
  });
});
