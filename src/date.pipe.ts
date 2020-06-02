import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import moment = require('moment');

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    var date = moment(value, "YYYY-MM-DD", true);
    if (!date.isValid()){
        throw new BadRequestException('Invalid date format for ' + value + '. It should be formated as YYYY-MM-DD');
    }
    return value;
  }
}