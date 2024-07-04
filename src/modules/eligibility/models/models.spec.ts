import { IneligibleReasons } from '../../../crosscut/constants';
import { EligibilityResponse } from './models';

describe('EligibilityResponse', () => {
  let eligibilityResponse: EligibilityResponse;

  beforeEach(() => {
    eligibilityResponse = new EligibilityResponse();
  });

  it('should be ineligible because has reasons appended in the object', () => {
    expect(eligibilityResponse.isEligible()).toBeTruthy();
    eligibilityResponse.appendIneligibleReason(
      IneligibleReasons.ConsumptionAverageUnderMinimum,
    );
    expect(eligibilityResponse.isEligible()).toBeFalsy();
    expect(eligibilityResponse.reasons()[0]).toBe(
      IneligibleReasons.ConsumptionAverageUnderMinimum,
    );
  });

  it('should not accept saving co2 info when is ineligible', () => {
    eligibilityResponse.appendIneligibleReason(
      IneligibleReasons.ConsumptionAverageUnderMinimum,
    );
    eligibilityResponse.setAnnualSavings(1000);
    expect(eligibilityResponse.annualSavings()).toBeUndefined();
  });

  it('should concat reasons', () => {
    eligibilityResponse.appendIneligibleReason(
      IneligibleReasons.ConsumptionAverageUnderMinimum,
    );
    eligibilityResponse.concatIneligibleReasons(
      new EligibilityResponse().appendIneligibleReason(
        IneligibleReasons.UnacceptableModality,
      ),
    );
    expect(eligibilityResponse.reasons()[0]).toBe(
      IneligibleReasons.ConsumptionAverageUnderMinimum,
    );
    expect(eligibilityResponse.reasons()[1]).toBe(
      IneligibleReasons.UnacceptableModality,
    );
  });

  it('should set annual savings when it is eligible', () => {
    eligibilityResponse.setAnnualSavings(1000);
    expect(eligibilityResponse.annualSavings()).toBe(1000);
    expect(eligibilityResponse.isEligible()).toBeTruthy();
  });
});
