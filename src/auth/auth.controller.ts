import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import {Request, Response} from 'express';
import { Req } from '@nestjs/common';
import { AuthInterceptor } from 'src/auth.interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  // @Get('register')
  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Passwords do not match');
    }

    body.password = await bcrypt.hash(body.password, 12);
    return this.authService.create(body);

    // const hashed = await bcrypt.hash(body.password, 12);
    // return this.authService.create({
    //   first_name: body.first_name,
    //   last_name: body.last_name,
    //   email: body.email,
    //   password: hashed,
    // });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Email does not exist.');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  @UseInterceptors(AuthInterceptor) // hides the password defined in user.entity.ts
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verifyAsync(cookie);
    return await this.authService.findOneBy({ id: data['id'] });

    // return {
    // cookie
    // data
    // };
    // "data": {
    //     "id": 1,
    //     "iat": 1629234084,
    //     "exp": 1629320484
    // }
  }

  @UseInterceptors(AuthInterceptor)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'Success',
    };
  }
}
