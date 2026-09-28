import {writeFileSync} from 'node:fs';
import {topics} from '../src/Topic';
import {scrollScrubScenes} from '../src/scroll-scrub-scenes';
import {servicePlaces} from '../src/service-data';
const ids=['abra-malaga','te','cafe','wamanmarka','comunidades'];
writeFileSync('supabase/seed-content.json',JSON.stringify({places:servicePlaces.map(data=>({id:data.id,data})),chapters:ids.map((id,i)=>({id,sort_order:i,data:{topic:topics[id],scene:{...scrollScrubScenes[i],actions:undefined}}}))},null,2));
