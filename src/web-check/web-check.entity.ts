import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class WebCheck {
  @PrimaryColumn()
  id: string;

  @Column()
  owner: string;

  @Column()
  webName: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  date: Date;

  @Column()
  status: boolean;
}
