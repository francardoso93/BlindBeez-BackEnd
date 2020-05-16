import { Company } from '../companies/company.entity';
import { IsNotEmptyObject, IsNotEmpty, IsDateString, IsNumberString, IsNumber } from 'class-validator';

export class NewScheduleDto {
    @IsNotEmptyObject()
    company: Company;

    @IsNotEmpty()
    @IsDateString()
    initialDate: Date;

    @IsNotEmpty()
    @IsDateString()
    finalDate: Date;

    @IsNotEmpty()
    minuteInterval: string;
}