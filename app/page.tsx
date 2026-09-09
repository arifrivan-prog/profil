import { readContent } from '@/lib/storage';
import Profile from '@/components/profile';
export const dynamic='force-dynamic';
export default async function Home() { const {content}=await readContent();return <Profile content={{...content,items:content.items.filter(i=>i.published)}}/>; }
