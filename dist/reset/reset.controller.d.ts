import { MailerService } from '@nestjs-modules/mailer';
import { ResetService } from './reset.service';
export declare class ResetController {
    private resetService;
    private mailService;
    constructor(resetService: ResetService, mailService: MailerService);
    forgot(email: string): Promise<{
        message: string;
    }>;
}
