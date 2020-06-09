import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @ManyToOne(() => Company, company => company.clients)
    company?: Company;

    @OneToMany(() => Schedule, schedule => schedule.client)
    schedules?: Schedule[];

}
