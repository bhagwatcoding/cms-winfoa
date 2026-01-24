/**
 * Example Route Handler
 * Demonstrates the professional API handler pattern
 * 
 * @module ExampleRoute
 */

import { apiHandler } from '@/core/api/api-handler';
import { ApiHelper } from '@/core/api/response-helper';
import { logger } from '@/core/logger';
import { NextRequest } from 'next/server';

/**
 * GET /api/example
 * Example endpoint with logging, error handling, and standardized response
 */
export const GET = apiHandler(async (req: NextRequest) => {
  // Log custom info
  logger.info('Processing example request', { 
    url: req.url,
    userAgent: req.headers.get('user-agent') 
  });

  // Simulate some logic
  const data = {
    message: 'This is a professional API response',
    timestamp: new Date().toISOString(),
    features: [
      'Automatic Error Handling',
      'Database Connection Management',
      'Structured Logging',
      'Standardized Response Format'
    ]
  };

  // Return success response
  return ApiHelper.success(data);
});

/**
 * POST /api/example
 * Example endpoint demonstrating error handling
 */
export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  
  // Validation example
  if (!body.name) {
    return ApiHelper.validationError([
      { field: 'name', message: 'Name is required' }
    ], 'Invalid request data');
  }

  // Simulate processing
  logger.info('Created new item', { name: body.name });

  return ApiHelper.created({ 
    id: crypto.randomUUID(), 
    name: body.name 
  }, 'Item created successfully');
});
