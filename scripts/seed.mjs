import{readFile}from'node:fs/promises';
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
const url=process.env.SUPABASE_URL||'https://rhghpitzpdstrraxuogz.supabase.co';
if(!key)throw new Error('Set SUPABASE_SERVICE_ROLE_KEY locally; never commit it.');
const data=JSON.parse(await readFile('supabase/seed-content.json','utf8'));
for(const table of ['places','chapters']){
 const r=await fetch(`${url}/rest/v1/${table}`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify(data[table])});
 if(!r.ok)throw new Error(`${table}: ${r.status} ${await r.text()}`);
 console.log(`Saved ${data[table].length} ${table}`);
}
