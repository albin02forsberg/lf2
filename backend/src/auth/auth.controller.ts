import { Controller, Post, Body, UnauthorizedException, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() body) {
    // NOTE: In a real-world app, you'd want to add validation here
    const { email, password } = body;
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    const user = await this.usersService.create(email, password);
    return this.authService.login(user);
  }

  @Post('login')
  async login(@Body() body) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validateToken(@Request() req) {
    return { valid: true, user: req.user };
  }
}
