// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PermissionsGuard } from './guards/permissions.guard'; // <<-- Importa tu PermissionsGuard

@Module({
  providers: [PermissionsGuard], // <<-- Declara PermissionsGuard como un proveedor aquí
  exports: [PermissionsGuard],   // <<-- Exporta PermissionsGuard para que otros módulos puedan usarlo
})
export class AuthModule {}