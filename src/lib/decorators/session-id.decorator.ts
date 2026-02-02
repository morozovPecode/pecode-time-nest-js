import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionId = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user?.session_id;
  },
);
