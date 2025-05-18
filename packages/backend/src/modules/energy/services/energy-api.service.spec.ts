import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { EnergyApiService } from "./energy-api.service";
import { of } from "rxjs";

const url = "https://apidatos.ree.es/es/datos/balance/balance-electrico";

describe("EnergyApiService", () => {
  let service: EnergyApiService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(url),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnergyApiService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EnergyApiService>(EnergyApiService);
    httpService = module.get<HttpService>(HttpService);
    // Resetear el mock antes de cada prueba
    mockHttpService.get.mockClear();
  });

  it("debe estar definido", () => {
    expect(service).toBeDefined();
  });

  describe("fetchEnergyBalance", () => {
    it("debe obtener datos del balance energético correctamente", async () => {
      const mockResponse = {
        data: {
          data: {
            type: "test",
            id: "1",
            attributes: {},
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: { url: "" },
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.fetchEnergyBalance({
        start_date: "2025-01-01",
        end_date: "2025-01-02",
      });

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });

    it("debe obtener datos sin parámetros", async () => {
      const mockResponse = {
        data: { data: { type: "test", id: "1", attributes: {} } },
        status: 200,
        statusText: "OK",
        headers: {},
        config: { url: "" },
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      await service.fetchEnergyBalance();

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(httpService.get).toHaveBeenCalledWith(url);
    });

    it("debe construir la URL correctamente con varios parámetros", async () => {
      const mockResponse = {
        data: { data: { type: "test", id: "1", attributes: {} } },
        status: 200,
        statusText: "OK",
        headers: {},
        config: { url: "" },
      };
      const params = {
        start_date: new Date("2025-01-01T00:00:00.000Z"),
        end_date: "2025-01-02",
        time_trunc: "day" as const,
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      await service.fetchEnergyBalance(params);

      // Esperamos que formatDateForApi sea llamada y que los parámetros se añadan correctamente
      expect(httpService.get).toHaveBeenCalledTimes(1);
      // Notar que end_date se espera que se formatee a 23:59
      expect(httpService.get).toHaveBeenCalledWith(
        `${url}?start_date=2025-01-01T00%3A00&end_date=2025-01-02T23%3A59&time_trunc=day`
      );
    });

    it("debe manejar errores de formato de fecha y usar el valor original", async () => {
      const mockResponse = {
        data: { data: { type: "test", id: "1", attributes: {} } },
        status: 200,
        statusText: "OK",
        headers: {},
        config: { url: "" },
      };
      const params = {
        start_date: "invalid-date-string", // Esto debería causar un error en formatDateForApi
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));
      jest.spyOn(service["logger"], "warn"); // Espiar el logger

      await service.fetchEnergyBalance(params);

      expect(httpService.get).toHaveBeenCalledTimes(1);
      // Debería usar el string original si falla el formato
      expect(httpService.get).toHaveBeenCalledWith(
        `${url}?start_date=invalid-date-string`
      );
      expect(service["logger"].warn).toHaveBeenCalled(); // Verificar que se registró una advertencia
    });

    it("debe manejar errores específicos de la API (con estructura de error)", async () => {
      const mockApiErrorResponse = {
        response: {
          data: {
            errors: [
              {
                code: 400,
                status: "Bad Request",
                title: "Invalid Parameter",
                detail: "The provided date format is incorrect.",
              },
            ],
          },
          status: 400,
          statusText: "Bad Request",
          headers: {},
          config: { url: "" },
        },
        isAxiosError: true,
        message: "Request failed with status code 400",
        name: "AxiosError",
        stack: "",
        config: { headers: {} as any },
        request: {},
      };

      mockHttpService.get.mockImplementationOnce(() => {
        throw mockApiErrorResponse; // Lanzar un error con estructura de API
      });

      jest.spyOn(service["logger"], "error"); // Espiar el logger

      const result = await service.fetchEnergyBalance();

      expect(result).toBeNull(); // Debería retornar null
      expect(service["logger"].error).toHaveBeenCalled(); // Verificar que se registró el error
      // Debería lanzar el error después de registrarlo para ser capturado por el bloque catch externo
    });

    it("debe manejar errores genéricos de Axios (sin estructura de error específica de la API)", async () => {
      const mockGenericAxiosError = {
        response: {
          data: "Something went wrong",
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          config: { url: "" },
        },
        isAxiosError: true,
        message: "Request failed with status code 500",
        name: "AxiosError",
        stack: "",
        config: { headers: {} as any },
        request: {},
      };

      mockHttpService.get.mockImplementationOnce(() => {
        throw mockGenericAxiosError; // Lanzar un error genérico de Axios
      });

      jest.spyOn(service["logger"], "error"); // Espiar el logger

      const result = await service.fetchEnergyBalance();

      expect(result).toBeNull(); // Debería retornar null
      expect(service["logger"].error).toHaveBeenCalled(); // Verificar que se registró el error
      // Debería lanzar el error después de registrarlo para ser capturado por el bloque catch externo
    });
  });
});
