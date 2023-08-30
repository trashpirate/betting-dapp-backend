import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TokenPriceDTO } from './dtos/tokenPrice.dto';
import { RoundDTO } from './dtos/round.dt';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import 'dotenv/config';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AppService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  private currentRound = new RoundDTO();

  private bettingStartSubject = new Subject<boolean>();
  private bettingEndSubject = new Subject<boolean>();

  test(): string {
    return 'API running';
  }

  triggerBettingStart(data: boolean) {
    this.bettingStartSubject.next(data);
  }

  triggerBettingEnd(data: boolean) {
    this.bettingEndSubject.next(data);
  }

  onBettingStart(): Observable<boolean> {
    return this.bettingStartSubject.asObservable();
  }

  onBettingEnd(): Observable<boolean> {
    return this.bettingEndSubject.asObservable();
  }
  
  async setRound(round: RoundDTO): Promise<any> {
    try {
      const tokenPrice = await this.getTokenPrice();
      if (round.initialPrice == 0){
          round.initialPrice = tokenPrice;
      }
      round.currentPrice = tokenPrice;
      round.start = new Date(Date.now());
      round.status = true;
      this.currentRound = round;
      this.registerEndTime(round.end);
      this.triggerBettingStart(round.status);
      return tokenPrice == null
        ? { success: false }
        : { success: true, round: this.currentRound };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  }

  registerEndTime(stopTime: Date) {
    let jobEnd: CronJob = new CronJob(stopTime, () => {
      this.currentRound.status = false;
      console.log('Ended current round!');
    });
    const jobs = this.schedulerRegistry.getCronJobs();
    if (jobs.size > 0) {
      this.schedulerRegistry.deleteCronJob('endRound');
    }

    this.schedulerRegistry.addCronJob('endRound', jobEnd);
    jobEnd.start();   

  }

  getCurrentRound(): RoundDTO {
    // console.log(this.currentRound);
    return this.currentRound;
  }

  stopCurrentRound() {
    this.currentRound.status = false;
    this.currentRound.initialPrice = null;
    this.triggerBettingEnd(true);
    try {
      const job = this.schedulerRegistry.getCronJob('endRound');
      job.stop();
      return { success: true, job: job.running };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  }

  getRoundStatus() {
    console.log(this.currentRound.status);
    return this.currentRound.status;
  }

  async getCurrentResult() {
    const tokenPrice: number = await this.getTokenPrice();
    this.currentRound.currentPrice = tokenPrice;
    if (this.currentRound.status) {
      return {
        currentPrice: tokenPrice,
        initialPrice: this.currentRound.initialPrice,
      };
    }
    return { currentPrice: tokenPrice, initialPrice: null };
  }

  setCurrentResult(tokenPrice: number): RoundDTO {
    this.currentRound.currentPrice = tokenPrice;
    return this.currentRound;
  }

  async getTokenInfo(): Promise<TokenPriceDTO> {
    try {
      const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY, // Replace with your CoinMarketCap API key
            ['Content-Type']: 'application/json',
          },
          params: {
            id: 26073, // Change to the token symbol you want
          },
        },
      );

      // success
      const json = response.data.data['26073'];
      const id = json.id;
      const name = json.name;
      const symbol = json.symbol;
      const price = json.quote.USD.price;

      const tokenPrice: TokenPriceDTO = { id, name, symbol, price };
      return tokenPrice;
    } catch (ex) {
      // error
      console.log(ex);
      return null;
    }
  }

  async getTokenPrice(): Promise<number> {
    try {
      const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
        {
          headers: {
            'X-CMC_PRO_API_KEY': 'c72fc6fd-dae6-4a41-8cfa-c0d9068b158b', // Replace with your CoinMarketCap API key
            ['Content-Type']: 'application/json',
          },
          params: {
            id: 26073, // Change to the token symbol you want
          },
        },
      );

      // success
      const json = response.data.data['26073'];
      const price = json.quote.USD.price;

      return price;
    } catch (ex) {
      // error
      console.log(ex);
      return null;
    }
  }
}
