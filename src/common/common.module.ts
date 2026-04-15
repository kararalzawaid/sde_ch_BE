import { Module } from '@nestjs/common';

import { LogsService } from '@common/logs.service';
import { CommonEventsListener } from '@common/listeners/common-events.listener';

@Module({
  providers: [LogsService, CommonEventsListener]
})
export class CommonModule {}
