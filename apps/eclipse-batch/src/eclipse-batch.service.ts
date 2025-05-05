import { Injectable } from '@nestjs/common';

@Injectable()
export class EclipseBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}
