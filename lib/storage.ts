import { env } from 'cloudflare:workers';
import { defaults, type Content } from './content';
export async function readContent():Promise<{content:Content;revision:number}> {
 const row=await env.DB.prepare('SELECT document, revision FROM site_content WHERE id = ?').bind('main').first<{document:string;revision:number}>();
 return row?{content:JSON.parse(row.document),revision:row.revision}:{content:defaults,revision:0};
}
export async function saveContent(content:Content,revision:number) {
 const result=revision===0
  ? await env.DB.prepare('INSERT OR IGNORE INTO site_content (id, document, revision) VALUES (?, ?, ?)').bind('main',JSON.stringify(content),1).run()
  : await env.DB.prepare('UPDATE site_content SET document = ?, revision = revision + 1 WHERE id = ? AND revision = ?').bind(JSON.stringify(content),'main',revision).run();
 return result.meta.changes===1;
}