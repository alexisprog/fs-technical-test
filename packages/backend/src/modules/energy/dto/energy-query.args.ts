import { ArgsType, Field, GraphQLISODateTime } from "@nestjs/graphql";
import { IsOptional, IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";

@ArgsType()
export class EnergyApiArgs {
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: "Fecha de inicio en formato ISO",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: "Fecha de fin en formato ISO",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}

@ArgsType()
export class DateRangeArgs {
  @Field(() => GraphQLISODateTime, {
    description: "Fecha de inicio en formato ISO",
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => GraphQLISODateTime, {
    description: "Fecha de fin en formato ISO",
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

@ArgsType()
export class IdArg {
  @Field({ description: "ID del recurso" })
  @IsString()
  id: string;
}
