import { Injectable } from '@nestjs/common';
import { ClientData, EligibilityResponse } from '../models/models';
import { ConnectionType, IneligibleReasons } from '../../../crosscut/constants';
import { logger } from '../../../crosscut/logger';
import { Metadata } from '../../../crosscut/metadata';

@Injectable()
export class EligibilityInConsumption {
  execute(clientData: ClientData, metadata: Metadata): EligibilityResponse {
    logger.info({
      message: 'Analysing eligibility based on consumption',
      metadata,
    });
    const eligibilityResponse = new EligibilityResponse();

    const totalConsumption = clientData.historicoDeConsumo.reduce(
      (total, monthConsumption) => {
        return total + monthConsumption;
      },
      0,
    );

    const consumptionAverage = totalConsumption / 12;

    logger.info({
      message: 'consumption average',
      consumptionAverage,
      metadata,
    });

    const minimumConsumption = this.getMinimumConsumptionByConnectionType(
      clientData.tipoDeConexao,
    );

    if (consumptionAverage < minimumConsumption) {
      return eligibilityResponse.appendIneligibleReason(
        IneligibleReasons.ConsumptionAverageUnderMinimum,
      );
    }

    return eligibilityResponse;
  }

  private getMinimumConsumptionByConnectionType(
    connectionType: ConnectionType,
  ): number {
    switch (connectionType) {
      case ConnectionType.SinglePhase:
        return 400;
      case ConnectionType.TwoPhase:
        return 500;
      case ConnectionType.ThreePhase:
        return 750;
    }
  }
}
