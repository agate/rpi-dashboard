import express from 'express';
import expressWinston from 'express-winston';
import { createLogger, format, transports } from 'winston';
import config from 'config';

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

  app.get('/api/hello', (req, res) => res.json({
    result: 'Hello, world.',
  }));

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
