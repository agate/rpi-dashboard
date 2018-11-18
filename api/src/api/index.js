import { Router } from 'express';
import os from 'os';
import gpio from './gpio';

export default ({ logger, db }) => { // eslint-disable-line no-unused-vars
  const api = Router();

  api.get('/hello', (req, res) => res.json({
    result: 'Hello, world.',
  }));

  api.get('/hostname', (req, res) => res.json({
    result: os.hostname(),
  }));

  api.use('/gpios', gpio({ logger, db }));

  return api;
};
