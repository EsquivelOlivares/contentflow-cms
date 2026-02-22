import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_register' })
  register(@Payload() data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'auth_login' })
  login(@Payload() data: LoginDto) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'auth_validate' })
  validateUser(@Payload() id: string) {
    return this.authService.validateUser(id);
  }

  @MessagePattern({ cmd: 'test' })
  handleTest(data: any) {
    console.log('Mensaje recibido en auth:', data);
    return {
      received: data,
      timestamp: new Date().toISOString(),
      message: 'Hola desde User Service',
    };
  }
}
