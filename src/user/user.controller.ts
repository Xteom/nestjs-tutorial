import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
//import { AuthGuard } from '@nestjs/passport';
//import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator'
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)//al mover los guards aquí quiere decir que todo lo que hagamos con los contraladores requiere guard
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    //@UseGuards(AuthGuard('jwt'))
    //@UseGuards(JwtGuard)//como ya tenemos la clase que lo hace, ya no hay que llamar al constructor 
    @Get('me')//sin argumentos agarra todas la recuests que tengan user 
    //ahorita va a agarrar los que lleguen como /users/
    //si le metemos ruta va a agarrar los que lleguen en /users/ruta/
    //getMe(@Req() req: Request){
    //getMe(@GetUser() user: User, @GetUser('email') email: string){ //ya tenemos el decorator para esto, hace el código más limpio
    getMe(@GetUser() user: User){
        //console.log({user: req.user});
        return user;
    }

    @Patch()
    editUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto,
    ) {
        return this.userService.editUser(userId, dto);
    }
}
