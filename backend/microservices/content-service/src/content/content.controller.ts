import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @MessagePattern({ cmd: 'create_content' })
  create(@Payload() data: CreateContentDto) {
    return this.contentService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_content' })
  findAll() {
    return this.contentService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_content' })
  findOne(@Payload() id: string) {
    return this.contentService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_content' })
  update(@Payload() data: { id: string; dto: UpdateContentDto }) {
    return this.contentService.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'remove_content' })
  async remove(@Payload() id: string) {
    await this.contentService.remove(id);
    return { success: true, message: 'Contenido eliminado' };
  }

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
