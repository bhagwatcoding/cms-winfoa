'use server'

import { SessionService } from '@/services/session.service';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginUserAction(userId: string) {
  const headerStore = await headers();
  const ua = headerStore.get('user-agent') || '';
  const ip = headerStore.get('x-forwarded-for') || '127.0.0.1';

  // Creates DB entry + Sets Cookie
  await SessionService.createSession(userId, ua, ip);
  
  redirect('/dashboard');
}