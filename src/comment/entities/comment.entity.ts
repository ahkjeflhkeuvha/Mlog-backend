import { Post } from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post' })
  post: Post;

  @Column()
  user_id: number;

  @Column()
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Comment = null;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];
}
