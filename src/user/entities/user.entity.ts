import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  nickname: string;

  @Column({
    unique: true,
    nullable: false,
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
