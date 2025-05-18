import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { EnergyApiService } from "./services/energy-api.service";
import { EnergyDataService } from "./services/energy-data.service";
import { EnergySchedulerService } from "./services/energy-scheduler.service";
import { EnergyResolver } from "./resolvers/energy.resolver";
import {
  EnergyBalance,
  EnergyBalanceSchema,
} from "./schemas/energy-data.schema";
import {
  EnergyQueryCache,
  EnergyQueryCacheSchema,
} from "./schemas/energy-query-cache.schema";

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: EnergyBalance.name, schema: EnergyBalanceSchema },
      { name: EnergyQueryCache.name, schema: EnergyQueryCacheSchema },
    ]),
  ],
  providers: [
    EnergyApiService,
    EnergyDataService,
    EnergySchedulerService,
    EnergyResolver,
  ],
  exports: [EnergyApiService, EnergyDataService],
})
export class EnergyModule {}
