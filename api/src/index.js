import express from 'express';
import expressWinston from 'express-winston';
import { createLogger, format, transports } from 'winston';
import config from 'config';
import lowdb from 'lowdb';
import path from 'path';
import FileSync from 'lowdb/adapters/FileSync';
import api from './api';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console({ level: config.get('logLevel') }),
  ],
});

const initApp = () => new Promise((resolve) => {
  const app = express();
  app.use(expressWinston.logger({
    winstonInstance: logger,
    level: 'verbose',
  }));

  const adapter = new FileSync(path.join(process.cwd(), config.get('db')));
  const db = lowdb(adapter);

  db.defaults({
    gpios: [],
  }).write();

  app.use(express.json());
  app.use('/api', api({ logger, db }));

  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err.message === 'Validation failed') {
      res.status(400).json({ errors: err.mapped() });
    } else {
      logger.warn(err.stack);
      res.status(400).json({ msg: err.message });
    }
  });

  resolve(app);
});


if (['development', 'production'].includes(process.env.NODE_ENV)) {
  (async () => {
    const { PORT = 8000 } = process.env;
    try {
      const app = await initApp();
      app.listen(PORT, () => logger.info(`Example app listening on port ${PORT}!`));
    } catch (err) {
      logger.warn(err.stack);
      process.exit(1);
    }
  })();
}

export default initApp;
