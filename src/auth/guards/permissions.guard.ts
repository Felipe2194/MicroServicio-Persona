// src/auth/guards/permissions.guard.ts
// Este es el Guard que implementa la lógica de verificación de permisos, comunicándose con el microservicio de login. 
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios from 'axios';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'; // Ruta correcta ahora

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Obtener los permisos requeridos del decorador @Permissions en el controlador/método
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no se especificaron permisos para este endpoint, se concede el acceso por defecto.
    if (!requiredPermissions) {
      return true;
    }

    // 2. Extraer el token de autorización de la cabecera de la petición
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Espera un formato "Bearer <token>"

    if (!token) {
      throw new UnauthorizedException('Token de autenticación faltante.');
    }

    // 3. Comunicación con el microservicio de login/autenticación
    // **** IMPORTANTE: Ajusta esta URL a la dirección y puerto REAL de tu microservicio de login ****
    const LOGIN_MICROSERVICE_URL = 'http://localhost:3001'; // <-- ¡Cambia esto si tu microservicio está en otro lugar!

    try {
      // Realiza una petición POST al endpoint /can-do del microservicio
      const response = await axios.post(
        `${LOGIN_MICROSERVICE_URL}/can-do`,
        {
          permissions: requiredPermissions, // Envía los permisos que el endpoint requiere
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token del usuario
          },
        },
      );

      // El microservicio debe devolver un objeto como { canAccess: boolean }
      return response.data.canAccess;
    } catch (error) {
      console.error('Error al comunicarse con el microservicio de autenticación:', error.message);
      if (axios.isAxiosError(error) && error.response) {
        // Propaga el estado y mensaje de error desde el microservicio si es un error HTTP
        throw new UnauthorizedException(error.response.data.message || 'Permiso denegado por el servicio de autenticación.');
      }
      throw new UnauthorizedException('Fallo al verificar los permisos.');
    }
  }
}