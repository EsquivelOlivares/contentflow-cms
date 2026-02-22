import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  body: string;

  @Column('simple-json', { nullable: true })
  metadata: {
    description?: string;
    keywords?: string[];
  };

  @Column({ default: 'draft' })
  status: 'draft' | 'published' | 'archived';

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column()
  createdById: string;

  @Column({ nullable: true })
  updatedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
