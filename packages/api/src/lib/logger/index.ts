/** biome-ignore-all lint/suspicious/noExplicitAny: For the log class, argument types are not required.*/
import pino, { type LoggerOptions, type Logger as PinoInstance } from 'pino';

export interface Logger {
	info(message: string, ...args: any[]): void;
	error(message: string, ...args: any[]): void;
	warn(message: string, ...args: any[]): void;
	debug(message: string, ...args: any[]): void;
	fatal(message: string, ...args: any[]): void;
}

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;

class PinoLogger implements Logger {
	private logger: PinoInstance;

	constructor() {
		const options: LoggerOptions = {
			level: isTest ? 'silent' : 'info',
			transport:
				process.env.NODE_ENV !== 'production' && !isTest
					? {
							target: 'pino-pretty',
							options: {
								colorize: true,
								ignore: 'hostname,pid,stack', // Esconde hostname, pid e stack trace
							},
						}
					: undefined,
		};
		this.logger = pino(options);
	}

	info(message: string, ...args: any[]): void {
		this.logger.info(message, ...args);
	}

	error(message: string, ...args: any[]): void {
		this.logger.error(message, ...args);
	}

	warn(message: string, ...args: any[]): void {
		this.logger.warn(message, ...args);
	}

	debug(message: string, ...args: any[]): void {
		this.logger.debug(message, ...args);
	}

	fatal(message: string, ...args: any[]): void {
		this.logger.fatal(message, ...args);
	}
}

export const logger = new PinoLogger();
