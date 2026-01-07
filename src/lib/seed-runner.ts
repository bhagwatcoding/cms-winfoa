
import { seedDatabase } from './seed';
import mongoose from 'mongoose';

async function run() {
    try {
        await seedDatabase();
        console.log('Seeding completed successfully');
    } catch (e) {
        console.error('Seeding failed:', e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
