import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import * as moment from 'moment';
import { Payload } from 'src/interfaces/payload';

@Injectable()
export class JwtService {
  config = {
    auth: { secret: 'authSecret', expiresIn: '10m' },
    refresh: { secret: 'refreshSecret', expiresIn: '1d' },
  };

  generateToken(
    payload: { email: string },
    type: 'refresh' | 'auth' = 'auth',
  ): string {
    console.log(payload, this.config[type].expiresIn);
    return sign(payload, this.config[type].secret, {
      expiresIn: this.config[type].expiresIn,
    });
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = verify(
        refreshToken,
        this.config.refresh.secret,
      ) as Payload;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = (payload.exp - currentTime) / 60;
      if (timeToExpire < 20) {
        return {
          accessToken: this.generateToken({ email: payload.email }),
          refreshToken: this.generateToken({ email: payload.email }, 'refresh'),
          expirationTime: moment().add(10, 'minutes').toDate(),
        };
      }
      return {
        accessToken: this.generateToken({ email: payload.email }),
        expirationTime: moment().add(10, 'minutes').toDate(),
      };
    } catch (error: any) {
      console.error('Error al refrescar el token:', error);
      const err = error as Error;
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token de refresco ha expirado.');
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token de refresco inválido.');
      }
      throw new UnauthorizedException(
        'Error desconocido al refrescar el token.',
      );
    }
  }
  getPayload(token: string, type: 'refresh' | 'auth' = 'auth') {
    try {
      return verify(token, this.config[type].secret) as Payload;
    } catch (error: any) {
      console.error('Error al obtener payload del token:', error);
      const err = error as Error; // <--- ¡CAMBIO CLAVE AQUÍ! Casteamos a Error
      if (err.name === 'TokenExpiredError') {
        // Acceso seguro a .name
        throw new UnauthorizedException('El token ha expirado.');
      } else if (err.name === 'JsonWebTokenError') {
        // Acceso seguro a .name
        throw new UnauthorizedException('Token inválido.');
      }
      throw new UnauthorizedException(
        'Error desconocido al verificar el token.',
      );
    }
  }
}
