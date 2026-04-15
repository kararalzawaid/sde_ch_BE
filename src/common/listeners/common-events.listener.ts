import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { LogsService } from '@common/logs.service';

// https://docs.nestjs.com/techniques/events#dispatching-events
// i inspired from this guide to create this listener
@Injectable()
export class CommonEventsListener {
  constructor(private readonly logsService: LogsService) {}

  @OnEvent('message.created')
  handleMessageCreated(event): void {
    this.logsService.logMessageCreatedReceived(event);
  }
}
