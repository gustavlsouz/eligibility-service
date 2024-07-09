import Ajv from 'ajv';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { ClientData } from '../models/models';
import { input } from '../schemas/schemas';

const ajv = new Ajv();

export const clientDataValidator = ajv.compile<ClientData>(input);

export const documentValidator = (data: ClientData) =>
  cpf.isValid(data.numeroDoDocumento) || cnpj.isValid(data.numeroDoDocumento);
