import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { v4 as uuid } from 'uuid';
// import { Connection, getConnection, getRepository, Repository } from 'typeorm';
import { AllWebDataDto, DeleteDataDto, WebDataDto } from './dto/web-check.dto';
import { WebCheck } from './web-check.entity';
import { WebCheckRepository } from './web-check.repository';
import { StatusResponse } from './dto/response/status-response.dto';

@Injectable()
export class WebCheckService {
  constructor(
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(WebCheckRepository)
    private webCheckRepository: WebCheckRepository,
  ) {}

  // private cronJobByDay(name: string) {
  //   const job = new CronJob(CronExpression.EVERY_30_SECONDS, () => {
  //     console.log(`time for job ${name} to run everyday at midnight!`);
  //     this.addCronJob('cronjobBy5seconds', '5');
  //   });

  //   this.schedulerRegistry.addCronJob(name, job);
  //   job.start();
  //   console.log('start');

  //   console.log(`job ${name} added per day`);
  // }
  async addWeb(webDataDto: WebDataDto): Promise<WebCheck> {
    const { webName, owner } = webDataDto;
    console.log(this.schedulerRegistry.doesExists('cron', webName + owner));
    if (!this.schedulerRegistry.doesExists('cron', webName + owner)) {
      this.addCronJob(webDataDto);
      return this.requestToWebServer(webDataDto);
    }
  }

  async addCronJob(webDataDto: WebDataDto): Promise<any> {
    const { webName, owner } = webDataDto;
    const cronjobName = webName + owner;

    const job = new CronJob(CronExpression.EVERY_30_MINUTES, () => {
      return this.requestToWebServer(webDataDto);
      // console.log(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(cronjobName, job);
    job.start();
    console.log('start');
    // console.log(+ this.schedulerRegistry.doesExists('cron', cronjobName));

    console.log(`job ${cronjobName} added `);
    console.log(this.schedulerRegistry.doesExists('cron', cronjobName));
  }

  async requestToWebServer(webDataDto: WebDataDto): Promise<WebCheck> {
    // console.log(webDataDto.webURL, webDataDto.webName);
    const { webURL, webName, owner } = webDataDto;
    try {
      const res = await this.httpService.get(webURL).toPromise();
      // console.log(res.data);
      const webCheck = new WebCheck();
      if (res.status !== 200) {
        // Object.assign({ webName: webName, status: false }, webCheck);
        // this.webCheckRepository.save(webCheck);
        console.log('not ok');
        webCheck.id = uuid();
        webCheck.owner = owner;
        webCheck.webName = webName;
        webCheck.status = false;
        // Object.assign({ webName: webName, status: false }, webCheck);
        console.log(webCheck);
        this.webCheckRepository.save(webCheck);
        return webCheck;
      }
      console.log('ok');
      webCheck.id = uuid();
      webCheck.owner = owner;
      webCheck.webName = webName;
      webCheck.status = true;
      // Object.assign({ webName: webName, status: false }, webCheck);
      console.log(webCheck);
      this.webCheckRepository.save(webCheck);
      return webCheck;
    } catch (err) {
      if (err) {
        const webCheck = new WebCheck();
        console.log('not ok');
        webCheck.id = uuid();
        webCheck.owner = owner;
        webCheck.webName = webName;
        webCheck.status = false;
        // Object.assign({ webName: webName, status: false }, webCheck);
        console.log(webCheck);
        this.webCheckRepository.save(webCheck);
        return webCheck;
      }
    }
    // console.log(res.status);
    // return webCheck;

    // return JSON.parse(JSON.stringify({ status: res.status, data: res.data }));
  }

  async deleteCron(cronjobName: string): Promise<void> {
    await this.schedulerRegistry.deleteCronJob(cronjobName);
    console.log(`job ${cronjobName} deleted!`);
  }

  async deleteDataByName(deleteDataDto: DeleteDataDto): Promise<any> {
    const { webName, owner } = deleteDataDto;
    console.log(webName, owner);
    const cronjobName = webName + owner;
    console.log(cronjobName);
    try {
      if (this.schedulerRegistry.doesExists('cron', cronjobName)) {
        await this.deleteCron(cronjobName);
        console.log('delete');
      }
      const findByNameAndOwner = await this.webCheckRepository.query(`
      delete from web_check where "webName" = '${webName}' and "owner" ='${owner}'
    `);
      return findByNameAndOwner;
    } catch (err) {
      throw new NotFoundException(`incorrect`);
    }
  }

  async getAllDataByOwner(owner: string): Promise<AllWebDataDto[]> {
    const findAll = await this.webCheckRepository.query(
      `select "webName" from public.web_check  where "owner" = '${owner}' group by "webName" `,
    );
    const allData = [];
    for (let i = 0; i < findAll.length; i++) {
      const webName = findAll[i].webName;
      const data = await this.getDataByOwner(owner, webName);
      console.log({ data, webName });
      const obj = {
        name: webName,
        data: data,
      };
      allData.push(obj);
    }
    return allData;
  }

  async getDataByOwner(
    ownerName: string,
    webName: string,
  ): Promise<StatusResponse[]> {
    const findErrorByname = await this.webCheckRepository.query(
      `
      select DATE("date") as day,"webName","status","owner" from public.web_check where "webName"='${webName}' and "owner"='${ownerName}' group by "webName","day","status","owner" order by day
      `,
    );
    console.log(findErrorByname);
    const findStatus = [];
    for (let i = 0; i < findErrorByname.length; i++) {
      // console.log(findErrorByname[i].day);
      // console.log(i, findErrorByname[i].day, findErrorByname[i].status);
      if (i == 0) {
        // console.log('index 0');
        if (findErrorByname[i].status == false) {
          // console.log(i - 1, i, false);
          const obj = {
            owner: findErrorByname[i].owner,
            name: findErrorByname[i].webName,
            date: findErrorByname[i].day,
            status: false,
          };
          findStatus.push(obj);
        } else {
          // console.log(i - 1, i, false);
          const obj = {
            owner: findErrorByname[i].owner,
            name: findErrorByname[i].webName,
            date: findErrorByname[i].day,
            status: true,
          };
          findStatus.push(obj);
        }
      } else {
        if (findErrorByname[i].status == false) {
          // console.log(i - 1, i, false);
          const obj = {
            owner: findErrorByname[i].owner,
            name: findErrorByname[i].webName,
            date: findErrorByname[i].day,
            status: false,
          };
          findStatus.push(obj);
        } else if (
          findErrorByname[i].status == true &&
          findErrorByname[i - 1].day.valueOf() !=
            findErrorByname[i].day.valueOf()
        ) {
          // console.log(i - 1, i, true);
          const obj = {
            owner: findErrorByname[i].owner,
            name: findErrorByname[i].webName,
            date: findErrorByname[i].day,
            status: true,
          };
          findStatus.push(obj);
        }
      }
    }
    return findStatus;
  }
}
