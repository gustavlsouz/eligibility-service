import { Module } from '@nestjs/common';
import { EligibilityController } from './controllers/eligibility.controller';
import { EligibilityService } from './services/eligibility.service';
import { Validator } from '../../crosscut/validator';
import { EligibilityInConsumptionClass } from './services/eligibility-in-consumption-class.service';
import { EligibilityInConsumption } from './services/eligibility-in-consumption.service';
import { EligibilityInModality } from './services/eligibility-in-modality.service';
import { CalculateAnnualSavings } from './services/calculate-annual-savings.service';
import { clientDataValidator } from './validators/validators';

@Module({
  imports: [],
  controllers: [EligibilityController],
  providers: [
    EligibilityService,
    EligibilityInConsumptionClass,
    EligibilityInConsumption,
    EligibilityInModality,
    CalculateAnnualSavings,
    {
      provide: Validator,
      useFactory() {
        return new Validator(clientDataValidator);
      },
    },
  ],
})
export class EligibilityModule {}
