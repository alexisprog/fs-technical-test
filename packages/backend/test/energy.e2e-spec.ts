import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { HttpModule, HttpService } from "@nestjs/axios";
import request from "supertest";
import { of } from "rxjs";
import { EnergyModule } from "../src/modules/energy/energy.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import "./setup-e2e";
import mongoose from "mongoose";
import { EnergyBalance } from "../src/modules/energy/schemas/energy-data.schema";

describe("EnergyResolver (e2e)", () => {
  let app: INestApplication;
  let energyBalanceModel: mongoose.Model<EnergyBalance>;

  // Datos mock para respuestas de la API
  const mockApiResponse = {
    data: {
      data: {
        type: "energy-balance",
        id: "test-1",
        attributes: {
          title: "Balance energético",
          "last-update": "2025-01-01T00:00:00Z",
          description: "Datos de balance energético",
        },
        meta: {
          "cache-control": {
            cache: "public",
          },
        },
      },
      included: [],
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: { url: "" },
  };

  // Consulta GraphQL para obtener el último balance energético
  const latestEnergyBalanceQuery = `
    query {
      latestEnergyBalance {
        data {
          type
          id
          attributes {
            title
          }
        }
      }
    }
  `;

  beforeEach(async () => {
    // Mock para HttpService
    const mockHttpService = {
      get: jest.fn().mockReturnValue(of(mockApiResponse)),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(
          process.env.MONGODB_URI ||
            "mongodb://localhost:27017/fs-technical-test"
        ),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), "src/schema.gql"),
          sortSchema: true,
        }),
        HttpModule,
        EnergyModule,
      ],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Obtener el modelo de EnergyBalance usando getModelToken
    energyBalanceModel = moduleFixture.get<mongoose.Model<EnergyBalance>>(
      getModelToken(EnergyBalance.name)
    );

    const energyBalanceDocument = new energyBalanceModel({
      queryParams: {
        start_date: "2025-05-16T00:00",
        end_date: "2025-05-17T23:59",
      },
      responseData: mockApiResponse.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      cacheTTLDays: 30,
      isScheduled: true,
    });
    await energyBalanceDocument.save();
  });

  afterEach(async () => {
    await app.close();
  });

  it("debería devolver el último balance energético", () => {
    return request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: latestEnergyBalanceQuery,
      })
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.latestEnergyBalance).toBeDefined();
        expect(res.body.data.latestEnergyBalance.data).toBeDefined();
        expect(res.body.data.latestEnergyBalance.data.type).toBe(
          "energy-balance"
        );
      });
  });
});
