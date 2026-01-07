import connectDB from './db';
import Center from './models/edu/Center';
import User from './models/edu/User';
import bcrypt from 'bcryptjs';

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
    const center = await Center.findOne({ code: 'BR-141' });

    if (center) {
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Purushottam Singh',
                email: 'purushottam@example.com',
                password: hashedPassword,
                phone: '8051434647',
                role: 'admin',
                centerId: center._id,
                joinedAt: new Date('2023-09-23'),
                status: 'active'
            });
            console.log('Admin user seeded with password: password123');
        } else {
            // Update existing user with password if missing
            const user = await User.findOne({ email: 'purushottam@example.com' }).select('+password');
            if (user && !user.password) {
                const hashedPassword = await bcrypt.hash('password123', 10);
                user.password = hashedPassword;
                await user.save();
                console.log('Updated Admin user password to: password123');
            }
        }
    }
}
