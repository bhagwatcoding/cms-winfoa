// lib/proxy/logger.ts
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const log = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  // In production, log as strict JSON string
  console.log(JSON.stringify({ timestamp, level, message, ...meta }));
};

export const Logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log('INFO', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('WARN', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('ERROR', msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) =>
    process.env.NODE_ENV === 'development' && log('DEBUG', msg, meta),
};
