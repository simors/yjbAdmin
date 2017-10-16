const logger = require('js-logger');

logger.useDefaults();

if(process.env.NODE_ENV === 'production') {
  logger.setLevel(Logger.OFF);
}
