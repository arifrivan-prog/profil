import { redirect } from 'next/navigation';
import { hasPrototypeSession } from '@/lib/prototype';
import { readContent } from '@/lib/storage';
import Manager from '@/components/manager';
export const dynamic='force-dynamic';
export default async function Admin(){if(!await hasPrototypeSession())redirect('/masuk');const data=await readContent();return <Manager initial={data.content} initialRevision={data.revision}/>;}