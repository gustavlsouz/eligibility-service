import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientData, EligibilityResponse } from '../models/models';
import { Validator } from '../../../crosscut/validator';
import { EligibilityInConsumptionClass } from './eligibility-in-consumption-class.service';
import { EligibilityInConsumption } from './eligibility-in-consumption.service';
import { EligibilityInModality } from './eligibility-in-modality.service';
import { CalculateAnnualSavings } from './calculate-annual-savings.service';
import { logger } from '../../../crosscut/logger';
import { Metadata } from '../../../crosscut/metadata';
import { ServiceRule } from './service-rule';

@Injectable()
export class EligibilityService {
  private readonly serviceRules: ServiceRule[];
  constructor(
    private readonly validator: Validator<ClientData>,
    private readonly eligibilityInConsumptionClass: EligibilityInConsumptionClass,
    private readonly eligibilityInConsumption: EligibilityInConsumption,
    private readonly eligibilityInModality: EligibilityInModality,
    private readonly calculateAnnualSavings: CalculateAnnualSavings,
  ) {
    this.serviceRules = [
      eligibilityInConsumptionClass,
      eligibilityInConsumption,
      eligibilityInModality,
    ];
  }

  execute(clientData: ClientData, metadata: Metadata): EligibilityResponse {
    logger.info({ clientData, metadata });

    const isValid = this.validator.validate(clientData);
    if (!isValid) {
      throw new HttpException(
        'A entrada de dados está diferente do esquema necessário',
        HttpStatus.BAD_REQUEST,
      );
    }

    const eligibilityResponse = new EligibilityResponse();

    for (const serviceRule of this.serviceRules) {
      const eligibilityResult = serviceRule.execute(clientData, metadata);
      eligibilityResponse.concatIneligibleReasons(eligibilityResult);
    }

    if (!eligibilityResponse.isEligible()) {
      return eligibilityResponse;
    }

    const co2Savings = this.calculateAnnualSavings.execute(
      clientData.historicoDeConsumo,
    );

    eligibilityResponse.setAnnualSavings(co2Savings);

    return eligibilityResponse;
  }
}
