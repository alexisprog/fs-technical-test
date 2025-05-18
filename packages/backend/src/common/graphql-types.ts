import { Field, ObjectType, Float } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { Response } from "./interfaces";

@ObjectType()
export class ValueType {
  @Field(() => Float)
  value: number;

  @Field(() => Float)
  percentage: number;

  @Field()
  datetime: string;
}

@ObjectType()
export class Attributes3Type {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  color: string;

  @Field(() => GraphQLJSON, { nullable: true })
  icon: any;

  @Field({ nullable: true })
  type?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  magnitude: any;

  @Field(() => Boolean)
  composite: boolean;

  @Field({ name: "lastUpdate" })
  lastUpdate: string;

  @Field(() => [ValueType])
  values: ValueType[];

  @Field(() => Float)
  total: number;

  @Field(() => Float, { name: "totalPercentage" })
  totalPercentage: number;
}

@ObjectType()
export class ContentType {
  @Field()
  type: string;

  @Field()
  id: string;

  @Field()
  groupId: string;

  @Field(() => Attributes3Type)
  attributes: Attributes3Type;
}

@ObjectType()
export class CacheControlType {
  @Field()
  cache: string;
}

@ObjectType()
export class MetaType {
  @Field(() => CacheControlType, { name: "cacheControl" })
  cacheControl: CacheControlType;
}

@ObjectType()
export class AttributesType {
  @Field()
  title: string;

  @Field({ name: "lastUpdate" })
  lastUpdate: string;

  @Field()
  description: string;
}

@ObjectType()
export class Attributes2Type {
  @Field()
  title: string;

  @Field({ name: "lastUpdate" })
  lastUpdate: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  magnitude: any;

  @Field(() => [ContentType])
  content: ContentType[];
}

@ObjectType()
export class IncludedType {
  @Field()
  type: string;

  @Field()
  id: string;

  @Field(() => Attributes2Type)
  attributes: Attributes2Type;
}

@ObjectType()
export class DataType {
  @Field()
  type: string;

  @Field()
  id: string;

  @Field(() => AttributesType)
  attributes: AttributesType;

  @Field(() => MetaType)
  meta: MetaType;
}

@ObjectType({ description: "Respuesta de datos energéticos" })
export class ResponseType {
  @Field(() => DataType, { description: "Datos principales de la respuesta" })
  data: DataType;

  @Field(() => [IncludedType], {
    description: "Elementos incluidos en la respuesta",
  })
  included: IncludedType[];
}

// Función auxiliar para mapear de la interfaz a la clase GraphQL
export function mapToResponseType(response: Response): ResponseType {
  return {
    data: {
      type: response.data.type,
      id: response.data.id,
      attributes: {
        title: response.data.attributes.title,
        lastUpdate: response.data.attributes["last-update"],
        description: response.data.attributes.description,
      },
      meta: {
        cacheControl: {
          cache: response.data.meta["cache-control"].cache,
        },
      },
    },
    included: response.included.map((item) => ({
      type: item.type,
      id: item.id,
      attributes: {
        title: item.attributes.title,
        lastUpdate: item.attributes["last-update"],
        description: item.attributes.description,
        magnitude: item.attributes.magnitude,
        content: item.attributes.content.map((contentItem) => ({
          type: contentItem.type,
          id: contentItem.id,
          groupId: contentItem.groupId,
          attributes: {
            title: contentItem.attributes.title,
            description: contentItem.attributes.description,
            color: contentItem.attributes.color,
            icon: contentItem.attributes.icon,
            type: contentItem.attributes.type,
            magnitude: contentItem.attributes.magnitude,
            composite: contentItem.attributes.composite,
            lastUpdate: contentItem.attributes["last-update"],
            values: contentItem.attributes.values.map((value) => ({
              value: value.value,
              percentage: value.percentage,
              datetime: value.datetime,
            })),
            total: contentItem.attributes.total,
            totalPercentage: contentItem.attributes["total-percentage"],
          },
        })),
      },
    })),
  };
}
