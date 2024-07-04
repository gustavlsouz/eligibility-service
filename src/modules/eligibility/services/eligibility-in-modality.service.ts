import { Injectable } from '@nestjs/common';
import { ClientData, EligibilityResponse } from '../models/models';
import { IneligibleReasons, TariffModality } from '../../../crosscut/constants';
import { Metadata } from '../../../crosscut/metadata';
import { logger } from '../../../crosscut/logger';

@Injectable()
export class EligibilityInModality {
  execute(clientData: ClientData, metadata: Metadata): EligibilityResponse {
    logger.info({
      message: 'Analysing eligibility based on modality',
      metadata,
    });
    const eligibilityResponse = new EligibilityResponse();

    const eligibleInModality = [
      TariffModality.Conventional,
      TariffModality.White,
    ].includes(clientData.modalidadeTarifaria);

    if (!eligibleInModality) {
      return eligibilityResponse.appendIneligibleReason(
        IneligibleReasons.UnacceptableModality,
      );
    }

    return eligibilityResponse;
  }
}
