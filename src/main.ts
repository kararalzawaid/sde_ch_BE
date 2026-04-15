import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ValidationPipe,
  BadRequestException,
  ValidationError
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: { target: false, value: false },
      exceptionFactory: (errors: ValidationError[] = []) =>
        new BadRequestException(errors)
    })
  );

  const config = new DocumentBuilder()
    .setTitle('SDE Backend Service')
    .setDescription('SDE Backend Service')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  const port = process.env.SERVER_PORT || 4000;
  await app.listen(port);
  console.log(`🚀 App is running on http://localhost:${port}`);
  console.log(`📘 Swagger UI: http://localhost:${port}/api`);

  // this part is for handling the request that already in the server process when the cluster being stop, or the server
  // so we insure that the  all the request is being fulfilled before close the service or shut down the pod
  // i would use the built in enableShutdownHooks from the nest package but it has a warning that i don't understand
  // https://docs.nestjs.com/fundamentals/lifecycle-events
  let isShuttingDown = false;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`${signal} received. Shutting down gracefully...`);

    try {
      await app.close();
      console.log('App closed successfully');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap();
