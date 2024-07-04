import Ajv from 'ajv';
import { ClientData } from '../models/models';
import { input } from '../schemas/schemas';

const ajv = new Ajv();

export const clientDataValidator = ajv.compile<ClientData>(input);
