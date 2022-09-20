import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
//import { url } from 'inspector';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService){
        super({ //llama al constructor de la clase que se extiende
            datasources:{
                db:{
                    url: config.get('DATABASE_URL')
                    //url: 'postgresql://postgres:123@localhost:5434/nest?schema=public'
                }
            }
        });
        //console.log(config.get('DATABASE_URL'));
    }

    cleanDb(){ //va a borrar primero los bookmarks y luego los users
        //hay que ponerlo en arreglo para que primsa no vaya a borrar primero los usuarios
        return this.$transaction([this.bookmark.deleteMany(), this.user.deleteMany()]); 
    }
}
