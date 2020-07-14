import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import moment = require("moment");

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value) {
      var date = moment(value, "YYYY-MM-DDTHH:mm:SS", true);
      if (!date.isValid()) {
        throw new BadRequestException(
          "Invalid date format for " +
            value +
            ". It should be formated as YYYY-MM-DDTHH:mm:SS"
        );
      }
      return value;
    }
  }
}
