import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    unique: true,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  grade: number;

  @Column()
  class: number;

  @Column()
  bio: string;

  @Column()
  profile_img: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
