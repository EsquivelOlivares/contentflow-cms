import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ActivityService } from '../activity/activity.service';
import slugify from 'slugify';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private activityService: ActivityService,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const slug = createContentDto.slug || this.generateSlug(createContentDto.title);
    
    const contentData = {
      title: createContentDto.title,
      body: createContentDto.body,
      slug: slug,
      status: createContentDto.status || 'draft',
      metadata: createContentDto.metadata || {},
      createdById: createContentDto.createdById,
      updatedById: createContentDto.createdById,
    };

    const content = this.contentRepository.create(contentData);
    const savedContent = await this.contentRepository.save(content);

    // Registrar actividad con nombre de usuario
    // Idealmente esto vendría del token JWT, pero por ahora usamos un nombre fijo
    // En un sistema real, el nombre vendría del user service
    await this.activityService.logActivity({
      action: 'created',
      entityType: 'content',
      entityId: savedContent.id,
      entityTitle: savedContent.title,
      userId: createContentDto.createdById,
      userName: 'Victoria', // Aquí debería venir del token
    });

    return savedContent;
  }

  async findAll(): Promise<Content[]> {
    return this.contentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException(`Contenido con ID ${id} no encontrado`);
    }

    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOne(id);

    if (updateContentDto.title) {
      content.title = updateContentDto.title;
      content.slug = this.generateSlug(updateContentDto.title);
    }

    if (updateContentDto.body) {
      content.body = updateContentDto.body;
    }

    if (updateContentDto.status) {
      content.status = updateContentDto.status;
    }

    if (updateContentDto.metadata) {
      content.metadata = updateContentDto.metadata;
    }

    if (updateContentDto.updatedById) {
      content.updatedById = updateContentDto.updatedById;
    }

    const updatedContent = await this.contentRepository.save(content);

    // Registrar actividad con nombre de usuario
    await this.activityService.logActivity({
      action: updateContentDto.status === 'published' ? 'published' : 'updated',
      entityType: 'content',
      entityId: updatedContent.id,
      entityTitle: updatedContent.title,
      userId: updateContentDto.updatedById || 'unknown',
      userName: 'Victoria', // Aquí debería venir del token
    });

    return updatedContent;
  }

  async remove(id: string): Promise<void> {
    const content = await this.findOne(id);
    await this.contentRepository.remove(content);

    // Registrar actividad
    await this.activityService.logActivity({
      action: 'deleted',
      entityType: 'content',
      entityId: id,
      entityTitle: content.title,
      userId: 'system',
      userName: 'Victoria', // Cuando elimina un usuario, debería ser su nombre
    });
  }

  private generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
      locale: 'es',
    });
  }
}
