// src/@types/express/index.d.ts
import { QueryRunner } from 'typeorm';

declare module 'express' {
  export interface Request {
    qr: QueryRunner;
  }
}
