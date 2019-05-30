const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const allLogsDir = 'logs/all';
const errLogsDir = 'logs/error';

// Create the log directory if it does not exist
function createLogDir(logDir) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}

createLogDir(allLogsDir);
createLogDir(errLogsDir);

const combineFileTransport = new transports.DailyRotateFile({
  filename: `${allLogsDir}/%DATE%-combine.json`,
  datePattern: 'YYYY-MM-DD',
  format: format.combine(
    format.json(),
  ),
});
const errorFileTransport = new transports.DailyRotateFile({
  filename: `${errLogsDir}/%DATE%-error.json`,
  datePattern: 'YYYY-MM-DD',
  format: format.combine(
    format.json(),
  ),
  level: 'error',
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level} ${info.message}`,
        ),
      ),
    }),
    combineFileTransport,
    errorFileTransport,
  ],
});

module.exports = logger;
