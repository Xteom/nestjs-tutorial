import { Global, Module } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Global() /** con esto ya no tenemos que estar importando en cada documento, ahora todos lo pueden usar sin importarlo 
pero igual hay que agregarlo a los modulos de app.module */
@Module({
  providers: [PrismaService],
  exports: [PrismaService] /**ahora puede exportar el servicio a otros modulos */
})
export class PrismaModule {}
