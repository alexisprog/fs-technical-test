import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EnergySchedulerService } from "./energy-scheduler.service";
import { EnergyDataService } from "./energy-data.service";
import { EnergyBalance } from "../schemas/energy-data.schema";
import { Logger } from "@nestjs/common";
import * as commonUtils from "../../../common";

// Mock para formatDateForApi
jest.mock("../../../common", () => {
  return {
    formatDateForApi: jest.fn().mockImplementation((date, type) => {
      return type === "start" ? "2025-01-01T00:00" : "2025-01-02T00:00";
    }),
  };
});

describe("EnergySchedulerService", () => {
  let service: EnergySchedulerService;
  let energyDataService: EnergyDataService;
  let energyBalanceModel: Model<EnergyBalance>;
  let logger: jest.SpyInstance;

  const mockEnergyDataService = {
    fetchAndSaveEnergyBalance: jest.fn(),
    cleanupExpiredCache: jest.fn(),
  };

  const mockEnergyBalanceModel = {
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnergySchedulerService,
        { provide: EnergyDataService, useValue: mockEnergyDataService },
        {
          provide: getModelToken(EnergyBalance.name),
          useValue: mockEnergyBalanceModel,
        },
      ],
    }).compile();

    service = module.get<EnergySchedulerService>(EnergySchedulerService);
    energyDataService = module.get<EnergyDataService>(EnergyDataService);
    energyBalanceModel = module.get<Model<EnergyBalance>>(
      getModelToken(EnergyBalance.name)
    );

    // Mock del logger para evitar logs en pruebas
    logger = jest.spyOn(Logger.prototype, "log").mockImplementation();
    jest.spyOn(Logger.prototype, "error").mockImplementation();
    jest.spyOn(Logger.prototype, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("debe estar definido", () => {
    expect(service).toBeDefined();
  });

  describe("handleHourlyDataFetch", () => {
    it("debe obtener datos por hora con datos existentes", async () => {
      mockEnergyBalanceModel.countDocuments.mockResolvedValue(10);
      mockEnergyDataService.fetchAndSaveEnergyBalance.mockResolvedValue({
        _id: "test-id",
      });

      // Override del mock para esta prueba específica
      const formatDateForApiMock = commonUtils.formatDateForApi as jest.Mock;
      formatDateForApiMock.mockImplementation((date, type) => {
        return type === "start" ? "2025-01-01T00:00" : "2025-01-02T00:00";
      });

      await service.handleHourlyDataFetch();

      expect(mockEnergyBalanceModel.countDocuments).toHaveBeenCalledWith({
        isScheduled: true,
      });
      expect(formatDateForApiMock).toHaveBeenCalledTimes(2);
      expect(
        mockEnergyDataService.fetchAndSaveEnergyBalance
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          start_date: "2025-01-01T00:00",
          end_date: "2025-01-02T00:00",
          time_trunc: "day",
        }),
        {
          isScheduled: true,
          ttlDays: 7,
        }
      );
    });

    it("debe obtener datos por hora sin datos existentes", async () => {
      mockEnergyBalanceModel.countDocuments.mockResolvedValue(0);
      mockEnergyDataService.fetchAndSaveEnergyBalance.mockResolvedValue({
        _id: "test-id",
      });

      await service.handleHourlyDataFetch();

      expect(mockEnergyBalanceModel.countDocuments).toHaveBeenCalledWith({
        isScheduled: true,
      });
      expect(
        mockEnergyDataService.fetchAndSaveEnergyBalance
      ).toHaveBeenCalled();
    });

    it("debe manejar errores al obtener datos", async () => {
      mockEnergyBalanceModel.countDocuments.mockRejectedValue(
        new Error("Error de base de datos")
      );

      await service.handleHourlyDataFetch();

      expect(mockEnergyBalanceModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe("handleDailyDataFetch", () => {
    it("debe obtener datos diarios correctamente", async () => {
      mockEnergyBalanceModel.countDocuments.mockResolvedValue(5);
      mockEnergyDataService.fetchAndSaveEnergyBalance.mockResolvedValue({
        _id: "test-id",
      });

      await service.handleDailyDataFetch();

      expect(mockEnergyBalanceModel.countDocuments).toHaveBeenCalled();
      expect(
        mockEnergyDataService.fetchAndSaveEnergyBalance
      ).toHaveBeenCalled();
    });
  });

  describe("cleanupCache", () => {
    it("debe limpiar los datos correctamente", async () => {
      mockEnergyDataService.cleanupExpiredCache.mockResolvedValue(5);

      await service.cleanupCache();

      expect(mockEnergyDataService.cleanupExpiredCache).toHaveBeenCalled();
    });

    it("debe manejar errores en la limpieza", async () => {
      mockEnergyDataService.cleanupExpiredCache.mockRejectedValue(
        new Error("Error al limpiar caché")
      );

      await service.cleanupCache();

      expect(mockEnergyDataService.cleanupExpiredCache).toHaveBeenCalled();
    });
  });
});
