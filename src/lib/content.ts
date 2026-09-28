import {servicePlaces,type ServicePlace} from '../service-data';
import {topics,type Topic} from '../Topic';
import {scrollScrubScenes} from '../scroll-scrub-scenes';
const url=import.meta.env.VITE_SUPABASE_URL||'https://rhghpitzpdstrraxuogz.supabase.co';
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_p71p3H-YyF4kmDRG7grkbA_4MRx19BJ';
export let contentStatus:'loading'|'live'|'backup'='loading';
export async function loadContent(){
 try{
  const get=async(table:string)=>{const response=await fetch(`${url}/rest/v1/${table}`,{headers:{apikey:key},signal:AbortSignal.timeout(7000)});if(!response.ok)throw new Error(`Content ${response.status}`);return response.json()};
  const [places,chapters]=await Promise.all([get('places?select=id,data&published=eq.true&order=id'),get('chapters?select=id,data,sort_order&published=eq.true&order=sort_order')]);
  if(!Array.isArray(places)||!places.length||!Array.isArray(chapters)||!chapters.length)throw new Error('Empty content');
  const validPlaces=places.map((row:{data:ServicePlace})=>row.data).filter((p:ServicePlace)=>p&&typeof p.id==='string'&&typeof p.name==='string'&&typeof p.kind==='string'&&typeof p.description==='string');
  if(validPlaces.length!==places.length)throw new Error('Invalid places');
  servicePlaces.splice(0,servicePlaces.length,...validPlaces);
  for(const row of chapters as {id:string,data:{topic:Topic,scene?:Record<string,unknown>}}[]){if(row.data.topic&&topics[row.id])topics[row.id]=row.data.topic;const scene=scrollScrubScenes.find(s=>s.id===row.data.scene?.id);if(scene&&row.data.scene){const {actions,...data}=row.data.scene;Object.assign(scene,data);if(scene.id==='abra'){scene.poster=import.meta.env.BASE_URL+'assets/world/huayopata-intro-poster.webp';scene.mobilePoster=import.meta.env.BASE_URL+'assets/world/huayopata-intro-mobile-poster.webp'}}}
  contentStatus='live';
 }catch(error){contentStatus='backup';console.warn('Using bundled Huayopata content:',error)}
}
