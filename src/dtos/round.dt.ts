import {ApiProperty} from "@nestjs/swagger";
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RoundDTO {
    start: Date | null = null;
    @ApiProperty({type: Date, default: "YYYY-MM-DDTHH:mm:ss.sssZ", required: true})
    @Type(() => Date)
    @IsDate()
    end: Date | null = null;
    @ApiProperty({default: "0", required: false})
    initialPrice: number | null = null;
    currentPrice: number | null = null;
    @ApiProperty({default: 600000, required: false})
    interval: number = 600000;
    status: boolean = false;
    @ApiProperty({default: 0, required: false})
    id: number = 0;
    @ApiProperty({default: true, required: false})
    restart: boolean = true;
}