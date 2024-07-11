import { createLogger, format, transports } from 'winston';
import expressWinston from 'express-winston';


const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.colorize(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logfile.log' })
    ],
});

const loggerMiddleware = expressWinston.logger({
    winstonInstance: logger,
    // meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    // expressFormat: true,
    colorize: true,
});

export default loggerMiddleware;