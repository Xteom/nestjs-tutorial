import { Optional } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";

export class EditBookmarkDto{
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @Optional()
    description?: string;

    @IsString()
    @IsOptional()
    link?: string;
}