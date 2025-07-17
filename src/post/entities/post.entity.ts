import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  thumbnail_url: string;

  @Column()
  is_uploaded: boolean;

  @Column()
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  // board_id : ManyToOne

  // user_id : ManyToOne
}
