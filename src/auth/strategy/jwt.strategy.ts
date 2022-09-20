import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { //jwt es el nombre de la strategy
    constructor(config: ConfigService, private prisma: PrismaService){ //config no puede tener private porque entonces no podriamos usar el this
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, //se puede omitir, por default es false
            secretOrKey: config.get('JWT_SECRET'),
        });

    }

    //transforma el token en un objeto, para ver el payload es en la página de jwt
    async validate(payload: {sub: number; email: string}){
        //console.log({payload,});
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });
        delete user.hash;
        return payload //al regresar payload(json) se va a hacer append del payload al user object del request
    }
}