import { Test, TestingModule } from '@nestjs/testing';
import { ClientData, EligibilityResponse } from '../models/models';
import {
  ConnectionType,
  ConsumerClass,
  IneligibleReasons,
  ConsumerSubclass,
  TariffModality,
} from '../../../crosscut/constants';
import { EligibilityInConsumptionClass } from './eligibility-in-consumption-class.service';
import { Metadata } from '../../../crosscut/metadata';

describe('EligibilityInConsumptionClass', () => {
  let service: EligibilityInConsumptionClass;
  let clientData: ClientData;
  let metadata: Metadata;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EligibilityInConsumptionClass],
    }).compile();

    service = module.get<EligibilityInConsumptionClass>(
      EligibilityInConsumptionClass,
    );

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

  it('should return ineligible because the consumption class is not acceptable', () => {
    const consumerClasses = [ConsumerClass.Rural, ConsumerClass.PublicPower];

    consumerClasses.forEach((consumerClass) => {
      clientData.classeDeConsumo = consumerClass;
      const result: EligibilityResponse = service.execute(clientData, metadata);

      expect(result.isEligible()).toBeFalsy();
      expect(result.annualSavings()).toBeUndefined();
      expect(result.reasons()[0]).toBe(
        IneligibleReasons.UnacceptableConsumptionClass,
      );
    });
  });

  it('should return eligible because the consumption class is acceptable', () => {
    const consumerClasses = [
      ConsumerClass.Residential,
      ConsumerClass.Industrial,
      ConsumerClass.Commercial,
    ];

    consumerClasses.forEach((consumerClass) => {
      clientData.classeDeConsumo = consumerClass;
      const result: EligibilityResponse = service.execute(clientData, metadata);

      expect(result.isEligible()).toBeTruthy();
      expect(result.annualSavings()).toBeUndefined();
      expect(result.reasons()).toBeUndefined();
    });
  });
});
