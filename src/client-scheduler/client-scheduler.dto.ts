import { IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class ClientSchedulerDto {
    @IsNotEmpty()
    scheduleId: string; // Id da schedule

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsNumber()
    companyId: number;
}
