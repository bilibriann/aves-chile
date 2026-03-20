import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({
  collection: 'usuarios',
  timestamps: true,
})
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre!: string;

  @Prop({ required: true, unique: true, trim: true })
  correo!: string;

  @Prop({ required: true })
  contrasena!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
