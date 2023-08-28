import {ApiProperty} from "@nestjs/swagger";
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RoundDTO {
    start: Date | null = null;
    @ApiProperty({type: Date, default: "YYYY-MM-DDTHH:mm:ss.sssZ", required: true})
    @Type(() => Date)
    @IsDate()
    end: Date | null = null;
    initialPrice: number | null = null;
    currentPrice: number | null = null;
    status: boolean = false;
}