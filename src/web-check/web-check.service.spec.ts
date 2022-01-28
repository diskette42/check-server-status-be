import { Test, TestingModule } from '@nestjs/testing';
import { WebCheckService } from './web-check.service';

describe('WebCheckService', () => {
  let service: WebCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebCheckService],
    }).compile();

    service = module.get<WebCheckService>(WebCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
