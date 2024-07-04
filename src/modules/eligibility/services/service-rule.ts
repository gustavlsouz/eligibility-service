import { Metadata } from '../../../crosscut/metadata';
import { ClientData, EligibilityResponse } from '../models/models';

export interface ServiceRule {
  execute(clientData: ClientData, metadata: Metadata): EligibilityResponse;
}
