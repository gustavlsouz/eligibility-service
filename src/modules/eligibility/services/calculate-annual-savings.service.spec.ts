import { Test, TestingModule } from '@nestjs/testing';
import { ClientData } from '../models/models';
import {
  ConnectionType,
  ConsumerClass,
  TariffModality,
} from '../../../crosscut/constants';
import { CalculateAnnualSavings } from './calculate-annual-savings.service';

describe('CalculateAnnualSavings', () => {
  let service: CalculateAnnualSavings;
  let clientData: ClientData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculateAnnualSavings],
    }).compile();

    service = module.get<CalculateAnnualSavings>(CalculateAnnualSavings);

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return ineligible because the consumption class is not acceptable', () => {
    const result = service.execute(clientData.historicoDeConsumo);
    expect(result).toBe(5553.24);
  });
});
