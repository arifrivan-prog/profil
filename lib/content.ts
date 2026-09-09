export type Item = { id: string; kind: 'Karya' | 'Produk'; title: string; description: string; url: string; image: string; price: string; button: string; published: boolean };
export type Content = { name: string; role: string; organization: string; intro: string; bio: string; instagram: string; items: Item[] };
export const defaults: Content = {
 name: 'Risal Num Arif Rivan Syahrir', role: 'Widyaiswara Ahli Madya', organization: 'BBPK APDN IV',
 intro: 'ASN, widyaiswara, dan entrepreneur. Mengenal saya lebih dekat melalui pendidikan, karya, dan usaha digital.',
 bio: 'Saya Risal Num Arif Rivan Syahrir, Widyaiswara Ahli Madya pada BBPK APDN IV. Latar belakang saya sebagai ASN dan bagian dari IPDN XVIII menjadi bagian dari perjalanan profesional saya.\n\nSaya juga menjalankan LulusUjian.com, platform belajar digital untuk latihan dan persiapan ujian. Di sini, saya membagikan profil, karya, serta produk yang saya kembangkan.',
 instagram: 'https://www.instagram.com/arifrivan/',
 items: [{id:'lulusujian',kind:'Produk',title:'LulusUjian.com',description:'Platform belajar digital dengan tryout dan latihan soal adaptif untuk membantu persiapan ujian.',url:'https://lulusujian.com/',image:'/assets/lulusujian-logo.png',price:'',button:'Kunjungi LulusUjian',published:true}]
};
export function safeUrl(value:string, image=false) { if(image && value.startsWith('/assets/') && !value.includes('..')) return true; try { const u=new URL(value);return ['http:','https:'].includes(u.protocol) && !u.username && !u.password; } catch {return false;} }
export function validateContent(value:unknown):Content {
 if (!value || typeof value !== 'object') throw new Error('Data profil tidak valid.');
 const c=value as Record<string,unknown>;
 const s=(v:unknown,label:string,max:number,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw new Error(label+' belum terisi atau terlalu panjang.');return v.trim();};
 const instagram=s(c.instagram,'Tautan Instagram',2000);if(instagram&&!safeUrl(instagram))throw new Error('Gunakan tautan Instagram dengan https://.');
 if(!Array.isArray(c.items)||c.items.length>100)throw new Error('Maksimal 100 karya dan produk.');
 const ids=new Set<string>();
 const items=c.items.map((item:unknown)=>{if(!item||typeof item!=='object')throw new Error('Produk tidak valid.');const i=item as Record<string,unknown>;const id=s(i.id,'ID',100,true);if(ids.has(id))throw new Error('Produk terduplikasi.');ids.add(id);if(i.kind!=='Karya'&&i.kind!=='Produk')throw new Error('Pilih kategori karya atau produk.');const url=s(i.url,'Tautan tujuan',2000,true),image=s(i.image,'Tautan gambar',2000);if(!safeUrl(url)||(image&&!safeUrl(image,true)))throw new Error('Tautan harus diawali http:// atau https://.');if(typeof i.published!=='boolean')throw new Error('Status produk tidak valid.');return {id,kind:i.kind,title:s(i.title,'Judul',150,true),description:s(i.description,'Deskripsi',1000),url,image,price:s(i.price,'Harga',80),button:s(i.button,'Teks tombol',60,true),published:i.published} as Item;});
 return {name:s(c.name,'Nama',150,true),role:s(c.role,'Jabatan',150,true),organization:s(c.organization,'Instansi',150,true),intro:s(c.intro,'Pengantar',500,true),bio:s(c.bio,'Tentang saya',5000,true),instagram,items};
}
