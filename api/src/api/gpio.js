import { Router } from 'express';
import { Gpio } from 'onoff';
import _ from 'lodash';

export default ({ logger }) => { // eslint-disable-line no-unused-vars
  const api = Router();
  const gpios = {};

  api.route('')
    .get((req, res) => res.json({
      result: gpios,
    }))
    .post((req, res) => {
      const { pin, direction } = req.body;
      const gpio = new Gpio(pin, direction);
      _.set(gpios, pin, gpio);
      res.status(204).send();
    });

  api.route('/:xid')
    .post((req, res) => {
      const { xid } = req.params;
      const { value } = req.body;
      logger.debug(xid);
      logger.debug(value);
      gpios[xid].writeSync(parseInt(value, 10));
      res.status(204).send();
    });

  return api;
};
