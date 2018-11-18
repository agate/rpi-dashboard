import { Router } from 'express';
import { Gpio } from 'onoff';
import _ from 'lodash';
import shortid from 'shortid';
import { body, param, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

export default ({ logger, db }) => { // eslint-disable-line no-unused-vars
  const api = Router();
  const gpios = db.get('gpios').keyBy('id').mapValues(({ pin, direction, value }) => {
    const d = new Gpio(pin, direction);
    d.writeSync(value);
    return d;
  }).value();

  api.route('')
    .get((req, res) => res.json({
      result: db.get('gpios').value(),
    }))
    .post([
      body('title').exists().trim(),
      body('pin').exists().isInt({ min: 0 }).toInt(10),
      body('direction').isIn(['low', 'high']),
    ], (req, res) => {
      validationResult(req).throw();
      const { title, pin, direction } = matchedData(req);

      const id = shortid.generate();
      const value = direction === 'high' ? 1 : 0;
      db.get('gpios').push(_.assign({ id, value }, { title, pin, direction })).write();
      _.set(gpios, id, new Gpio(pin, direction));

      res.status(201).json({
        result: id,
      });
    });

  api.route('/:id')
    .delete([
      param('id').trim().custom(v => shortid.isValid(v)),
    ], (req, res) => {
      validationResult(req).throw();
      const { id } = matchedData(req);
      const dt = db.get('gpios').find({ id }).value();

      if (_.isUndefined(dt)) {
        res.status(404).send();
      } else {
        gpios[id].unexport();
        _.unset(gpios, id);
        db.get('gpios').remove({ id }).write();
        res.status(204).send();
      }
    })
    .post([
      param('id').custom(v => shortid.isValid(v)),
      body('value').exists().isIn([0, 1]),
    ], (req, res) => {
      validationResult(req).throw();
      const { id, value } = matchedData(req);

      const dt = db.get('gpios').find({ id }).value();

      if (_.isUndefined(dt)) {
        return res.status(404).send();
      }

      db.get('gpios').find({ id }).assign({ value }).write();
      gpios[id].writeSync(value);
      return res.status(204).send();
    });

  return api;
};
