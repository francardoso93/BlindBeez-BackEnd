import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ClientSchedulerDto } from './client-scheduler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Exclusion } from 'typeorm';
import { Client } from '../admin-domain/clients/client.entity';
import { Schedule } from '../admin-domain/schedule/schedule.entity';

@Injectable()
export class ClientSchedulerService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
    ) { }

    public async save(clientScheduler: ClientSchedulerDto): Promise<ClientSchedulerDto> {
        // TODO: Transacionar?
        try {
            let client: Client = await this.clientRepository.findOne({
                where: [
                    {
                        email: clientScheduler.email,
                    },
                ],
            });

            if (!client) {
                client = {
                    id: 0,
                    name: clientScheduler.name,
                    email: clientScheduler.email,
                    phone: clientScheduler.phone,
                    // company: {
                    //     id: clientScheduler.companyId,
                    // },
                };
                client = await this.clientRepository.save(client);
            }

            let schedule: Schedule = await this.scheduleRepository.findOne(clientScheduler.scheduleId);
            if (schedule) {
                schedule.reserved = true;
                schedule.client = client;
                //TODO: schedule.massotherapist = // sort
                schedule = await this.scheduleRepository.save(schedule);
                if (schedule.reserved === false || schedule.client == null) {
                    throw new InternalServerErrorException('A reserva de horário não foi realizada corretamente');
                }

            } else {
                throw new NotFoundException("Não foi possivel localizar a agenda informada")
            }

            return clientScheduler;
        } catch (ex) {
            console.error(ex);
            throw ex;
        }
    }
}
