import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientSchedulerModule } from './client-scheduler/client-scheduler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AdminDomainModule } from './admin-domain/admin-domain.module';
import { ContactModule } from './contact/contact.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host:  process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    username: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'postgres',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'admin',
    database: process.env.DB_DATABASE_NAME ? process.env.DB_DATABASE_NAME : 'blindbeez',
    port: 5432,
    entities: [__dirname + '/../**/**.entity.js'],
    synchronize: true,
  }), ClientSchedulerModule, AdminDomainModule, ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
