import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from './middleware/guards/auth.guard';

@Module({
  providers: [JwtService, JwtAuthGuard],
  exports: [JwtService, JwtAuthGuard],

})
export class JwtModule { }
