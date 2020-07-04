import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository, DeleteResult, Like, Raw, Between, getConnection } from 'typeorm';
import { NewScheduleDto } from './new-schedule.dto';
import moment = require('moment');
import { ScheduleDto } from './schedule.dto';
import { Moment } from 'moment';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly companiesService: CompaniesService,
  ) { }

  public async BulkCreateAvailableSchedules(newSchedule: NewScheduleDto) {
    await this.deleteExitingSchedulesForTheInformedPeriod(newSchedule);

    //   await this.scheduleRepository.remove({
    //     reserved: true,
    //   });

    const company = await this.companiesService.get(newSchedule.company?.id?.toString());
    if (!company) {
      throw new BadRequestException('CompanyId is not registered, please register company before schedule');
    }

    const startDate = new Date(newSchedule.initialDate);
    let currentMoment = new Date(newSchedule.initialDate);
    const endDate = new Date(newSchedule.finalDate);

    while (currentMoment < endDate) { //Day Increment
      while (this.getTime(moment.utc(currentMoment)) < this.getTime(moment.utc(endDate))) { //Minute Increment        
        const schedule: Schedule = {
          id: 0,
          company: newSchedule.company,
          datetime: currentMoment,
          reserved: false,
        };
        this.save(schedule);
        currentMoment = moment(currentMoment)
          .add(newSchedule.minuteInterval, 'minutes')
          .utc().utcOffset('-03:00').toDate();
      }
      currentMoment = moment(currentMoment)
        .add(1, 'days')
        .hours(startDate.getHours())
        .minutes(startDate.getMinutes())
        .utc().utcOffset('-03:00').toDate();
    }
  }

  private async deleteExitingSchedulesForTheInformedPeriod(newScheduleDto: NewScheduleDto) {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Schedule)
      .where("datetime >= :initialDate", { initialDate: newScheduleDto.initialDate})
      .execute();
  }

  public getTime(dateTime: Moment): Moment {
    return moment({ h: dateTime.hours(), m: dateTime.minutes() });
  }

  public async save(schedule: Schedule): Promise<Schedule> {
    //TODO: Proteção para não criar agendas duplicadas: 
    //https://stackoverflow.com/questions/46745688/typeorm-upsert-create-if-not-exist 
    // OU deletar todos os existentes (sem reserva) nesse periodo e substituir pelos novos. Alinhar com o Fê sobre essa funcionalidade
    return await this.scheduleRepository.save(schedule);
  }

  public async list(
    onlyAvailableTime: boolean,
    date: string,
    companyId: string,
  ): Promise<ScheduleDto[]> {

    const scheduleDtoList: ScheduleDto[] = [];

    const whereCondition: any = {};
    if (onlyAvailableTime) {
      whereCondition.reserved = false;
    }
    if (date) {
      whereCondition.datetime = Between(
        moment(date, ['DD/MM/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD') + 'T00:00:00',
        moment(date, ['DD/MM/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD') + 'T23:59:59');
    }
    if (companyId) {
      whereCondition.company = {
        id: companyId,
      };
    }
    const scheduleList = await this.scheduleRepository.find(
      {
        join: { alias: 'schedule', leftJoin: { client: 'schedule.client' } },
        where: [whereCondition],
        order: {
          datetime: 'ASC',
        },
      });

    scheduleList.map(a => {
      scheduleDtoList.push({
        id: a.id,
        company: a.company,
        date: a.date = moment(a.datetime).utc().utcOffset('-03:00').format('YYYY-MM-DD'),
        time: a.time = moment(a.datetime).utc().utcOffset('-03:00').format('HH:mm:ss'),
        reserved: a.reserved,
        client: a.client,
        massotherapist: a.massotherapist,
      });

    });

    return scheduleDtoList;
  }

  public async get(id: string): Promise<Schedule> {
    return await this.scheduleRepository.findOne(id);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.scheduleRepository.delete(id);
  }

  public async update(id: string, schedule: Schedule): Promise<Schedule> {
    const existingSchedule = await this.get(id);
    existingSchedule.client = schedule.client;
    existingSchedule.company = schedule.company;
    existingSchedule.datetime = schedule.datetime;
    existingSchedule.massotherapist = schedule.massotherapist;
    existingSchedule.reserved = schedule.reserved;
    return await this.save(existingSchedule);
  }
}
