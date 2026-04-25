import { NestFactory } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [process.env.FRONTEND_URL || 'http://localhost:3000'];

  app.enableCors({
     origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new ForbiddenException('Origin not allowed by CORS'), false);
        }
      },
     credentials: true,
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
     preflightContinue: false,
     optionsSuccessStatus: 204,
   });

  // Health check endpoint — used by Docker and load balancer probes
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
