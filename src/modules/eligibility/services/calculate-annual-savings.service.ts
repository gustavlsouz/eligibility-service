import { Injectable } from '@nestjs/common';
import { co2KgPerKwh } from '../../../crosscut/constants';

@Injectable()
export class CalculateAnnualSavings {
  execute(consumptionHistory: number[]): number {
    const totalConsumptionKwh = consumptionHistory
      .slice(0, 12)
      .reduce((total, current) => total + current);

    const fixedTotalConsumption = +(totalConsumptionKwh * co2KgPerKwh).toFixed(
      2,
    );
    return fixedTotalConsumption;
  }
}
