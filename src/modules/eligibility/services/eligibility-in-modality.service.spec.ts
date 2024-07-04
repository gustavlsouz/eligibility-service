import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityInModality } from './eligibility-in-modality.service';
import { ClientData, EligibilityResponse } from '../models/models';
import {
  ConnectionType,
  ConsumerClass,
  IneligibleReasons,
  TariffModality,
} from '../../../crosscut/constants';
import { Metadata } from '../../../crosscut/metadata';

describe('EligibilityInModality', () => {
  let service: EligibilityInModality;
  let clientData: ClientData;
  let metadata: Metadata;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EligibilityInModality],
    }).compile();

    service = module.get<EligibilityInModality>(EligibilityInModality);

    clientData = {
      numeroDoDocumento: '14041737706',
      tipoDeConexao: ConnectionType.TwoPhase,
      classeDeConsumo: ConsumerClass.Commercial,
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

  it('should return an ineligible response for unacceptable modalities', () => {
    const unacceptableModalities = [TariffModality.Blue, TariffModality.Green];

    unacceptableModalities.forEach((modality) => {
      clientData.modalidadeTarifaria = modality;
      const result: EligibilityResponse = service.execute(clientData, metadata);
      expect(result.isEligible()).toBeFalsy();
      expect(result.reasons()[0]).toBe(IneligibleReasons.UnacceptableModality);
      expect(result.annualSavings()).toBeUndefined();
    });
  });

  it('should return an eligible response for acceptable modalities', () => {
    const unacceptableModalities = [
      TariffModality.Conventional,
      TariffModality.White,
    ];

    unacceptableModalities.forEach((modality) => {
      clientData.modalidadeTarifaria = modality;
      const result: EligibilityResponse = service.execute(clientData, metadata);
      expect(result.isEligible()).toBeTruthy();
      expect(result.reasons()).toBeUndefined();
      expect(result.annualSavings()).toBeUndefined();
    });
  });
});
