import { IsString, IsOptional, IsIn, IsObject, MinLength } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  body: string;

  @IsObject()
  @IsOptional()
  metadata?: {
    description?: string;
    keywords?: string[];
  };

  @IsIn(['draft', 'published', 'archived'])
  @IsOptional()
  status?: 'draft' | 'published' | 'archived';

  @IsString()
  createdById: string;
}
