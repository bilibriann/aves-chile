import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AveDocument = HydratedDocument<Ave>;

@Schema({
  collection: 'aves',
  timestamps: true,
})
export class Ave {
  @Prop({ required: true, trim: true })
  nombreComun: string;

  @Prop({ required: true, unique: true, trim: true })
  nombreCientifico: string;

  @Prop({ default: null })
  familia: string;

  @Prop({ default: null })
  orden: string;

  @Prop({ default: null })
  genero: string;

  @Prop({ default: false })
  esEndemica: boolean;

  @Prop({ default: null })
  descripcion: string;

  @Prop({ default: null })
  imagenUrl: string;
}

export const AveSchema = SchemaFactory.createForClass(Ave);
