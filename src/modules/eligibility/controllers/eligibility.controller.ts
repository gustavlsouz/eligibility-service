import { Body, Controller, Headers, Post } from '@nestjs/common';
import { EligibilityService } from '../services/eligibility.service';
import { ClientData, EligibilityResponse } from '../models/models';
import { Metadata } from '../../../crosscut/metadata';

@Controller('/api/eligibility')
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Post('/validation')
  validateEligibility(
    @Body() clientData: ClientData,
    @Headers('x-trace-id') traceId?: string,
  ): EligibilityResponse {
    const metadata = new Metadata(traceId);
    return this.eligibilityService.execute(clientData, metadata);
  }
}
