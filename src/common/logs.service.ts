import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogsService {
  private readonly logger = new Logger();

  logMessageCreatedReceived(event): void {
    this.logger.log(`[event-received] message.created -> body=${event}}`);
  }
}
