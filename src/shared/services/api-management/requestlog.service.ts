import { ApiRequest } from '@/models';
import { connectDB } from '@/lib/db';

export class RequestLogService {
  /**
   * Log API request
   */
  static async logRequest(data: {
    apiKeyId: string;
    userId: string;
    method: string;
    path: string;
    statusCode: number;
    responseTime: number;
    ipAddress?: string;
    userAgent?: string;
    requestBody?: Record<string, unknown>;
    responseBody?: Record<string, unknown>;
    error?: string;
  }) {
    await connectDB();

    await ApiRequest.create({
      ...data,
      timestamp: new Date(),
    });
  }

  /**
   * Get request logs for API key
   */
  static async getRequestLogs(
    apiKeyId: string,
    options: {
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    await connectDB();

    const { page = 1, limit = 50, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { apiKeyId };

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = startDate;
      if (endDate) filter.timestamp.$lte = endDate;
    }

    const logs = await ApiRequest.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ApiRequest.countDocuments(filter);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get request analytics
   */
  static async getAnalytics(apiKeyId: string, timeRange: 'day' | 'week' | 'month' = 'week') {
    await connectDB();

    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const analytics = await ApiRequest.aggregate([
      {
        $match: {
          apiKeyId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp',
            },
          },
          requests: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
          successRate: {
            $avg: {
              $cond: [{ $lt: ['$statusCode', 400] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top endpoints
    const topEndpoints = await ApiRequest.aggregate([
      {
        $match: {
          apiKeyId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$path',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return {
      timeRange,
      analytics,
      topEndpoints,
    };
  }
}
