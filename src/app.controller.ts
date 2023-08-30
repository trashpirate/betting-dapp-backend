import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import {TokenPriceDTO} from './dtos/tokenPrice.dto';
import {RoundDTO} from './dtos/round.dt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-info')
  async getTokenInfo() : Promise<TokenPriceDTO> {
    return this.appService.getTokenInfo();
  }
  
  @Get('token-price')
  async getTokenPrice() : Promise<number> {
    return this.appService.getTokenPrice();
  }

  @Get('get-round')
  getCurrentRound() : RoundDTO {
    return this.appService.getCurrentRound();
  }

  @Post('set-round')
  setRound(@Body() newRound: RoundDTO): Promise<any> {
    return this.appService.setRound(newRound);
  }

  // @Post('set-initial-price')
  // setInitialPrice(@Body() initialPrice: number): Promise<any> {
  //   return this.appService.setInitialPrice(initialPrice);
  // }

  @Post('end-round')
  stopCurrentRound(): any {
    return this.appService.stopCurrentRound();
  }

}
