// src/modules/mailer/mailer.module.ts
import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service.js';

@Global()
@Module({
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}
