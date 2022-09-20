import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if(data){
        return request.user[data];
    }
    return request.user;
  },
);

/**
 * al ponerle el string | undefined al data lo hacemos opcioal entonces si le metemos argumento nos va a regresar el atriburto que le pedimos 
 * si no le metemos el atributo en el argumento entonces va a hacer lo que hacía antes y regresa el usuario 
 */