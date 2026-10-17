import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller.js';
import { CreateUsuarioAction } from './actions/create-usuario.action.js';
import { DeleteUsuarioAction } from './actions/delete-usuario.action.js';
import { GetUsuarioAction } from './actions/get-usuario.action.js';
import { GetUsuariosAction } from './actions/get-usuarios.action.js';
import { UpdateUsuarioAction } from './actions/update-usuario.action.js';
import { PrismaUsuarioRepository } from './repositories/prisma-usuario.repository.js';
import { UsuarioRepository } from './repositories/usuario.repository.js';
import { RolesModule } from '../roles/roles.module.js';
import { MailerModule } from '../mailer/mailer.module.js';

@Module({
  imports: [RolesModule, MailerModule],
  controllers: [UsuariosController],
  providers: [
    { provide: UsuarioRepository, useClass: PrismaUsuarioRepository },
    CreateUsuarioAction,
    DeleteUsuarioAction,
    GetUsuarioAction,
    GetUsuariosAction,
    UpdateUsuarioAction,
  ],
  exports: [UsuarioRepository],
})
export class UsuariosModule { }
