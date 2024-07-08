import { IsOptional } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: true,
  })
  userid: string;
  
  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  @IsOptional()
  password: string;

  @Column({ nullable: true })
  @IsOptional()
  tel: string;

  @Column({ nullable: true })
  @IsOptional()
  address: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  provider: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
