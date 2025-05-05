import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({ transport: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventsGateway');// bu terminda chiqib turadigan yozuv SocketEventsGateway
  private summaryClient: number = 0;

  public afterInit(server: Server) { /// afterInit() — bu function WebSocket server ishga tushgan zahoti avtomatik ishga tushadi. 
    this.logger.log(`WebSocket Server Initialized total: ${this.summaryClient}`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.summaryClient++;
    this.logger.log(`== Client connected total: ${this.summaryClient} ==`);
  }

  handleDisconnect(client: WebSocket) {
    this.summaryClient--;
    this.logger.log(`== Client disconnected left total: ${this.summaryClient} ==`)
  }

  @SubscribeMessage('message')// buyerda message degan xabardan boshqasini qabul qilmaydi
  public handleMessage(client: WebSocket, payload: any): string {
    return 'Hello world!';
  }
}
 