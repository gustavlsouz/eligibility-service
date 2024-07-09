import { Injectable } from '@nestjs/common';
import { ClientData, EligibilityResponse } from '../models/models';
import { Metadata } from '../../../crosscut/metadata';
import {
  ConsumerClass,
  IneligibleReasons,
  ConsumerSubclass,
} from '../../../crosscut/constants';
import { logger } from '../../../crosscut/logger';

/**
 * - Comercial
    - Elegíveis
        - Administração Condominial
        - Comercial
        - Serviços de Telecomunicação
- Industrial
    - Elegíveis
        - Industrial
- Residencial
    - Elegíveis
        - Residencial
 */
@Injectable()
export class EligibilityInConsumptionSubclass {
  execute(clientData: ClientData, metadata: Metadata): EligibilityResponse {
    logger.info({ metadata });
    const eligibilityResponse = new EligibilityResponse();
    const eligibleSubclasses = this.getEligibleSubclassByConsumerClass(
      clientData.classeDeConsumo,
    );
    const exists = eligibleSubclasses.some(
      (subclass) => subclass === clientData.subclasseDeConsumo,
    );

    if (!exists) {
      eligibilityResponse.appendIneligibleReason(
        IneligibleReasons.SubclassUnacceptable,
      );
    }
    return eligibilityResponse;
  }

  getEligibleSubclassByConsumerClass(
    consumerClass: ConsumerClass,
  ): ConsumerSubclass[] {
    switch (consumerClass) {
      case ConsumerClass.Commercial:
        return [
          ConsumerSubclass.condominiumAdministration,
          ConsumerSubclass.commercial,
          ConsumerSubclass.telecommunicationsServices,
        ];
      case ConsumerClass.Industrial:
        return [ConsumerSubclass.industrial];
      case ConsumerClass.Residential:
        return [ConsumerSubclass.residential];
      default:
        return [];
    }
  }
}
