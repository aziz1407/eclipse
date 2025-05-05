import { Module } from '@nestjs/common';
import { EclipseBatchController } from './eclipse-batch.controller';
import { EclipseBatchService } from './eclipse-batch.service';

@Module({
  imports: [],
  controllers: [EclipseBatchController],
  providers: [EclipseBatchService],
})
export class EclipseBatchModule {}
