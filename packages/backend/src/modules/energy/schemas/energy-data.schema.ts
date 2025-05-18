import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { EnergyQueryParams } from "../services/energy-api.service";

@Schema()
export class EnergyBalance extends Document {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  queryParams: EnergyQueryParams;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  responseData: any;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  // Tiempo de expiración de la caché en días (por defecto 30 días)
  @Prop({ type: Number, default: 30 })
  cacheTTLDays: number;

  // Indica si esta entrada proviene de una tarea programada
  @Prop({ type: Boolean, default: false })
  isScheduled: boolean;
}

export const EnergyBalanceSchema = SchemaFactory.createForClass(EnergyBalance);

// Crear un índice único basado en los parámetros de consulta y si es programado
EnergyBalanceSchema.index(
  {
    "queryParams.start_date": 1,
    "queryParams.end_date": 1,
    "queryParams.time_trunc": 1,
    "queryParams.geo_trunc": 1,
    "queryParams.geo_limit": 1,
    "queryParams.geo_ids": 1,
    isScheduled: 1,
  },
  { unique: true, sparse: true }
);

// Índice por fecha de creación para facilitar la limpieza
EnergyBalanceSchema.index({ createdAt: 1 });

// Índice por isScheduled para filtrar rápidamente
EnergyBalanceSchema.index({ isScheduled: 1 });
