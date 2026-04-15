import { Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
  logMessageCreatedReceived(event): void {
    console.log(`[event-received] message.created -> body=${event}}`);
  }
}
