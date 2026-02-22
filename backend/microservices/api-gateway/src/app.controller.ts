import { Controller, Get, Post, Patch, Delete, Body, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('CONTENT_SERVICE') private contentClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  // Auth endpoints
  @Post('auth/register')
  async register(@Body() registerDto: any) {
    try {
      const result = await firstValueFrom(
        this.userClient.send({ cmd: 'auth_register' }, registerDto)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('auth/login')
  async login(@Body() loginDto: any) {
    try {
      const result = await firstValueFrom(
        this.userClient.send({ cmd: 'auth_login' }, loginDto)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Content endpoints
  @Post('content')
  async createContent(@Body() createContentDto: any) {
    try {
      const result = await firstValueFrom(
        this.contentClient.send({ cmd: 'create_content' }, createContentDto)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('content')
  async findAllContent() {
    try {
      const result = await firstValueFrom(
        this.contentClient.send({ cmd: 'find_all_content' }, {})
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('content/:id')
  async findOneContent(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.contentClient.send({ cmd: 'find_one_content' }, id)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Patch('content/:id')
  async updateContent(@Param('id') id: string, @Body() updateContentDto: any) {
    try {
      const result = await firstValueFrom(
        this.contentClient.send({ cmd: 'update_content' }, { id, dto: updateContentDto })
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Delete('content/:id')
  async removeContent(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.contentClient.send({ cmd: 'remove_content' }, id)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // NUEVO: Activity endpoints
  @Get('activity/recent')
  async getRecentActivity() {
    try {
      const result = await firstValueFrom(
        this.contentClient.send({ cmd: 'get_recent_activity' }, 10)
      );
      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching activity:', error);
      return { success: false, error: error.message };
    }
  }

  // Test endpoints
  @Get('content/test')
  async testContent() {
    try {
      const result = await firstValueFrom(
        this.contentClient.send({ cmd: 'test' }, { message: 'Hola desde gateway' })
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('auth/test')
  async testAuth() {
    try {
      const result = await firstValueFrom(
        this.userClient.send({ cmd: 'test' }, { message: 'Hola desde gateway' })
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
