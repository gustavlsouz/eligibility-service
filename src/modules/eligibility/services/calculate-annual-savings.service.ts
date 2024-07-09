import { Injectable } from '@nestjs/common';
import { co2KgPerKwh } from '../../../crosscut/constants';

@Injectable()
export class CalculateAnnualSavings {
  execute(consumptionHistory: number[]): number {
    const totalConsumptionKwh = consumptionHistory.reduce(
      (total, current) => total + current,
    );

    const avarage = totalConsumptionKwh / consumptionHistory.length;

    const projectedValue = avarage * 12;

    const fixedTotalConsumption = +(projectedValue * co2KgPerKwh).toFixed(2);
    return fixedTotalConsumption;
  }
}
