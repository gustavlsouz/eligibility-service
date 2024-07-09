import {
  ConsumerClasses,
  cnpj,
  ConnectionTypes,
  cpf,
  IneligibleReasons,
  TariffModalities,
  SubclassesDeConsumos,
} from '../../../crosscut/constants';

const enumOf = (values) => ({
  type: typeof values[0],
  enum: values,
});

export const input = {
  type: 'object',
  additionalProperties: false,
  required: [
    'numeroDoDocumento',
    'tipoDeConexao',
    'classeDeConsumo',
    'modalidadeTarifaria',
    'historicoDeConsumo',
    'subclasseDeConsumo',
  ],
  properties: {
    numeroDoDocumento: { oneOf: [cpf, cnpj] },
    tipoDeConexao: enumOf(ConnectionTypes),
    classeDeConsumo: enumOf(ConsumerClasses),
    subclasseDeConsumo: enumOf(SubclassesDeConsumos),
    modalidadeTarifaria: enumOf(TariffModalities),
    historicoDeConsumo: {
      // em kWh
      type: 'array',
      minItems: 3,
      maxItems: 12,
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 9999,
      },
    },
  },
};

export const output = {
  oneOf: [
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'economiaAnualDeCO2'],
      properties: {
        elegivel: enumOf([true]), // always true
        economiaAnualDeCO2: { type: 'number', minimum: 0 },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'razoesDeInelegibilidade'],
      properties: {
        elegivel: enumOf([false]), // always false
        razoesDeInelegibilidade: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string',
            enum: [
              IneligibleReasons.UnacceptableConsumptionClass,
              IneligibleReasons.UnacceptableModality,
              IneligibleReasons.ConsumptionAverageUnderMinimum,
            ],
          },
        },
      },
    },
  ],
};
