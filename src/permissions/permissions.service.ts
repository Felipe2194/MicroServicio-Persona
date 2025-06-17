// src/permissions/permissions.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { PermissionEntity } from 'src/entities/permissions.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createPermission(
    permissionDto: DeepPartial<PermissionEntity>, // Renombrado a permissionDto para claridad
  ): Promise<PermissionEntity> {
    try {
      const newPermission = this.permissionRepository.create(permissionDto); // Usa el repositorio inyectado
      return await this.permissionRepository.save(newPermission);
    } catch (error: any) {
      console.error('Error al crear el permiso:', error);
      throw new BadRequestException(
        'Error al crear el permiso. Verifique los datos.',
      );
    }
  }

  async getPermissions(): Promise<PermissionEntity[]> {
    try {
      return await this.permissionRepository.find(); // Usa el repositorio inyectado
    } catch (error) {
      console.error('Error al listar permisos:', error); // Usa la variable 'error'
      throw new InternalServerErrorException('Error al listar los permisos.');
    }
  }

  async findOnePermission(id: number): Promise<PermissionEntity> {
    // Método para obtener un permiso por ID, útil para reutilizar
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado.`);
    }
    return permission;
  }

  async actualizarPermission(
    param: { id: number },
    permissionDto: DeepPartial<PermissionEntity>, // Renombrado a permissionDto
  ): Promise<PermissionEntity> {
    const permissionAActualizar = await this.permissionRepository.findOneBy({
      id: param.id,
    });

    if (!permissionAActualizar) {
      throw new NotFoundException( // Usa NotFoundException de NestJS
        'No se encontró ningún permiso con el ID ingresado',
      );
    }

    // Actualizar las propiedades del permiso existente
    if (permissionDto.name !== undefined) {
      permissionAActualizar.name = permissionDto.name;
    }
    if (permissionDto.description !== undefined) {
      permissionAActualizar.description = permissionDto.description;
    }

    await this.permissionRepository.save(permissionAActualizar); // Usa .save para actualizar
    return await this.findOnePermission(param.id); // Reutiliza findOnePermission para cargar el actualizado
  }

  // 4. CORRECCIÓN: Tipo de retorno y formato de respuesta
  async deletePermission(id: number): Promise<{ message: string }> {
    const permissionAEliminar = await this.permissionRepository.findOneBy({
      id,
    }); // Usa el repositorio inyectado

    if (!permissionAEliminar) {
      throw new NotFoundException( // Usa NotFoundException de NestJS
        `No se encontró ningún permiso con el ID ${id} para eliminar.`,
      );
    }

    await this.permissionRepository.delete({ id }); // Usa el repositorio inyectado
    return { message: 'deleted' }; // Retorna el objeto que el controlador espera
  }
}
