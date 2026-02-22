import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('API Gateway running on http://localhost:3000');
  console.log('CORS enabled for frontend ports: 3001, 3002, 3003');
}
bootstrap();
