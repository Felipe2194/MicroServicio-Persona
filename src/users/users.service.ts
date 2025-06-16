import {
  HttpException, // Aunque es mejor usar las excepciones específicas, la mantengo si la usas en otros lados
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { PermissionEntity } from 'src/entities/permissions.entity'; // CORREGIDO: Usar singular si el archivo es singular
import { RoleEntity } from 'src/entities/roles.entity'; // CORREGIDO: Usar singular si el archivo es singular
import { UserEntity } from 'src/entities/users.entity'; // CORREGIDO: Usar singular si el archivo es singular
import { RegisterDTO } from '../interfaces/register.dto';
import { JwtService } from '../jwt/jwt.service';
import { DeepPartial, Repository, QueryFailedError } from 'typeorm'; // Importa Repository
import { InjectRepository } from '@nestjs/typeorm'; // Importa InjectRepository
import moment from 'moment';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // Renombrado a userRepository para consistencia
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>, // Renombrado a roleRepository
    private jwtService: JwtService,
  ) {}

  async createUser(body: RegisterDTO): Promise<{ status: string }> {
    try {
      if (!body.password) {
        throw new BadRequestException(
          'La contraseña es requerida para el registro.',
        );
      }
      const user = this.userRepository.create(body);
      if (typeof body.password !== 'string') {
        throw new BadRequestException(
          'La contraseña debe ser una cadena de texto.',
        );
      }
      user.password = hashSync(body.password, 10);

      await this.userRepository.save(user); // Usar el repositorio inyectado
      return { status: 'created' };
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      if (error instanceof QueryFailedError) {
        if (
          error.driverError &&
          typeof error.driverError === 'object' &&
          'code' in error.driverError &&
          (error.driverError as { code?: string }).code === '23505'
        ) {
          throw new BadRequestException(
            'El email o nombre de usuario ya existe.',
          );
        }
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el usuario.');
    }
  }

  async getUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find(); // Usar el repositorio inyectado
    } catch (error) {
      console.error('Error en el listado de usuarios:', error);
      throw new InternalServerErrorException(
        'Error en el listado de usuarios.',
      );
    }
  }

  async actualizarUser(
    param: { id: number },
    userDto: DeepPartial<UserEntity>,
  ): Promise<UserEntity> {
    const userAActualizar = await this.userRepository.findOneBy({
      id: param.id,
    });

    if (!userAActualizar) {
      throw new NotFoundException(
        'No se encontró ningún usuario con el ID ingresado',
      );
    }

    if (userDto.password !== undefined && userDto.password !== null) {
      if (typeof userDto.password === 'string') {
        userAActualizar.password = hashSync(userDto.password, 10);
      } else {
        throw new BadRequestException(
          'El formato de la contraseña es inválido.',
        );
      }
    }
    if (userDto.email !== undefined) {
      userAActualizar.email = userDto.email;
    }
    try {
      await this.userRepository.save(userAActualizar); // Usar save para actualizar una entidad existente
      const updatedUser = await this.userRepository.findOneBy({ id: param.id });
      if (!updatedUser) {
        throw new InternalServerErrorException(
          'Usuario actualizado no encontrado después de guardar.',
        );
      }
      return updatedUser; // Devuelve el usuario actualizado
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      if (error instanceof QueryFailedError) {
        if (
          error.driverError &&
          typeof error.driverError === 'object' &&
          'code' in error.driverError &&
          (error.driverError as { code?: string }).code === '23505'
        ) {
          throw new BadRequestException('El email ya está en uso.');
        }
      }
      throw new InternalServerErrorException('Error al actualizar el usuario.');
    }
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const userAEliminar = await this.userRepository.findOneBy({ id: id });
    if (!userAEliminar) {
      throw new NotFoundException('No se encontró ningún usuario con el ID ingresado para eliminar.');
    } else {
      await this.userRepository.delete({ id: id });
      return { message: 'Eliminado con éxito' };
    }
  }

  async asignarPermissionAUser(
    param: { id: number },
    permission_body: DeepPartial<PermissionEntity>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: param.id },
      relations: ['permissions'],
    });
    if (!user) {
      throw new NotFoundException('Usuario con ID ingresado no encontrado.');
    }

    const permission = await this.permissionRepository.findOneBy({
      id: permission_body.id,
    });
    if (!permission) {
      throw new NotFoundException('Permiso con ID ingresado no encontrado.');
    }

    if (
      user.permissions &&
      user.permissions.find((p) => p.id === permission.id)
    ) {
      // Renombrado a 'p'
      throw new BadRequestException('El permiso ya está asignado al usuario.');
    }

    if (!user.permissions) {
      user.permissions = [];
    }

    user.permissions.push(permission);
    return await this.userRepository.save(user);
  }

  async asignarRoleAUser(
    param: { id: number },
    role_body: DeepPartial<RoleEntity>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: param.id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('Usuario con ID ingresado no encontrado.');
    }

    const role = await this.roleRepository.findOneBy({ id: role_body.id });
    if (!role) {
      throw new NotFoundException('Rol con ID ingresado no encontrado.');
    }

    if (user.roles && user.roles.find((r) => r.id === role.id)) {
      throw new BadRequestException('El rol ya está asignado al usuario.');
    }

    if (!user.roles) {
      user.roles = [];
    }
    user.roles.push(role);
    return await this.userRepository.save(user);
  }

  async login(body: registerDTO) {
    const user = await this.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.'); // Añadir mensaje
    }

    if (typeof user.password !== 'string') {
      throw new InternalServerErrorException(
        'Contraseña del usuario no configurada.',
      );
    }
    if (typeof body.password !== 'string') {
      throw new BadRequestException(
        'La contraseña proporcionada no es válida.',
      );
    }

    if (
      typeof body.password !== 'string' ||
      typeof user.password !== 'string'
    ) {
      throw new BadRequestException(
        'Las contraseñas deben ser cadenas de texto.',
      );
    }

    const compareResult: boolean = (
      compareSync as (s: string, h: string) => boolean
    )(body.password, user.password);

    if (!compareResult) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return {
      accessToken: this.jwtService.generateToken({ email: user.email }, 'auth'),
      refreshToken: this.jwtService.generateToken(
        { email: user.email },
        'refresh',
      ),
      // CORRECCIÓN: Eliminar el paréntesis extra ')'
      expirationTime: moment().add(10, 'minutes').toDate(),
    };
  }

  refreshToken(refreshToken: string) {
    try {
      return this.jwtService.refreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Token de refresco inválido o expirado.');
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async canDo(user: UserEntity, permission_param: number): Promise<boolean> {
    // CORRECCIÓN: Usar un nombre de variable diferente para evitar conflicto con el parámetro 'user'
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['permissions'],
    });

    if (!foundUser) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // CORRECCIÓN: Usar optional chaining para acceder a permissions de forma segura
    const tienePermiso = foundUser.permissions?.some(
      (permission) => permission.id === permission_param, // CORRECCIÓN: Nombre de variable
    );

    if (tienePermiso) {
      return true;
    } else {
      throw new UnauthorizedException('El usuario no tiene permiso.');
    }
  }
}
