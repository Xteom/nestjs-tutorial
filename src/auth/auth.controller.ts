import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
/**el controlador recibe una petición de internet y se la da a service */

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    //@HttpCode(HttpStatus.OK) //regresa el status de http pero por default  post ya regresa 201 (ok)
    @Post('signup')
    signup(@Body() dto: AuthDto) { /**al haber hecho el folder dto ahora con el dto: AuthDto se importan todos los dtos del folder sin importarlos uno por uno */
        console.log(dto); //console.log muestra estado en terminal
        return this.authService.signup(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}
