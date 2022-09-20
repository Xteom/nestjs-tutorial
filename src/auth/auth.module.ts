import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({})], /** con esto podemos acceder a los providers que estan dentro dl modulo */
    controllers: [AuthController], /**maneja las requests */
    providers: [AuthService, JwtStrategy] /**provee le lógica de negocio (business logic)  pero business logic necesita database*/
})
export class AuthModule{}
