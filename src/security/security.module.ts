import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from '@security/entities/refresh-token.entity';

import { SecurityService } from '@security/security.service';

import { SecurityController } from '@security/security.controller';
import { UsersModule } from '@users/users.modules';

import securityConfig from '@security/config/security.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: securityConfig.secret,
      signOptions: { expiresIn: securityConfig.jwtTokenExpiration }
    })
  ],
  providers: [SecurityService],
  controllers: [SecurityController],
  exports: [SecurityService]
})
export class SecurityModule {}
