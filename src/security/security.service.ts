import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { randomBytes } from 'crypto';

import { LoginUserDto } from '@security/dto/login-user.dto';
import { RefreshTokenDto } from '@security/dto/refresh-token.dto';
import { VerifyUserDto } from '@security/dto/verify-user.dto';

import { UsersService } from '@users/users.service';

import securityConfig from '@security/config/security.config';

import { RefreshToken } from '@security/entities/refresh-token.entity';

@Injectable()
export class SecurityService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService
  ) { }

  async login(
    loginUserDto: LoginUserDto
  ): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.validateUser(email, password);

    const accessToken = await this.jwtService.signAsync({ id: user.id });

    const refreshToken = await this.findOrCreateRefreshToken(user.id);

    return { accessToken, refreshToken, userId: user.id };
  }

  private async findOrCreateRefreshToken(userId: string): Promise<string> {
    const existingValid = await this.refreshTokenRepository.findOne({
      where: {
        userId,
        expiresAt: MoreThan(new Date())
      }
    });

    if (existingValid) {
      return existingValid.token;
    }

    const refreshToken = randomBytes(48).toString('base64url');
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + securityConfig.refreshTokenExpiration
    );

    await this.refreshTokenRepository.upsert(
      { userId, token: refreshToken, expiresAt },
      ['userId']
    );

    return refreshToken;
  }

  async refreshWithToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refreshToken }
    });

    if (!refreshToken || refreshToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const accessToken = await this.jwtService.signAsync({
      id: refreshToken.userId
    });

    const newRefreshToken = randomBytes(48).toString('base64url');
    refreshToken.token = newRefreshToken;
    const expiresAt = new Date();

    expiresAt.setSeconds(
      expiresAt.getSeconds() + securityConfig.refreshTokenExpiration
    );

    refreshToken.expiresAt = expiresAt;
    await this.refreshTokenRepository.save(refreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async verify(verifyUserDto: VerifyUserDto): Promise<{ id: string }> {
    const { token } = verifyUserDto;

    try {
      const decoded = await this.jwtService.verifyAsync(token);

      return decoded;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
