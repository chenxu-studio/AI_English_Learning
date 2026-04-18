import { Injectable } from '@nestjs/common';

const BUSINESS = {
  SUCESS: {
    code: 200,
    message: 'success',
  },
  ERROR: {
    code: 500,
    message: 'error',
  },
};

@Injectable()
export class ResponseService {
  SUCCESS(data: unknown) {
    return {
      data,
      code: BUSINESS.SUCESS.code,
      message: BUSINESS.SUCESS.message,
    };
  }
  error(
    data: unknown = null,
    message: string,
    code: number = BUSINESS.ERROR.code,
  ) {
    return {
      data,
      code,
      message: message || BUSINESS.ERROR.message,
    };
  }
}
