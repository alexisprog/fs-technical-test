import { Resolver, Query, Args } from "@nestjs/graphql";
import { EnergyDataService } from "../services/energy-data.service";
import { EnergyQueryParams } from "../services/energy-api.service";
import { ResponseType, mapToResponseType } from "../../../common";
import { DateRangeArgs } from "../dto/energy-query.args";
import { EnergyBalance } from "../schemas/energy-data.schema";

@Resolver(() => ResponseType)
export class EnergyResolver {
  constructor(private readonly energyDataService: EnergyDataService) {}

  @Query(() => ResponseType, {
    name: "latestEnergyBalance",
    description: "Obtiene el último balance energético disponible",
  })
  async latestEnergyBalance(): Promise<ResponseType> {
    const response = await this.energyDataService.getLatestEnergyBalance({
      isScheduled: true,
    });

    if (!response) {
      throw new Error("No se encontró ningún balance energético");
    }

    // Convertir el objeto EnergyBalance a ResponseType utilizando su campo responseData
    return mapToResponseType(response.responseData);
  }

  @Query(() => ResponseType, {
    name: "energyBalancesByDateRange",
    description: "Obtiene balances energéticos dentro de un rango de fechas",
  })
  async energyBalancesByDateRange(
    @Args() args: DateRangeArgs
  ): Promise<ResponseType> {
    const params: EnergyQueryParams = {
      start_date: args.startDate,
      end_date: args.endDate,
      time_trunc: "day",
    };

    const response = await this.energyDataService.getEnergyDataFromApi(params);
    if (!response) {
      throw new Error(
        "No se encontraron balances energéticos para el rango de fechas especificado"
      );
    }
    return mapToResponseType(response);
  }
}
