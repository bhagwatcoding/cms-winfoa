import { NextResponse } from 'next/server';
import { seedDefaultRoles } from '@/actions/roles/seed';

export async function GET() {
    try {
        const result = await seedDefaultRoles();
        if (result.success) {
            return NextResponse.json({ message: result.message || 'Database seeded successfully' });
        } else {
            return NextResponse.json(
                { error: result.error || 'Failed to seed database' },
                { status: 500 }
            );
        }
    } catch (error: unknown) {
        console.error('Failed to seed database:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to seed database';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
