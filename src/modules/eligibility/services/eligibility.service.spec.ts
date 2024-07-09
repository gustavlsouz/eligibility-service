import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityService } from './eligibility.service';
import { Validator } from '../../../crosscut/validator';
import { EligibilityInConsumptionClass } from './eligibility-in-consumption-class.service';
import { EligibilityInConsumption } from './eligibility-in-consumption.service';
import { EligibilityInModality } from './eligibility-in-modality.service';
import { CalculateAnnualSavings } from './calculate-annual-savings.service';
import { logger } from '../../../crosscut/logger';
import { ClientData, EligibilityResponse } from '../models/models';
import { Metadata } from '../../../crosscut/metadata';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IneligibleReasons } from '../../../crosscut/constants';
import { mocks } from '../../../../test/mocks';
import { EligibilityInConsumptionSubclass } from './eligibility-in-consumption-subclass.service';

describe('EligibilityService', () => {
  let eligibilityService: EligibilityService;
  // let validator: Validator<ClientData>;
  // let eligibilityInConsumptionClass: EligibilityInConsumptionClass;
  // let eligibilityInConsumption: EligibilityInConsumption;
  // let eligibilityInModality: EligibilityInModality;
  // let calculateAnnualSavings: CalculateAnnualSavings;
  const ValidatorMock = { validate: jest.fn() };
  const EligibilityInConsumptionClassMock = { execute: jest.fn() };
  const EligibilityInConsumptionMock = { execute: jest.fn() };
  const EligibilityInModalityMock = { execute: jest.fn() };
  const CalculateAnnualSavingsMock = { execute: jest.fn() };
  const EligibilityInConsumptionSubclassMock = { execute: jest.fn() };
  let metadata: Metadata;

  beforeEach(async () => {
    // jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EligibilityService,
        {
          provide: Validator,
          useValue: ValidatorMock,
        },
        {
          provide: EligibilityInConsumptionClass,
          useValue: EligibilityInConsumptionClassMock,
        },
        {
          provide: EligibilityInConsumption,
          useValue: EligibilityInConsumptionMock,
        },
        {
          provide: EligibilityInModality,
          useValue: EligibilityInModalityMock,
        },
        {
          provide: CalculateAnnualSavings,
          useValue: CalculateAnnualSavingsMock,
        },
        {
          provide: EligibilityInConsumptionSubclass,
          useValue: EligibilityInConsumptionSubclassMock,
        },
      ],
    }).compile();

    eligibilityService = module.get<EligibilityService>(EligibilityService);
    // validator = module.get<Validator<ClientData>>(Validator);
    // eligibilityInConsumptionClass = module.get<EligibilityInConsumptionClass>(
    //   EligibilityInConsumptionClass,
    // );
    // eligibilityInConsumption = module.get<EligibilityInConsumption>(
    //   EligibilityInConsumption,
    // );
    // eligibilityInModality = module.get<EligibilityInModality>(
    //   EligibilityInModality,
    // );
    // calculateAnnualSavings = module.get<CalculateAnnualSavings>(
    //   CalculateAnnualSavings,
    // );

    jest.spyOn(logger, 'info').mockImplementation(jest.fn());

    metadata = new Metadata();
  });

  it('should be defined', () => {
    expect(eligibilityService).toBeDefined();
  });

  it('should throw an exception if client data is invalid', () => {
    ValidatorMock.validate.mockReturnValue(false);

    expect(() => {
      eligibilityService.execute({} as ClientData, {} as Metadata);
    }).toThrow(
      new HttpException(
        'A entrada de dados está diferente do esquema necessário',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return all ineligible reasons', () => {
    ValidatorMock.validate.mockReturnValue(true);
    EligibilityInConsumptionClassMock.execute.mockReturnValue(
      new EligibilityResponse().appendIneligibleReason(
        IneligibleReasons.UnacceptableConsumptionClass,
      ),
    );
    EligibilityInConsumptionMock.execute.mockReturnValue(
      new EligibilityResponse().appendIneligibleReason(
        IneligibleReasons.ConsumptionAverageUnderMinimum,
      ),
    );
    EligibilityInModalityMock.execute.mockReturnValue(
      new EligibilityResponse().appendIneligibleReason(
        IneligibleReasons.UnacceptableModality,
      ),
    );
    EligibilityInConsumptionSubclassMock.execute.mockReturnValue(
      new EligibilityResponse().appendIneligibleReason(
        IneligibleReasons.SubclassUnacceptable,
      ),
    );

    const response = eligibilityService.execute(
      mocks.ineligibleInAllCriterias.input as ClientData,
      metadata,
    );

    const reasons = Object.values(IneligibleReasons);

    expect(response).toBeDefined();
    expect(response.annualSavings()).toBeUndefined();
    expect(response.isEligible()).toBeFalsy();
    reasons.forEach((reason: string) => {
      expect(response.reasons().includes(reason)).toBeTruthy();
    });
  });

  it('should return eligible response because it is in the rules criterias', () => {
    ValidatorMock.validate.mockReturnValue(true);
    EligibilityInConsumptionClassMock.execute.mockReturnValue(
      new EligibilityResponse(),
    );
    EligibilityInConsumptionMock.execute.mockReturnValue(
      new EligibilityResponse(),
    );
    EligibilityInModalityMock.execute.mockReturnValue(
      new EligibilityResponse(),
    );
    EligibilityInConsumptionSubclassMock.execute.mockReturnValue(
      new EligibilityResponse(),
    );
    CalculateAnnualSavingsMock.execute.mockReturnValue(
      mocks.eligibleMock.output.economiaAnualDeCO2,
    );

    const response = eligibilityService.execute(
      mocks.eligibleMock.input as ClientData,
      metadata,
    );

    expect(response.isEligible()).toBeTruthy();
    expect(response.annualSavings()).toBe(
      mocks.eligibleMock.output.economiaAnualDeCO2,
    );
    expect(response.reasons()).toBeUndefined();
  });
});
