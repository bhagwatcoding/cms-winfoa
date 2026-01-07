import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        name: 'Education Portal API',
        version: '1.0.0',
        description: 'Complete education management platform API',
        endpoints: {
            health: '/api/health',
            transactions: '/api/center/transactions',
            notifications: '/api/center/notifications',
            certificates: '/api/center/certificates',
            admitCards: '/api/center/admit-cards',
        },
        documentation: 'https://yourdomain.com/docs',
        status: 'operational',
    });
}
