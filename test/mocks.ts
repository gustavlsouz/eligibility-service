export const mocks = {
  eligibleMock: {
    input: {
      numeroDoDocumento: '14041737706',
      tipoDeConexao: 'bifasico',
      classeDeConsumo: 'comercial',
      modalidadeTarifaria: 'convencional',
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
    },
    output: {
      elegivel: true,
      economiaAnualDeCO2: 5553.24,
    },
  },
  ineligibleMock: {
    input: {
      numeroDoDocumento: '14041737706',
      tipoDeConexao: 'bifasico',
      classeDeConsumo: 'rural',
      modalidadeTarifaria: 'verde',
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
      ],
    },
    output: {
      elegivel: false,
      razoesDeInelegibilidade: [
        'Classe de consumo não aceita',
        'Modalidade tarifária não aceita',
      ],
    },
  },
  ineligibleInAllCriterias: {
    input: {
      numeroDoDocumento: '14041737706',
      tipoDeConexao: 'bifasico',
      classeDeConsumo: 'rural',
      modalidadeTarifaria: 'verde',
      historicoDeConsumo: [78, 60, 76, 97, 81, 31, 38, 92, 59, 60],
    },
    output: {
      elegivel: false,
      razoesDeInelegibilidade: [
        'Classe de consumo não aceita',
        'Consumo muito baixo para tipo de conexão',
        'Modalidade tarifária não aceita',
      ],
    },
  },
};
