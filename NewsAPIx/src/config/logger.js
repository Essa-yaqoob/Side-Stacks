import winston from "winston"
const { combine, timestamp, label, prettyPrint } = winston.format;

export const logger = winston.createLogger({
    level : "info",
    format: combine(
        label({ label: 'right meow!' }),
        timestamp(),
        prettyPrint()
      ),
      defaultMeta: { service: 'user-service' },
      transports: [

        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs.log', level :  "info" }),
      ],
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }