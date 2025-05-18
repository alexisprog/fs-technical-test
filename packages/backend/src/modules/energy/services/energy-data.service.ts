import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EnergyApiService, EnergyQueryParams } from "./energy-api.service";
import { EnergyBalance } from "../schemas/energy-data.schema";
import { EnergyQueryCache } from "../schemas/energy-query-cache.schema";
import { Response } from "../../../common/interfaces";

@Injectable()
export class EnergyDataService {
  private readonly logger = new Logger(EnergyDataService.name);

  constructor(
    @InjectModel(EnergyBalance.name)
    private energyBalanceModel: Model<EnergyBalance>,
    @InjectModel(EnergyQueryCache.name)
    private energyQueryCacheModel: Model<EnergyQueryCache>,
    private readonly energyApiService: EnergyApiService
  ) {}

  /**
   * Obtiene los datos más recientes de balance energético
   * @param options Opciones adicionales para la consulta
   * @returns La entrada más reciente de balance energético
   */
  async getLatestEnergyBalance(
    options: {
      isScheduled?: boolean; // Indica si proviene de una tarea programada
    } = {}
  ): Promise<EnergyBalance | null> {
    try {
      // Construir filtros de consulta
      const filter: Record<string, any> = {};

      // Si isScheduled está definido, usarlo como filtro
      if (options.isScheduled !== undefined) {
        filter["isScheduled"] = options.isScheduled;
      }

      // Ordenar por fecha de creación (más reciente primero)
      return await this.energyBalanceModel
        .findOne(filter)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(`Error al obtener el balance energético: ${error}`);
      return null;
    }
  }

  /**
   * Obtiene balances energéticos por rango de fechas
   */
  async getEnergyBalancesByDateRange(
    startDate: Date,
    endDate: Date,
    options: {
      isScheduled?: boolean; // Indica si proviene de una tarea programada
    } = {}
  ): Promise<EnergyBalance[]> {
    try {
      // Construir filtros de consulta
      const filter: Record<string, any> = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      // Si isScheduled está definido, usarlo como filtro
      if (options.isScheduled !== undefined) {
        filter["isScheduled"] = options.isScheduled;
      }

      return await this.energyBalanceModel
        .find(filter)
        .sort({ createdAt: 1 })
        .exec();
    } catch (error) {
      this.logger.error(
        `Error al obtener balances por rango de fechas: ${error}`
      );
      return [];
    }
  }

  /**
   * Obtiene y guarda los datos de balance energético
   * @param queryParams Parámetros para la consulta a la API
   * @param options Opciones adicionales para la operación
   */
  async fetchAndSaveEnergyBalance(
    queryParams: EnergyQueryParams,
    options: {
      isScheduled?: boolean; // Indica si proviene de una tarea programada
      ttlDays?: number; // Tiempo de vida en días
    } = {}
  ): Promise<EnergyBalance | null> {
    try {
      this.logger.log(
        `Obteniendo datos de energía con parámetros: ${JSON.stringify(queryParams || {})}`
      );

      // Intentar obtener datos de la API externa
      const apiData = await this.getEnergyDataFromApi(queryParams);

      if (!apiData) {
        this.logger.warn("Datos de API inválidos o incompletos");
        return null;
      }

      // Normalizar parámetros para búsqueda
      const normalizedParams = this.normalizeQueryParams(queryParams);

      // Verificar si ya existe una entrada con estos parámetros
      let existingEntry = await this.energyBalanceModel.findOne({
        queryParams: normalizedParams,
        isScheduled:
          options.isScheduled !== undefined ? options.isScheduled : false,
      });

      if (existingEntry) {
        // Actualizar entrada existente
        existingEntry.responseData = apiData;
        existingEntry.updatedAt = new Date();

        const savedData = await existingEntry.save();
        this.logger.log(
          `Balance energético actualizado correctamente (ID: ${savedData._id})`
        );
        return savedData;
      } else {
        // Crear nueva entrada
        const newEntry = new this.energyBalanceModel({
          queryParams: normalizedParams,
          responseData: apiData,
          createdAt: new Date(),
          updatedAt: new Date(),
          cacheTTLDays: options.ttlDays || 30, // Por defecto 30 días para balances periódicos
          isScheduled:
            options.isScheduled !== undefined ? options.isScheduled : false,
        });

        const savedData = await newEntry.save();
        this.logger.log(
          `Nuevo balance energético guardado correctamente (ID: ${savedData._id})`
        );
        return savedData;
      }
    } catch (error) {
      this.logger.error(`Error al guardar el balance energético: ${error}`);
      return null;
    }
  }

  /**
   * Genera una clave única para los parámetros de consulta
   * @param params Parámetros de consulta
   * @returns Objeto con los parámetros normalizados para buscar en caché
   */
  private normalizeQueryParams(params: EnergyQueryParams): Record<string, any> {
    // Creamos una copia para no modificar el original
    const normalizedParams: Record<string, any> = { ...params };

    // Ordenamos las claves para garantizar consistencia
    return Object.keys(normalizedParams)
      .sort()
      .reduce((obj: Record<string, any>, key: string) => {
        obj[key] = normalizedParams[key];
        return obj;
      }, {});
  }

