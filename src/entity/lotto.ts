import { UUID } from "crypto";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  FindManyOptions,
  Index,
} from "typeorm";

@Entity()
export class Lotto extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ unique: true })
  round: number;

  @Column()
  winNum1: number;

  @Column()
  winNum2: number;

  @Column()
  winNum3: number;

  @Column()
  winNum4: number;

  @Column()
  winNum5: number;

  @Column()
  winNum6: number;

  @Column()
  bonusNum: number;

  static findSorted(options: FindManyOptions<Lotto>): Promise<Lotto[]> {
    return this.find({
      ...options,
      order: { round: "DESC" },
    } as FindManyOptions<Lotto>);
  }
}
