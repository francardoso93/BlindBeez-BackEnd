import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  JoinTable
} from 'typeorm';
import { Massotherapist } from '../massotherapists/massotherapist.entity';
import { Company } from '../companies/company.entity';
import { Client } from '../clients/client.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  datetime?: Date;

  date?: string;
  time?: string;

  @OneToOne(type => Massotherapist)
  @JoinColumn()
  massotherapist?: Massotherapist;

  @ManyToOne(type => Company)
  @JoinColumn()
  company?: Company;

  @ManyToOne(type => Client, client => client.schedules ,{
    eager: true
  })
  @JoinTable()
  client?: Client;

  @Column()
  reserved: boolean;
}
