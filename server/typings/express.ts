import { Response } from 'express';
import User from '@models/user';

interface CustomLocals extends Record<string, any> {
  user?: User;
}

export interface IResponse extends Response {
  locals: CustomLocals;
}
