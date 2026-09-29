import {useEffect,useState} from 'react';
import seed from './seed.json';
import {categories,statuses,type CalendarData,type Event} from './model';
let data=seed as CalendarData;
let status:'loading'|'live'|'backup'='loading';
let pending:Promise<void>|undefined;
const url=import.meta.env.VITE_SUPABASE_URL||'https://rhghpitzpdstrraxuogz.supabase.co';
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_p71p3H-YyF4kmDRG7grkbA_4MRx19BJ';
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const strings=(v:Record<string,unknown>,fields:string[])=>fields.every(f=>typeof v[f]==='string');
const https=(v:unknown)=>typeof v==='string'&&v.startsWith('https://');
const sources=(v:unknown)=>Array.isArray(v)&&v.length>0&&v.every(s=>record(s)&&strings(s,['label','kind','accessedAt'])&&https(s.url));
function validEvent(value:unknown){
 if(!record(value)||!strings(value,['id','slug','title','locality','organizerId','summary','history','editorialNote','updatedAt','relatedTopic']))return false;
 const e=value as unknown as Event;
 return /^[a-z0-9-]+$/.test(e.slug)&&categories.includes(e.category)&&statuses.includes(e.status)&&record(e.dateRule)&&['annual','nth-weekday','unknown','one-off'].includes(e.dateRule.kind)&&sources(e.sources)&&Array.isArray(e.editions)&&e.editions.every(a=>record(a)&&typeof a.year==='number'&&typeof a.description==='string'&&https(a.source))&&(e.location===null||(record(e.location)&&typeof e.location.lat==='number'&&typeof e.location.lng==='number'&&typeof e.location.label==='string'&&https(e.location.source)));
}
const validators=[validEvent,
 (v:unknown)=>record(v)&&strings(v,['id','eventId','name','place','description','organizerId'])&&categories.includes(v.category as never)&&statuses.includes(v.status as never)&&(v.date===null||typeof v.date==='string')&&(v.time===null||typeof v.time==='string')&&https(v.source),
 (v:unknown)=>record(v)&&strings(v,['id','eventId','alt','represented','author','license','authorization','transformation'])&&['image','video'].includes(v.kind as string)&&https(v.url)&&https(v.source)&&https(v.licenseUrl),
 (v:unknown)=>record(v)&&strings(v,['id','name'])&&(v.url===null||https(v.url)),
 (v:unknown)=>record(v)&&strings(v,['id','name','modularCode','locality','level','anniversaryStatus','note'])&&sources(v.sources)
];
export function loadCalendar(){
 return pending??= (async()=>{try{
  const names=['calendar_events','event_activities','event_media','event_organizers','educational_institutions'];
  const rows=await Promise.all(names.map(async(table)=>{const r=await fetch(`${url}/rest/v1/${table}?select=data,updated_at&published=eq.true&order=id`,{headers:{apikey:key},signal:AbortSignal.timeout(7000)});if(!r.ok)throw Error('Calendar unavailable');const rows=await r.json();if(!Array.isArray(rows))throw Error('Invalid calendar');return rows.map((r:{data:unknown;updated_at:string})=>record(r.data)?{...r.data,updatedAt:r.updated_at.slice(0,10)}:r.data)}));
  if(!rows[0].length||rows.some((list,i)=>!list.every(validators[i])))throw Error('Invalid calendar data');
  data={events:rows[0],activities:rows[1],media:rows[2],organizers:rows[3],institutions:rows[4],updatedAt:seed.updatedAt} as CalendarData;status='live';
 }catch{status='backup'}})();
}
export function useCalendar(){const [,revise]=useState(0);useEffect(()=>{let active=true;void loadCalendar().then(()=>{if(active)revise(n=>n+1)});return()=>{active=false}},[]);return {data,status}}
