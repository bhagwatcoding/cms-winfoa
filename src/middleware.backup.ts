import { proxy } from './proxy.backup';
import { NextRequest } from 'next/server';

export { config } from './proxy.backup';

export default async function middleware(request: NextRequest) {
    return proxy(request);
}
