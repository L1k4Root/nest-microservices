import { Catch, ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) : void {
    const httpResoponse = host.switchToHttp().getResponse();
    const errorResponse = exception.getError();
    if (
      typeof errorResponse === 'object' &&
      'code' in  errorResponse &&
      'message' in errorResponse
    ) {
      const { code, message } = errorResponse as any;
      httpResoponse.status(code).json({
        statusCode: code,
        message,
      });
    }
  }
}