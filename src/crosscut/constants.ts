export const co2KgPerKwh = 0.084;

export const cpf = {
  type: 'string',
  pattern: '^\\d{11}$',
};

export const cnpj = {
  type: 'string',
  pattern: '^\\d{14}$',
};

export enum ConnectionType {
  SinglePhase = 'monofasico',
  TwoPhase = 'bifasico',
  ThreePhase = 'trifasico',
}

export const ConnectionTypes = Object.values(ConnectionType);

export enum IneligibleReasons {
  UnacceptableConsumptionClass = 'Classe de consumo não aceita',
  UnacceptableModality = 'Modalidade tarifária não aceita',
  ConsumptionAverageUnderMinimum = 'Consumo muito baixo para tipo de conexão',
  SubclassUnacceptable = 'Sub classe inelegível',
}

export enum ConsumerClass {
  Residential = 'residencial',
  Industrial = 'industrial',
  Commercial = 'comercial',
  Rural = 'rural',
  PublicPower = 'poderPublico',
}

export enum ConsumerSubclass {
  condominiumAdministration = 'administracaoCondominial',
  ruralAgriculture = 'agropecuariaRural',
  lowIncome = 'baixaRenda',
  commercial = 'comercial',
  industrial = 'industrial',
  statePublicPower = 'poderPublicoEstadual',
  municipalPublicPower = 'poderPublicoMunicipal',
  residential = 'residencial',
  telecommunicationsServices = 'servicosDeTelecomunicacao',
  transportationServices = 'servicosDeTransporte',
  religiousTemples = 'templosReligiosos',
}

export const SubclassesDeConsumos = Object.values(ConsumerSubclass);

export const ConsumerClasses = Object.values(ConsumerClass);

export enum TariffModality {
  Blue = 'azul',
  White = 'branca',
  Green = 'verde',
  Conventional = 'convencional',
}

export const TariffModalities = Object.values(TariffModality);
