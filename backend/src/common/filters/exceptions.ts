import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const timestamp = new Date().toISOString();
    const path = request.url;

    if (typeof message === 'string') message = { message };

    switch (status) {
      case HttpStatus.CONFLICT:
        message = {
          statusCode: status,
          error: 'Conflict',
          message: message.message || 'Resource conflict occurred',
          path,
          method: request.method,
          timestamp,
        };
        break;
      case HttpStatus.NOT_FOUND:
        message = {
          statusCode: status,
          error: 'Not Found',
          message: message.message || 'The requested resource was not found',
          path,
          method: request.method,
          timestamp,
        };
        break;

      case HttpStatus.BAD_REQUEST:
        message = {
          statusCode: status,
          error: 'Bad Request',
          message: message.message || 'Invalid request',
          details: message.message || null,
          path,
          method: request.method,
          timestamp,
        };
        break;

      case HttpStatus.UNAUTHORIZED:
        message = {
          statusCode: status,
          error: 'Unauthorized',
          message: message.message || 'Authentication required',
          path,
          method: request.method,
          timestamp,
        };
        break;

      case HttpStatus.FORBIDDEN:
        message = {
          statusCode: status,
          error: 'Forbidden',
          message: message.message || 'Access denied',
          path,
          method: request.method,
          timestamp,
        };
        break;

      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        message = {
          statusCode: status,
          error: 'Internal Server Error',
          message: message.message || 'An unexpected error occurred',
          path,
          method: request.method,
          timestamp,
        };
        break;
    }

    response.status(status).json(message);
  }
}
