import { Controller, Get, HttpCode, Post, Body, Put, Param, Delete, Query, ValidationPipe, UsePipes, ParseIntPipe } from '@nestjs/common';
import { Schedule } from './schedule.entity';
import { ScheduleService } from './schedule.service';
import { NewScheduleDto } from './new-schedule.dto';
import { DateValidationPipe } from 'src/date.pipe';

@Controller('schedules')
export class ScheduleController {
    constructor(
        private scheduleService: ScheduleService,
    ) { }

    @Post()
    @UsePipes(ValidationPipe)
    @HttpCode(201)
    async post(@Body() body: NewScheduleDto) {
        await this.scheduleService.BulkCreateAvailableSchedules(body);
    }

    @Get()
    @HttpCode(200)
    async list(@Query('onlyAvailableTime') onlyAvailableTime, @Query('date', DateValidationPipe) date, @Query('companyId') companyId) {
        if(!date && !companyId ) {
            console.log('Date and CompanyId not recieved. This request will return all schedules per days per companies')
        }
        return await this.scheduleService.list(onlyAvailableTime, date, companyId);
    }

    @Get(':id')
    @HttpCode(200)
    async get(@Param() params) {
        return await this.scheduleService.get(params.id);
    }

    @Put(':id')
    @HttpCode(200)
    async put(@Param() params, @Body() body: Schedule) {
        return await this.scheduleService.update(params.id, body);
    }

    @Delete(':id')
    @HttpCode(200)
    async delete(@Param() params) {
        return await this.scheduleService.delete(params.id);
    }
}
