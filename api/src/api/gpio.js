import { Router } from 'express';
import { Gpio } from 'onoff';
import _ from 'lodash';
import shortid from 'shortid';
import { body, param, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import { NotFound, AppError } from './utils';

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
      body('pin').exists().isInt({ min: 0, max: 30 }).toInt(10),
      body('direction').isIn(['low', 'high']),
    ], (req, res) => {
      validationResult(req).throw();
      const { title, pin, direction } = matchedData(req);

      if (db.get('gpios').find({ pin }).value()) {
        throw new AppError(`GPIO #${pin} already defined`);
      }

      const id = shortid.generate();
      const value = direction === 'high' ? 1 : 0;
      db.get('gpios').push(_.assign({ id, value }, { title, pin, direction })).write();
      _.set(gpios, id, new Gpio(pin, direction));

      res.status(201).json({
        result: id,
      });
    });

  api.route('/:id')
    .get([
      param('id').trim().custom(v => shortid.isValid(v)),
    ], async (req, res, next) => {
      try {
        validationResult(req).throw();
        const { id } = matchedData(req);

        if (!_.has(gpios, id)) {
          throw new NotFound();
        }

        gpios[id].read((err, value) => {
          if (err) throw err;
          res.json({ result: { value } });
        });
      } catch (err) {
        next(err);
      }
    })
    .delete([
      param('id').trim().custom(v => shortid.isValid(v)),
    ], (req, res) => {
      validationResult(req).throw();
      const { id } = matchedData(req);
      const dt = db.get('gpios').find({ id }).value();

      if (_.isUndefined(dt)) {
        throw new NotFound();
      }

      gpios[id].unexport();
      _.unset(gpios, id);
      db.get('gpios').remove({ id }).write();
      res.status(204).send();
    })
    .post([
      param('id').custom(v => shortid.isValid(v)),
      body('value').exists().isIn([0, 1]).toInt(10),
    ], (req, res) => {
      validationResult(req).throw();
      const { id, value } = matchedData(req);

      const dt = db.get('gpios').find({ id }).value();

      if (_.isUndefined(dt)) {
        throw new NotFound();
      }

      db.get('gpios').find({ id }).assign({ value }).write();
      gpios[id].writeSync(value);
      res.status(204).send();
    });

  return api;
};
