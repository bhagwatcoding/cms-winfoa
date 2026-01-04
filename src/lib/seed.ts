import connectDB from './db';
import Center from './models/Center';
import User from './models/User';

export async function seedDatabase() {
    await connectDB();

    const centerCount = await Center.countDocuments();
    if (centerCount === 0) {
        await Center.create({
            name: 'RAMDHARI SINGH DINKAR COMPUTER TRAINING CENTER',
            code: 'BR-141',
            address: 'Mohanpur, Bakhri Begusarai, Kalimandir road, ward no.5, Begusarai, Bihar-848201',
            contact: '8051434647',
            walletBalance: 107.00
        });
        console.log('Center seeded');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
        const center = await Center.findOne({ code: 'BR-141' });
        if (center) {
            await User.create({
                name: 'Purushottam Singh',
                email: 'purushottam@example.com',
                role: 'admin',
                centerId: center._id,
                joinedAt: new Date('2023-09-23')
            });
            console.log('Admin user seeded');
        }
    }
}
