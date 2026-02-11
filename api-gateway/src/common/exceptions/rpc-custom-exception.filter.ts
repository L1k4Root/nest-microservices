import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): void {
    const httpResoponse = host.switchToHttp().getResponse();
    const errorResponse = exception.getError();

    if (exception.toString().includes('Empty response')) {
      return httpResoponse.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error: Empty response from microservice',
      });
    }




    if (
      typeof errorResponse === 'object' &&
      'code' in errorResponse &&
      'message' in errorResponse
    ) {
      const { code, message } = errorResponse as any;
      httpResoponse.status(code).json({
        statusCode: code,
        message: "Hola",
      });
    }
  }
}
