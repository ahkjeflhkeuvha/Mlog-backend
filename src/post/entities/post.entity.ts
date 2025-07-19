import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
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
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  user: User;
}
