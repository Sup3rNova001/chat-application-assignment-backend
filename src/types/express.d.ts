import { Request as ExpressRequest } from 'express';

interface RequestWithUserId extends ExpressRequest {
  userId?: string;
}

export { RequestWithUserId };