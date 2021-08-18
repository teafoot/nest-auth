import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Body, Controller, forwardRef, Inject, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResetService } from './reset.service';
import * as bcrypt from 'bcrypt';

@Controller()
export class ResetController {
  constructor(
    private resetService: ResetService,
    private mailService: MailerService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  @Post('forgot')
  async forgot(@Body('email') email: string) {
    //// Purposely not returning exception of "user not found", or else actor can check what emails are in our system.
    const user = await this.authService.findOneBy({ email });
    if (user) {
        const token = Math.random().toString(20).substr(2, 12);
        await this.resetService.create({
            email,
            token,
        });

        // Send email
        const url = `http://localhost:4200/reset/${token}`; // angular app route
        await this.mailService.sendMail({
            to: email,
            subject: 'Reset your password',
            html: `Click <a href="${url}">here</a> to reset your password.`,
        });
    }

    return {
      message: 'Check your email.', // always return this response message
    };
  }

  @Post('reset')
  async reset(
    @Body('token') token: string,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
        throw new BadRequestException("Passwords do not match!");
    }

    const reset = await this.resetService.findOne({token});
    const email = reset.email;
    const user = await this.authService.findOneBy({email});
    if (!user) {
        throw new NotFoundException("User not found!");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.authService.update(user.id, {password: hashedPassword});

    return {
        message: "Success"
    };
  }
}
