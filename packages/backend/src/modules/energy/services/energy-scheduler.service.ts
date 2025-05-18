import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EnergyDataService } from "./energy-data.service";
import { EnergyQueryParams } from "./energy-api.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EnergyBalance } from "../schemas/energy-data.schema";
import { formatDateForApi } from "../../../common";

@Injectable()
export class EnergySchedulerService {
  private readonly logger = new Logger(EnergySchedulerService.name);

  constructor(
    private readonly energyDataService: EnergyDataService,
    @InjectModel(EnergyBalance.name)
    private energyBalanceModel: Model<EnergyBalance>
  ) {}

  /**
   * Programa la obtención de datos de energía cada hora
   */
  // @Cron(CronExpression.EVERY_HOUR)
  @Cron(CronExpression.EVERY_MINUTE)
  async handleHourlyDataFetch() {
    this.logger.log("Iniciando obtención programada de datos de energía");
    try {
      // Verificar si hay datos guardados anteriormente
      const existingData = await this.energyBalanceModel.countDocuments({
        isScheduled: true,
      });

      // Obtener datos del día actual
      const now = new Date();
      let startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      // Si no hay datos previos, consultar también el día anterior
      if (existingData === 0) {
        this.logger.log(
          "No se encontraron datos previos. Consultando también el día anterior..."
        );
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        startDate = yesterday;

        // Informar que estamos buscando un periodo más amplio
        this.logger.log(
          `Consultando periodo extendido desde ${startDate.toISOString()} hasta ${now.toISOString()}`
        );
      }

      const params: EnergyQueryParams = {
        start_date: formatDateForApi(startDate, "start"),
        end_date: formatDateForApi(now, "end"),
        time_trunc: "day",
      };

      const result = await this.energyDataService.fetchAndSaveEnergyBalance(
        params,
        {
          isScheduled: true,
          ttlDays: 7, // Mantener datos horarios por una semana
        }
      );

      if (result) {
        this.logger.log(
          `Datos de energía obtenidos y guardados correctamente (ID: ${result._id})`
        );
      } else {
        this.logger.warn(
          "No se pudieron obtener o guardar los datos de energía"
        );
      }
    } catch (error) {
      this.logger.error(`Error en la obtención programada de datos: ${error}`);
    }
  }

  /**
   * Programa una obtención diaria de datos con resumen por día
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyDataFetch() {
    this.logger.log("Iniciando obtención diaria de datos resumidos");
    try {
      // Verificar si hay datos guardados anteriormente
      const existingData = await this.energyBalanceModel.countDocuments({
        isScheduled: true,
        "queryParams.time_trunc": "day",
      });

      // Obtener datos de los últimos 30 días con resumen diario
      const now = new Date();
      let startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);

      // Si no hay datos previos, consultar los últimos 90 días
      if (existingData === 0) {
        this.logger.log(
          "No se encontraron resúmenes diarios previos. Consultando los últimos 90 días..."
        );
        startDate.setDate(startDate.getDate() - 60); // 30 + 60 = 90 días

        // Informar que estamos buscando un periodo más amplio
        this.logger.log(
          `Consultando periodo extendido desde ${startDate.toISOString()} hasta ${now.toISOString()}`
        );
      }

      const params: EnergyQueryParams = {
        start_date: formatDateForApi(startDate, "start"),
        end_date: formatDateForApi(now, "end"),
        time_trunc: "day",
      };

      const result = await this.energyDataService.fetchAndSaveEnergyBalance(
        params,
        {
          isScheduled: true,
          ttlDays: 90, // Mantener resúmenes diarios por 3 meses
        }
      );

      if (result) {
        this.logger.log(
          `Resumen diario de datos de energía guardado correctamente (ID: ${result._id})`
        );
      } else {
        this.logger.warn("No se pudo obtener o guardar el resumen diario");
      }
    } catch (error) {
      this.logger.error(`Error en la obtención diaria de datos: ${error}`);
    }
  }

  /**
   * Programa una limpieza de datos antiguos (mantiene solo los últimos 30 días)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDataCleanup() {
    this.logger.log("Iniciando limpieza programada de datos antiguos");
    try {
      // Limpiar la caché y los datos antiguos
      await this.cleanupCache();
    } catch (error) {
      this.logger.error(`Error en la limpieza programada de datos: ${error}`);
    }
  }

  /**
   * Limpia la caché de consultas expiradas (una vez al día)
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupCache() {
    this.logger.log("Iniciando limpieza programada de caché y datos antiguos");
    try {
      const deletedCount = await this.energyDataService.cleanupExpiredCache();
      this.logger.log(
        `Limpieza completada. Entradas eliminadas: ${deletedCount}`
      );
    } catch (error) {
      this.logger.error(`Error en la limpieza programada: ${error}`);
    }
  }
}
