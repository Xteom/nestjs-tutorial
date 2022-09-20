import { Injectable } from '@nestjs/common';
import { first } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async editUser(userId: number, dto: EditUserDto){
        const user = await this.prisma.user.update({
            where: {
                id: userId,
                email: dto.email
            }, 
            data: {
                firstName: dto.firstName, //restructure the dto
                //Object.assign({}, dto) es lo mismo que esto, crea una copia y lo guarda
            },
        });

        delete user.hash;

        return user;
    }
}
