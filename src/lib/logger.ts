import { createLogger, format, transports } from 'winston';
import expressWinston from 'express-winston';


const myFormat = format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.colorize(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logfile.log' })
    ],
});

const loggerMiddleware = expressWinston.logger({
    winstonInstance: logger,
    // meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    // expressFormat: true,
    colorize: true,
});


export {
    loggerMiddleware,
    logger,
};