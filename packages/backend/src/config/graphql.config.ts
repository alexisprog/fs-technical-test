import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import GraphQLJSON from "graphql-type-json";

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  createGqlOptions(): ApolloDriverConfig {
    return graphqlConfig;
  }
}

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), "src/schema.gql"),
  sortSchema: true,
  playground: false,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  resolvers: { JSON: GraphQLJSON },
};
