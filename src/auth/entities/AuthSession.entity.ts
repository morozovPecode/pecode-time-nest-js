import type { UUID } from 'node:crypto';
import { User } from 'src/users/entities';
import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

@Entity({ name: 'auth_sessions' })
export class AuthSession {
  @PrimaryColumn({ type: 'uuid' })
  id: UUID;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  refresh_hash: string;
}
