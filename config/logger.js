const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;

// Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: "DD-MM-YYYY hh:mm:ss A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: "all.log",
    }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;