/**
 * Professional Logger Service
 * Structured logging for enterprise applications
 *
 * @module Logger
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

class LoggerService {
  private static instance: LoggerService;
  private isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();

    if (this.isDevelopment) {
      // Pretty print for development
      const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
    }

    // JSON format for production (better for CloudWatch/Datadog)
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const output = this.formatMessage(level, message, meta);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'info':
      case 'http':
        console.log(output);
        break;
      case 'debug':
      case 'verbose':
      case 'silly':
        if (this.isDevelopment) {
          console.debug(output);
        }
        break;
    }
  }

  public error(message: string, meta?: Record<string, unknown>) {
    this.log('error', message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  }

  public info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  }

  public http(message: string, meta?: Record<string, unknown>) {
    this.log('http', message, meta);
  }

  public debug(message: string, meta?: Record<string, unknown>) {
    this.log('debug', message, meta);
  }
}

export const logger = LoggerService.getInstance();
