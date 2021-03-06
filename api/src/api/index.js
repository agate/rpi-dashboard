import { Router } from 'express';
import os from 'os';

export default ({ logger }) => { // eslint-disable-line no-unused-vars
  const api = Router();

  api.get('/hello', (req, res) => res.json({
    result: 'Hello, world.',
  }));

  api.get('/hostname', (req, res) => res.json({
    result: os.hostname(),
  }));

  return api;
};
