import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';
import { ResetService } from './reset.service';

@Controller()
export class ResetController {
    constructor(
        private resetService: ResetService,
        private mailService: MailerService
        ) {
    }

    @Post('forgot')
    async forgot(@Body('email') email: string) {
        const token = Math.random().toString(20).substr(2, 12);

        await this.resetService.create({
            email,
            token   
        });

        const url = `http://localhost:4200/reset/${token}`;

        await this.mailService.sendMail({
            to: email,
            subject: 'Reset your password',
            html: `Click <a href="${url}">here</a> to reset your password.`
        });

        return {
            message: 'Check your email.'
        };
    }

}
