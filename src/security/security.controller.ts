import { Body, Controller, Post } from '@nestjs/common';

import { LoginUserDto } from '@security/dto/login-user.dto';
import { RefreshTokenDto } from '@security/dto/refresh-token.dto';
// import { VerifyUserDto } from '@security/dto/verify-user.dto';
import { SecurityService } from '@security/security.service';

import { Public } from '@security/decorators/public.decorator';

@Controller('auth')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.securityService.login(loginUserDto);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.securityService.refreshWithToken(refreshTokenDto);
  }

  // these are not needed to be defined as route, they are called internally
  // @TODO: remove this when the refresh token is implemented
  // it just easier to test my flow rn
  // @Public()
  // @Post('verify')
  // async verify(@Body() verifyUserDto: VerifyUserDto): Promise<{ accessToken: string }> {
  //   return this.securityService.verify(verifyUserDto);
  // }
}
