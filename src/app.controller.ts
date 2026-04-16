import { Controller, Get } from '@nestjs/common';
import { Public } from '@security/decorators/public.decorator';

@Controller()
export class AppController {

  @Get("health")
  @Public()
  async healthCheck() {

    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}