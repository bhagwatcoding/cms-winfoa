'use server';

import { HeaderStore } from '@/core/helpers';
import { SessionService } from '@/core/services/session.service';
import { redirect } from 'next/navigation';

export async function loginUserAction(userId: string) {
  const ua = await HeaderStore.userAgent();
  const ip = await HeaderStore.ip();

  // Creates DB entry + Sets Cookie
  await SessionService.create(userId, { userAgent: ua, ip });

  redirect('/dashboard');
}
