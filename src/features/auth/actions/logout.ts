'use server';

import { logout as sessionLogout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function logoutAction() {
    await sessionLogout();
    redirect('/login');
}
