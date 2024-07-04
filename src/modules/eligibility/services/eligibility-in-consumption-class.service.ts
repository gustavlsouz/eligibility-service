import { Injectable } from '@nestjs/common';
import { ClientData, EligibilityResponse } from '../models/models';
import { ConsumerClass, IneligibleReasons } from '../../../crosscut/constants';
import { Metadata } from '../../../crosscut/metadata';
import { logger } from '../../../crosscut/logger';

@Injectable()
export class EligibilityInConsumptionClass {
  execute(clientData: ClientData, metadata: Metadata): EligibilityResponse {
    logger.info({
      message: 'Analysing eligibility based on consumption class',
      metadata,
    });
    const eligibleInConsumptionClass = [
      ConsumerClass.Residential,
      ConsumerClass.Industrial,
      ConsumerClass.Commercial,
    ].includes(clientData.classeDeConsumo);

    const eligibilityResponse = new EligibilityResponse();

    if (!eligibleInConsumptionClass) {
      return eligibilityResponse.appendIneligibleReason(
        IneligibleReasons.UnacceptableConsumptionClass,
      );
    }

    return eligibilityResponse;
  }
}
