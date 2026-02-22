import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // 'created', 'updated', 'published', 'deleted'

  @Column()
  entityType: string; // 'content'

  @Column()
  entityId: string;

  @Column()
  entityTitle: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  userName: string;

  @CreateDateColumn()
  createdAt: Date;
}
