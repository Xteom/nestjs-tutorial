import { ForbiddenException, Injectable, PayloadTooLargeException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2' //hash de pass 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService{
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService,
        ){ }
    
    //async porque es fucion asyncrona ¿por como llama a prisma?
    async signup(dto: AuthDto) {
        // genera el hash del pass
        const hash = await argon.hash(dto.password);
        try{
            //guarda el nuevo usuario en db 
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }, 
                /**
                forma de solo devolver esos datos y no el hash   
                select: {
                    id: true, 
                    email: true,
                    createdAt: true,
                }
                */
            });
            //borra el hash tons ya no lo puede regresar 
            //delete user.hash
            //regresa el usuario guardado   
            return this.signToken(user.id, user.email);
        } catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002') {//error de prisma usuario duplicado
                    throw new ForbiddenException(
                        'Credentials taken', 
                    )
                }
            }
            throw error; //si no viene de prisma lo tiramos así
        }
        
    }
    
    async signin(dto: AuthDto) {
        // encuetra el correo 
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        //si no existe exception 
        if(!user)
            throw new ForbiddenException(
                'No existe el usuario'
            );
        
        //si existe, checa pass             recibe el hash y la pass normal/plain text 
        const pwMatches = await argon.verify(
            user.hash,
            dto.password
        );        
        //pass incorrecta throw exception 
        if (!pwMatches)
            throw new ForbiddenException(
                'Contraseña incorrecta'
            );
        //pass correcta regresa usuario 
        // delete user.hash; //no queremos regresar el hash 
        return this.signToken(user.id, user.email);
        //return {msg: 'i have signin'};
    }


 
    async signToken( 
        userId: number, 
        email: string,
    ): Promise<{ access_token: string }>{ //promise es el return type
          const payload = {
            sub: userId, 
            email, 
        };
    
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
                expiresIn: '15m',
                secret: secret,
            });
        
        return {access_token: token};
        
        /**
        return this.jwt.signAsync(payLoad, {
            expiresIn: '15m', //la sesión dura por 15 minutos, despues tiene que volver a iniciar sesion
            secret: secret
        })
        */
        
    }

}

