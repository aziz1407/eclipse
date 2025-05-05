import { Controller, Get } from '@nestjs/common';
import { EclipseBatchService } from './eclipse-batch.service';

@Controller()
export class EclipseBatchController {
  constructor(private readonly eclipseBatchService: EclipseBatchService) {}

  @Get()
  getHello(): string {
    return this.eclipseBatchService.getHello();
  }
}