  /**
   * Busca una consulta en la caché por sus parámetros
   * @param params Parámetros de consulta
   * @returns Datos de la caché o null si no existe
   */
  private async findCachedQuery(
    params: EnergyQueryParams
  ): Promise<EnergyQueryCache | null> {
    try {
      const normalizedParams = this.normalizeQueryParams(params);

      // Buscar una entrada de caché que coincida con los parámetros
      const cachedQuery = await this.energyQueryCacheModel.findOne({
        queryParams: normalizedParams,
      });

      if (!cachedQuery) {
        return null;
      }

      // Verificar si la caché ha expirado
      const now = new Date();
      const cacheDate = new Date(cachedQuery.createdAt);
      const ttlDays = cachedQuery.cacheTTLDays || 7; // Por defecto 7 días

      // Añadir días al TTL
      cacheDate.setDate(cacheDate.getDate() + ttlDays);

      // Si la fecha de caché + TTL es menor que ahora, la caché ha expirado
      if (cacheDate < now) {
        this.logger.debug(
          `Caché expirada para consulta: ${JSON.stringify(normalizedParams)}`
        );
        return null;
      }

      return cachedQuery;
    } catch (error) {
      this.logger.error(`Error al buscar consulta en caché: ${error}`);
      return null;
    }
  }

  /**
   * Guarda una consulta y su respuesta en la caché
   * @param params Parámetros de la consulta
   * @param responseData Datos de respuesta de la API
   */
  private async saveQueryToCache(
    params: EnergyQueryParams,
    responseData: any
  ): Promise<void> {
    try {
      const normalizedParams = this.normalizeQueryParams(params);

      // Buscar si ya existe una entrada con estos parámetros
      const existingCache = await this.energyQueryCacheModel.findOne({
        queryParams: normalizedParams,
      });

      if (existingCache) {
        // Actualizar la entrada existente
        existingCache.responseData = responseData;
        existingCache.updatedAt = new Date();
        await existingCache.save();
        this.logger.debug(
          `Caché actualizada para consulta: ${JSON.stringify(normalizedParams)}`
        );
      } else {
        // Crear una nueva entrada
        const newCache = new this.energyQueryCacheModel({
          queryParams: normalizedParams,
          responseData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await newCache.save();
        this.logger.debug(
          `Nueva caché creada para consulta: ${JSON.stringify(normalizedParams)}`
        );
      }
    } catch (error) {
      this.logger.error(`Error al guardar consulta en caché: ${error}`);
    }
  }

  /**
   * Obtiene datos de energía primero desde la caché, y si no existen, consulta la API externa
   * @param params Parámetros de consulta para la API
   */
  async getEnergyDataFromApi(
    params: EnergyQueryParams
  ): Promise<Response | null> {
    try {
      // Primero verificar si existe en caché
      const cachedData = await this.findCachedQuery(params);
      if (cachedData) {
        this.logger.log(
          `Usando datos en caché para consulta: ${JSON.stringify(params)}`
        );
        return cachedData.responseData;
      }

      this.logger.log(
        `No se encontró en caché, consultando API externa: ${JSON.stringify(params)}`
      );

      // Si no está en caché, consultar la API externa
      const apiData = await this.energyApiService.fetchEnergyBalance(params);

      // Si la respuesta es válida, guardarla en caché y retornarla
      if (apiData) {
        // Guardar la respuesta en caché para futuras consultas
        await this.saveQueryToCache(params, apiData);
        return apiData;
      }

      this.logger.warn("Datos de API inválidos o sin respuesta");
      return null;
    } catch (error) {
      this.logger.error(`Error al obtener datos de la API: ${error.message}`);
      return null;
    }
  }

  /**
   * Limpia entradas de caché antiguas basadas en su TTL
   */
  async cleanupExpiredCache(): Promise<number> {
    try {
      const now = new Date();
      const result = { deleted: 0 };

      // Limpiar caché de consultas
      const allCacheEntries = await this.energyQueryCacheModel.find();
      const expiredCacheEntries = allCacheEntries.filter((entry) => {
        const cacheDate = new Date(entry.createdAt);
        const ttlDays = entry.cacheTTLDays || 7;
        cacheDate.setDate(cacheDate.getDate() + ttlDays);
        return cacheDate < now;
      });

      if (expiredCacheEntries.length > 0) {
        const cacheIds = expiredCacheEntries.map((entry) => entry._id);
        const cacheResult = await this.energyQueryCacheModel.deleteMany({
          _id: { $in: cacheIds },
        });
        result.deleted += cacheResult.deletedCount;
      }

      // Limpiar datos de balance energético
      const allBalanceEntries = await this.energyBalanceModel.find();
      const expiredBalanceEntries = allBalanceEntries.filter((entry) => {
        const entryDate = new Date(entry.createdAt);
        const ttlDays = entry.cacheTTLDays || 30;
        entryDate.setDate(entryDate.getDate() + ttlDays);
        return entryDate < now;
      });

      if (expiredBalanceEntries.length > 0) {
        const balanceIds = expiredBalanceEntries.map((entry) => entry._id);
        const balanceResult = await this.energyBalanceModel.deleteMany({
          _id: { $in: balanceIds },
        });
        result.deleted += balanceResult.deletedCount;
      }

      this.logger.log(
        `Limpieza de datos completada. Total eliminados: ${result.deleted}`
      );
      return result.deleted;
    } catch (error) {
      this.logger.error(`Error al limpiar datos expirados: ${error}`);
      return 0;
    }
  }
}
