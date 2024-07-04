
## Exemplos de requisições:

### Exemplo de inegilibidade em todos os cenários existentes

```shell
curl --location 'http://localhost:3000/api/eligibility/validation' \
--header 'Content-Type: application/json' \
--data '{
    "numeroDoDocumento": "14041737706",
    "tipoDeConexao": "bifasico",
    "classeDeConsumo": "rural",
    "modalidadeTarifaria": "verde",
    "historicoDeConsumo": [
        78,
        60,
        76,
        97,
        81,
        31,
        38,
        92,
        59,
        60
    ]
}'
```

#### Resposta esperada

```json
{
    "elegivel": false,
    "razoesDeInelegibilidade": [
        "Classe de consumo não aceita",
        "Consumo muito baixo para tipo de conexão",
        "Modalidade tarifária não aceita"
    ]
}
```

### Exemplo de cenário elegível

```shell
{
    "numeroDoDocumento": "14041737706",
    "tipoDeConexao": "bifasico",
    "classeDeConsumo": "comercial",
    "modalidadeTarifaria": "convencional",
    "historicoDeConsumo": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160,
        6941,
        4597 
    ]
}
```

#### Resposta esperada

```json
{
    "elegivel": true,
    "economiaAnualDeCO2": 5553.24
}
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
