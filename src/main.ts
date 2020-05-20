import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const fs = require('fs');
  const certFile = fs.readFileSync(process.env.CERT_FILE_PATH ? process.env.CERT_FILE_PATH : '/home/francisco/ssl/localhost.crt');
  const keyFile = fs.readFileSync(process.env.KEY_FILE_PATH ? process.env.KEY_FILE_PATH : '/home/francisco/ssl/localhost.key');

  const app = await NestFactory.create(AppModule,
    {
      httpsOptions: {
        key: keyFile,
        cert: certFile,
      },
    },
  );

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
