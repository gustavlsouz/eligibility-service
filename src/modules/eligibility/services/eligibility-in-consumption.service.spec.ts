import { Test, TestingModule } from '@nestjs/testing';
import { ClientData, EligibilityResponse } from '../models/models';
import {
  ConnectionType,
  ConsumerClass,
  IneligibleReasons,
  ConsumerSubclass,
  TariffModality,
} from '../../../crosscut/constants';
import { EligibilityInConsumption } from './eligibility-in-consumption.service';
import { Metadata } from '../../../crosscut/metadata';

describe('EligibilityInConsumption', () => {
  let service: EligibilityInConsumption;
  let clientData: ClientData;
  let metadata: Metadata;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EligibilityInConsumption],
    }).compile();

    service = module.get<EligibilityInConsumption>(EligibilityInConsumption);

    clientData = {
      numeroDoDocumento: '14041737706',
      tipoDeConexao: ConnectionType.TwoPhase,
      classeDeConsumo: ConsumerClass.Commercial,
      subclasseDeConsumo: ConsumerSubclass.commercial,
      modalidadeTarifaria: TariffModality.Conventional,
      historicoDeConsumo: [
        3878, // mes atual
        9760, // mes anterior
        5976, // 2 meses atras
        2797, // 3 meses atras
        2481, // 4 meses atras
        5731, // 5 meses atras
        7538, // 6 meses atras
        4392, // 7 meses atras
        7859, // 8 meses atras
        4160, // 9 meses atras
        6941, // 10 meses atras
        4597, // 11 meses atras
      ],
    };

    metadata = new Metadata();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return ineligible because the average consumption is under the minimum for connection type', () => {
    const consumptions = [
      { value: 350, connectionType: ConnectionType.SinglePhase },
      { value: 450, connectionType: ConnectionType.TwoPhase },
      { value: 700, connectionType: ConnectionType.ThreePhase },
    ];

    consumptions.forEach((consumption) => {
      const history = new Array(12);
      history.fill(consumption.value);
      clientData.historicoDeConsumo = history;
      clientData.tipoDeConexao = consumption.connectionType;

      const result: EligibilityResponse = service.execute(clientData, metadata);

      expect(result.isEligible()).toBeFalsy();
      expect(result.annualSavings()).toBeUndefined();
      expect(result.reasons()[0]).toBe(
        IneligibleReasons.ConsumptionAverageUnderMinimum,
      );
    });
  });

  it('should return eligible because the average consumption is equal or more than the minimum for connection type', () => {
    const consumptions = [
      { value: 400, connectionType: ConnectionType.SinglePhase },
      { value: 500, connectionType: ConnectionType.TwoPhase },
      { value: 751, connectionType: ConnectionType.ThreePhase },
    ];

    consumptions.forEach((consumption) => {
      const history = new Array(12);
      history.fill(consumption.value);
      clientData.historicoDeConsumo = history;
      clientData.tipoDeConexao = consumption.connectionType;

      const result: EligibilityResponse = service.execute(clientData, metadata);

      expect(result.isEligible()).toBeTruthy();
      expect(result.annualSavings()).toBeUndefined();
      expect(result.reasons()).toBeUndefined();
    });
  });
});
