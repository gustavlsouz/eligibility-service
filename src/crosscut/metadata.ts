import { v4 as uuidv4, validate } from 'uuid';

export class Metadata {
  // pode ser inclusos dados de usuário, tenant se fizer sentido
  private readonly traceId?: string;
  constructor(traceId?: string) {
    if (!validate(traceId)) {
      this.traceId = uuidv4();
      return;
    }
    this.traceId = traceId;
  }
}
