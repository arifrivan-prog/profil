import { headers, cookies } from 'next/headers';
export const isPrototype = () => process.env.NODE_ENV === 'development';
export function localRequest(request:Request) {
 const u=new URL(request.url);
 return isPrototype() && ['localhost','127.0.0.1','[::1]'].includes(u.hostname);
}
export function sameOrigin(request:Request) { return request.headers.get('origin') === new URL(request.url).origin; }
export function prototypeSession(request:Request) { return localRequest(request) && /(?:^|;\s*)prototype_session=active(?:;|$)/.test(request.headers.get('cookie')||''); }
export async function hasPrototypeSession() {
 const h=await headers();const host=(h.get('host')||'').split(':')[0];
 return isPrototype() && ['localhost','127.0.0.1'].includes(host) && (await cookies()).get('prototype_session')?.value==='active';
}