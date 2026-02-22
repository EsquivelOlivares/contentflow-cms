import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'test' })
  handleTest(data: any) {
    console.log('Mensaje recibido:', data);
    return {
      received: data,
      timestamp: new Date().toISOString(),
      message: 'Hola desde Content Service',
    };
  }
}
