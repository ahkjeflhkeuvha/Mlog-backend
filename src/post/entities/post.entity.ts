import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Content } from '../../content/entities/content.entity';

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

  @OneToOne(() => Content, content => content.post, { eager: true })
  content: Content;

  // board_id : ManyToOne

  // user_id : ManyToOne
  @ManyToOne(() => User, user => user.posts, { eager: true })
  user: User;

  @OneToMany(() => Comment, comment => comment.post, { eager: true })
  comments: Comment[];
}
