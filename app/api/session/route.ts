import { localRequest, sameOrigin } from '@/lib/prototype';
export async function POST(request:Request) {
 if(!localRequest(request))return Response.json({error:'Login produksi belum diaktifkan.'},{status:503});
 if(!sameOrigin(request))return Response.json({error:'Permintaan tidak diizinkan.'},{status:403});
 const form=await request.formData();const logout=form.get('action')==='logout';
 return new Response(null,{status:303,headers:{Location:logout?'/':'/kelola','Set-Cookie':logout?'prototype_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0':'prototype_session=active; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800','Cache-Control':'no-store'}});
}