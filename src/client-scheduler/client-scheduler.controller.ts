import { Controller, Body, Res, Get, Post, HttpCode, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { ClientSchedulerDto } from './client-scheduler.dto';
import { ClientSchedulerService } from './client-scheduler.service';

@Controller('client-scheduler')
export class ClientSchedulerController {
    constructor(
        private clientSchedulerService: ClientSchedulerService
    ) { }

    @Post()
    @UsePipes(ValidationPipe)
    @HttpCode(201)
    async post(@Body() body: ClientSchedulerDto) {
        if (body = await this.clientSchedulerService.save(body)) {
            return body;
        }
    }
}
