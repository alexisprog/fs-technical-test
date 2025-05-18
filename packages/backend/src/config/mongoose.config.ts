import { Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri:
        this.configService.get<string>("MONGODB_URI") ||
        "mongodb://localhost:27017/fs-technical-test",
    };
  }
}

export const mongooseConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService
  ): Promise<MongooseModuleOptions> => ({
    uri:
      configService.get<string>("MONGODB_URI") ||
      "mongodb://localhost:27017/fs-technical-test",
  }),
};
