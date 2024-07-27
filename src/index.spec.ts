import request from 'supertest';
import express, { Express, Request, Response } from 'express';
import httpProxy from 'express-http-proxy';
import cors from 'cors';
import { getHost, getUrl } from './utils';
import dotenv from 'dotenv';

dotenv.config();

// Mock das funções utilitárias
jest.mock('./utils', () => ({
  getHost: jest.fn().mockReturnValue('http://example.com'),
  getUrl: jest.fn().mockReturnValue('/mocked-path'),
}));

// Configuração do servidor para testes
const createServer = (): Express => {
  const app: Express = express();
  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

  app.use('/*', httpProxy(jest.requireMock('./utils').getHost, {
    proxyReqPathResolver(req) {
      return jest.requireMock('./utils').getUrl(req);
    }
  }));

  return app;
};

describe('Express Server', () => {
  let app: Express;

  beforeEach(() => {
    app = createServer();
  });

  it('should return 200 OK for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Express + TypeScript Server');
  });
});
