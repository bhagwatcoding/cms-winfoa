/**
 * Professional API Handler Wrapper
 * Higher-order function for consistent error handling and database connection
 *
 * @module ApiHandler
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/core/db/connection';
import { ApiHelper } from './response-helper';
import { logger } from '@/core/logger';

type ApiHandlerFunction = (
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) => Promise<NextResponse>;

/**
 * Wraps an API route handler with:
 * 1. Database connection
 * 2. Error handling (try/catch)
 * 3. Logging
 *
 * @example
 * export const GET = apiHandler(async (req) => {
 *   const users = await User.find();
 *   return ApiHelper.success(users);
 * });
 */
export function apiHandler(handler: ApiHandlerFunction): ApiHandlerFunction {
  return async (req: NextRequest, context: { params: Record<string, string | string[]> }) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.nextUrl.pathname;

    try {
      // 1. Ensure DB Connection
      await connectDB();

      // 2. Log Request
      // logger.debug(`[API] ${method} ${url} - Started`);

      // 3. Execute Handler
      const response = await handler(req, context);

      // 4. Log Success
      // const duration = Date.now() - startTime;
      // logger.info(`[API] ${method} ${url} - ${response.status} (${duration}ms)`);

      return response;
    } catch (error) {
      // 5. Handle Errors
      const duration = Date.now() - startTime;
      logger.error(`[API] ${method} ${url} - Failed (${duration}ms)`, { error });

      if (error instanceof Error) {
        // Handle specific error types (e.g. Mongoose validation errors) if needed
      }

      return ApiHelper.serverError(error);
    }
  };
}
