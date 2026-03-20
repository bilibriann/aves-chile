import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async crear(crearUsuarioDto: CrearUsuarioDto) {
    const usuarioExistente = await this.usuarioModel.findOne({
      correo: crearUsuarioDto.correo,
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo ya está registrado');
    }

    const nuevoUsuario = new this.usuarioModel(crearUsuarioDto);
    return nuevoUsuario.save();
  }

  async obtenerTodos() {
    return this.usuarioModel.find().sort({ createdAt: -1 });
  }

  async obtenerUno(id: string) {
    const usuario = await this.usuarioModel.findById(id);

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }
}
