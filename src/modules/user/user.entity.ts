import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Report } from '../report/report.entity';

export enum EURole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
}

export enum EUStatus {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
  BANNED = 'BANNED',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: EUStatus, default: EUStatus.ACTIVE })
  status: EUStatus;

  @Column({ enum: EURole, default: [EURole.USER] })
  roles: EURole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
