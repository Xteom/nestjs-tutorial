import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto{
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @Optional()
    description?: string;

    @IsString()
    @IsOptional()
    link: string;
}