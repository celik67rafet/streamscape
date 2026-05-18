import { Test, TestingModule } from '@nestjs/testing';
import { EncodingServiceController } from './encoding-service.controller';
import { EncodingServiceService } from './encoding-service.service';

describe('EncodingServiceController', () => {
  let encodingServiceController: EncodingServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EncodingServiceController],
      providers: [EncodingServiceService],
    }).compile();

    encodingServiceController = app.get<EncodingServiceController>(EncodingServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(encodingServiceController.getHello()).toBe('Hello World!');
    });
  });
});
