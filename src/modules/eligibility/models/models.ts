import {
  ConnectionType,
  ConsumerClass,
  ConsumerSubclass,
  TariffModality,
} from '../../../crosscut/constants';

export class ClientData {
  numeroDoDocumento: string;
  tipoDeConexao: ConnectionType;
  classeDeConsumo: ConsumerClass;
  subclasseDeConsumo: ConsumerSubclass;
  modalidadeTarifaria: TariffModality;
  historicoDeConsumo: number[];
}

export class EligibilityResponse {
  private elegivel: boolean;
  private economiaAnualDeCO2?: number;
  private razoesDeInelegibilidade?: string[];
  constructor() {
    this.elegivel = true;
  }

  isEligible() {
    return this.elegivel;
  }

  reasons(): string[] {
    return this.razoesDeInelegibilidade;
  }

  annualSavings(): number {
    return this.economiaAnualDeCO2;
  }

  appendIneligibleReason(ineligibleReason: string): EligibilityResponse {
    this.elegivel = false;
    this.economiaAnualDeCO2 = undefined;
    if (!this.razoesDeInelegibilidade) {
      this.razoesDeInelegibilidade = [];
    }
    this.razoesDeInelegibilidade.push(ineligibleReason);
    return this;
  }

  concatIneligibleReasons(eligibilityResponse: EligibilityResponse) {
    eligibilityResponse?.razoesDeInelegibilidade?.forEach((reason) => {
      this.appendIneligibleReason(reason);
    });
  }

  setAnnualSavings(savings?: number) {
    if (this.elegivel) {
      this.economiaAnualDeCO2 = savings;
    }
  }
}
