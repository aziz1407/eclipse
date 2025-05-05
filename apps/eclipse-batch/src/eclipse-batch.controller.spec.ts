import { Test, TestingModule } from '@nestjs/testing';
import { EclipseBatchController } from './eclipse-batch.controller';
import { EclipseBatchService } from './eclipse-batch.service';

describe('EclipseBatchController', () => {
  let eclipseBatchController: EclipseBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EclipseBatchController],
      providers: [EclipseBatchService],
    }).compile();

    eclipseBatchController = app.get<EclipseBatchController>(EclipseBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(eclipseBatchController.getHello()).toBe('Hello World!');
    });
  });
});
