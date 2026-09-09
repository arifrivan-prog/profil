import { readContent,saveContent } from '@/lib/storage';
import { validateContent } from '@/lib/content';
import { prototypeSession,localRequest,sameOrigin } from '@/lib/prototype';
export const dynamic='force-dynamic';
export async function GET(request:Request) {
 const admin=new URL(request.url).searchParams.get('admin')==='1';
 if(admin&&!prototypeSession(request))return Response.json({error:'Masuk ke halaman kelola terlebih dahulu.'},{status:401});
 const data=await readContent();
 if(!admin)data.content={...data.content,items:data.content.items.filter(i=>i.published)};
 return Response.json(data,{headers:{'Cache-Control':'no-store'}});
}
export async function PUT(request:Request) {
 if(!localRequest(request))return Response.json({error:'Prototipe ini belum mendukung pengelolaan online.'},{status:503});
 if(!prototypeSession(request))return Response.json({error:'Sesi berakhir. Silakan masuk kembali.'},{status:401});
 if(!sameOrigin(request))return Response.json({error:'Permintaan tidak diizinkan.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Format data harus JSON.'},{status:415});
 try {
 const text=await request.text();if(text.length>150000)return Response.json({error:'Data terlalu besar.'},{status:413});
 const body=JSON.parse(text);if(!Number.isInteger(body.revision)||body.revision<0)throw new Error('Versi data tidak valid.');
 const content=validateContent(body.content);
 if(!await saveContent(content,body.revision))return Response.json({error:'Ada perubahan dari tab lain. Muat ulang halaman sebelum menyimpan.'},{status:409});
 return Response.json({content,revision:body.revision+1},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return Response.json({error:error instanceof Error?error.message:'Gagal menyimpan.'},{status:400});}
}