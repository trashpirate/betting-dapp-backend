import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  

  // app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('PetLFG Betting DAPP')
    .setDescription('API for PetLFG Betting DApp')
    .setVersion('1.0')
    .addTag('petlfg')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // await app.listen(3001);
}
bootstrap();