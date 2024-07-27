import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
