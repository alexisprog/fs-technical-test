import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { GraphQLConfigService } from "./config/graphql.config";
import { mongooseConfig } from "./config/mongoose.config";
import { EnergyModule } from "./modules/energy/energy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphQLConfigService,
    }),
    MongooseModule.forRootAsync(mongooseConfig),
    ScheduleModule.forRoot(),
    EnergyModule,
  ],
})
export class AppModule {}
