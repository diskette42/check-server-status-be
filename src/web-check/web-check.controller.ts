import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DeleteDataDto, WebDataDto } from './dto/web-check.dto';
import { WebCheck } from './web-check.entity';
import { WebCheckService } from './web-check.service';

@Controller('web-check')
export class WebCheckController {
  constructor(
    private webCheckService: WebCheckService,
    private httpService: HttpService,
  ) {}

  @Post('get-data/:owner')
  async getAllData(@Param('owner') owner: string): Promise<any> {
    return this.webCheckService.getAllDataByOwner(owner);
  }

  @Post()
  async addWeb(@Body() webDataDto: WebDataDto): Promise<WebCheck> {
    return this.webCheckService.addWeb(webDataDto);
  }
  @Post('/req')
  async requestToWebServer(@Body() webDataDto: WebDataDto): Promise<WebCheck> {
    return this.webCheckService.requestToWebServer(webDataDto);
  }

  // @Post('data/:owner')
  // async getDataByName(
  //   @Param('owner') ownerName: string,
  // ): Promise<StatusResponse[]> {
  //   return this.webCheckService.getDataByOwner(ownerName);
  // }

  @Post('/deleteCron/:name')
  async deleteCron(@Param('name') name: string): Promise<void> {
    this.webCheckService.deleteCron(name);
  }

  @Post('/delete-data')
  async deleteDataByName(@Body('') deleteDataDto: DeleteDataDto): Promise<any> {
    return this.webCheckService.deleteDataByName(deleteDataDto);
  }
}
