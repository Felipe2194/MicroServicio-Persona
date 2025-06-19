// src/jwt/middleware/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'; // Importamos la librería jsonwebtoken
import { Request } from 'express'; // Importamos Request para tipar correctamente
import { AuthRequest } from 'src/interfaces/auth-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);

    // ¡IMPORTANTE! Esta clave secreta debe ser la misma que usas para firmar tus tokens JWT.
    // En una aplicación real, NUNCA la hardcodees. Usa variables de entorno (ej. process.env.JWT_SECRET).
    private readonly jwtSecret = 'TU_SUPER_SECRETO_JWT_AQUI'; // <-- ¡CAMBIA ESTO!

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            this.logger.warn('Acceso denegado: Header de Authorization no proporcionado.');
            throw new UnauthorizedException('Token de autorización no proporcionado.');
        }

        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
            this.logger.warn('Acceso denegado: Formato de token inválido. Debe ser "Bearer <token>".');
            throw new UnauthorizedException('Formato de token de autorización inválido. Use "Bearer <token>".');
        }

        const token = tokenParts[1]; // El token JWT puro

        try {
            // Verificar el token usando la clave secreta
            const decodedPayload: any = jwt.verify(token, this.jwtSecret);

            // Si el token es válido, adjuntamos el payload decodificado al objeto request.
            // Esto hará que `request.user` esté disponible en el controlador.
            request['user'] = {
                userId: decodedPayload.sub, // 'sub' es un estándar para el ID del sujeto (usuario)
                username: decodedPayload.username,
                roles: decodedPayload.roles || [], // Asumiendo que puedes tener roles en el payload
                // ... cualquier otra información que quieras del token
            };

            const req = request as AuthRequest;
            this.logger.log(`Token JWT verificado exitosamente para el usuario: ${req.user.email}`);

            return true; // Token válido, permite el acceso
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                this.logger.warn('Acceso denegado: Token JWT expirado.');
                throw new UnauthorizedException('El token de autorización ha expirado.');
            } else if (err instanceof jwt.JsonWebTokenError) {
                this.logger.warn('Acceso denegado: Token JWT inválido.', err.message);
                throw new UnauthorizedException('El token de autorización es inválido.');
            } else {
                this.logger.error('Error inesperado al verificar el token JWT:', err.message);
                throw new UnauthorizedException('Error al procesar el token de autorización.');
            }
        }
    }
}
