import { Module } from '@nestjs/common';
import { ZendeskController } from './zendesk.controller';
import { ZendeskService } from './zendesk.service';

@Module({
  controllers: [ZendeskController],
  providers: [ZendeskService],
})
export class ZendeskModule {}

