import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { Response } from "../../../common/interfaces";
import { formatDateForApi } from "../../../common";

export interface EnergyQueryParams {
  start_date?: string | Date;
  end_date?: string | Date;
  time_trunc?: "hour" | "day" | "month" | "year";
  geo_trunc?: string;
  geo_limit?: string;
  geo_ids?: string;
}

export interface EnergyApiError {
  errors: {
    code: number;
    status: string;
    title: string;
    detail: string;
  }[];
}

@Injectable()
export class EnergyApiService {
  private readonly logger = new Logger(EnergyApiService.name);
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const apiUrl =
      this.configService.get<string>("ENERGY_API_URL") ||
      "https://apidatos.ree.es/es/datos/balance/balance-electrico";
    this.apiUrl = apiUrl;
  }

  /**
   * Obtiene los datos del balance energético desde la API externa
   * @param params Parámetros opcionales de consulta (fechas, truncamiento, etc.)
   */
  async fetchEnergyBalance(
    params?: EnergyQueryParams
  ): Promise<Response | null> {
    try {
      // Construir URL con parámetros de consulta
      let url = this.apiUrl;

      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            // Formatear fechas al formato requerido por la API: YYYY-MM-DDTHH:MM
            if (key === "start_date") {
              if (value instanceof Date || typeof value === "string") {
                try {
                  queryParams.append(key, formatDateForApi(value, "start"));
                } catch (error) {
                  this.logger.warn(
                    `Error al formatear fecha ${key}: ${error.message}`
                  );
                  queryParams.append(key, String(value));
                }
              } else {
                queryParams.append(key, String(value));
              }
            } else if (key === "end_date") {
              if (value instanceof Date || typeof value === "string") {
                try {
                  queryParams.append(key, formatDateForApi(value, "end"));
                } catch (error) {
                  this.logger.warn(
                    `Error al formatear fecha ${key}: ${error.message}`
                  );
                  queryParams.append(key, String(value));
                }
              } else {
                queryParams.append(key, String(value));
              }
            } else {
              queryParams.append(key, String(value));
            }
          }
        });

        const queryString = queryParams.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
      }

      this.logger.log(`Solicitando datos de: ${url}`);

      const response = await firstValueFrom<AxiosResponse<Response>>(
        this.httpService.get<Response>(url).pipe(
          catchError((error: AxiosError) => {
            // Extraer la estructura de error de la API si está disponible
            if (error.response && error.response.data) {
              const apiError = error.response.data as EnergyApiError;
              if (apiError.errors && apiError.errors.length > 0) {
                const firstError = apiError.errors[0];
                this.logger.error(
                  `Error de API (${firstError.code}): ${firstError.title} - ${firstError.detail}`
                );
                throw new Error(`${firstError.title}: ${firstError.detail}`);
              }
            }

            // Si no se puede extraer la estructura específica, usar el mensaje genérico
            this.logger.error(
              `Error al obtener datos de energía: ${error.message}`
            );
            throw error;
          })
        )
      );

      this.logger.log(`Datos de energía obtenidos correctamente`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener balance energético: ${error}`);
      return null;
    }
  }
}
