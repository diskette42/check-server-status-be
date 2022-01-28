import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebCheckController } from './web-check.controller';
import { WebCheck } from './web-check.entity';
import { WebCheckRepository } from './web-check.repository';
import { WebCheckService } from './web-check.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([WebCheckRepository]),
  ],
  controllers: [WebCheckController],
  providers: [WebCheckService],
})
export class WebCheckModule {}
