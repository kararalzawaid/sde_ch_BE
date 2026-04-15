import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  // you send this to the user to reset their password via sms or email as hashed token
  // i won't implement it in this assessment
  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordRecoveryHash?: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordRecoveryExpires?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
