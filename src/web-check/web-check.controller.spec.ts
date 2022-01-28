import { Test, TestingModule } from '@nestjs/testing';
import { WebCheckController } from './web-check.controller';

describe('WebCheckController', () => {
  let controller: WebCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebCheckController],
    }).compile();

    controller = module.get<WebCheckController>(WebCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
