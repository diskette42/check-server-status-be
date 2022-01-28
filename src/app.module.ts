import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebCheck } from './web-check/web-check.entity';
import { WebCheckModule } from './web-check/web-check.module';

@Module({
  imports: [
    WebCheckModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'diskette42',
      database: 'WebCheck',
      entities: [WebCheck],
      synchronize: true,
      logging: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
