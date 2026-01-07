'use server';

import connectDB from '@/lib/db';
import User from '@/edu/models/User';
import { login, verifyPassword, hashPassword } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginState = {
    errors?: {
        email?: string[];
        password?: string[];
        form?: string[];
    };
    message?: string;
};

export async function authenticate(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await connectDB();
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return {
                message: 'Invalid credentials',
            };
        }

        if (!user.password) {
            // Handle case where user exists but has no password (e.g. from seed)
            // In reality, you might want to redirect them to a password set page or just fail
            return {
                message: 'Account not fully set up. Please contact admin.',
            };
        }

        const passwordsMatch = await verifyPassword(password, user.password);

        if (!passwordsMatch) {
            return {
                message: 'Invalid credentials',
            };
        }

        await login(user._id.toString());
    } catch (error) {
        console.error('Login error:', error);
        return {
            message: 'Something went wrong. Please try again.',
        };
    }

    redirect('/');
}

const RegisterSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6),
});

export type RegisterState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        form?: string[];
    };
    message?: string;
};

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
    const validated = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const { name, email, password, confirmPassword } = validated.data;

    if (password !== confirmPassword) {
        return {
            message: 'Passwords do not match',
        };
    }

    try {
        await connectDB();
        const existing = await User.findOne({ email });

        if (existing) {
            return {
                message: 'Email already in use',
            };
        }

        const hashed = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        await login(user._id.toString());
    } catch (error) {
        console.error('Registration error:', error);
        return {
            message: 'Something went wrong. Please try again.',
        };
    }

    redirect('/');
}

export async function logoutAction() {
    await import('@/lib/auth').then((mod) => mod.logout());
    redirect('/login');
} 
