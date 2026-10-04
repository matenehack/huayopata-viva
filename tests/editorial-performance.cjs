const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),http=require('http'),assert=require('assert/strict');
const root=process.cwd(),seed=JSON.parse(fs.readFileSync('src/calendar/seed.json')),base='http://127.0.0.1:4179/huayopata-viva/';
const server=http.createServer((req,res)=>{let f=root+'/dist'+req.url.split('?')[0].replace('/huayopata-viva','');if(f.endsWith('/'))f+='index.html';if(!fs.existsSync(f)){res.writeHead(404);res.end();return}res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.webp')?'image/webp':'text/html');res.end(fs.readFileSync(f))});
(async()=>{await new Promise(r=>server.listen(4179,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const calendarRequests=[],mediaRequests=[],mapChunks=[];
 p.on('request',r=>{if(/calendar_events|event_activities|event_media|event_organizers|educational_institutions/.test(r.url()))calendarRequests.push(r.url());if(r.url().endsWith('.mp4'))mediaRequests.push(r.url());if(/leaflet-src|valley-directory-.*\.js/.test(r.url()))mapChunks.push(r.url())});
 await p.route('**/rest/v1/**',r=>r.abort());await p.route('**/*.mp4',r=>r.abort());
 await p.goto(base);await p.locator('.scroll-scrub').waitFor();await p.locator('.hv-discovery-card').first().waitFor({state:'attached'});
 assert.equal(calendarRequests.length,0,'calendar network deferred outside viewport');assert.equal(mapChunks.length,0,'map code not requested before opening');assert.equal(mediaRequests.length,0,'reduced motion prevents video downloads');
 await p.locator('#celebra').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('.hv-calendar-sync')?.textContent.includes('Mostrando'));
 assert.equal(calendarRequests.length,5);assert.equal(await p.locator('.hv-event-edition').count(),2,'offline seed remains visible');assert.equal(mapChunks.length,0);
 console.log('PASS initial calendar requests 0; five requests on approach; map deferred; reduced-motion video requests 0; fallback cards 2');await p.close();
 const empty=await b.newPage({reducedMotion:'reduce'});const tables={calendar_events:seed.events.map(e=>({...e,dateRule:{kind:'unknown'}})),event_activities:seed.activities,event_media:seed.media,event_organizers:seed.organizers,educational_institutions:seed.institutions};
 await empty.route('**/rest/v1/**',r=>{const t=new URL(r.request().url()).pathname.split('/').pop();return tables[t]?r.fulfill({json:tables[t].map(data=>({data,updated_at:'2026-09-30T00:00:00Z'}))}):r.abort()});await empty.route('**/*.mp4',r=>r.abort());
 await empty.goto(base+'#celebra');await empty.getByText('Aún no hay próximas fechas publicadas.',{exact:false}).waitFor();assert.equal(await empty.locator('.hv-event-edition').count(),0);assert.equal(await empty.getByRole('link',{name:'Calendario completo',exact:true}).count(),1);console.log('PASS integrated empty state retains full calendar access');await empty.close();

 for(const width of [320,390,768,1024,1440]){
 const page=await b.newPage({viewport:{width,height:900}});await page.route('**/rest/v1/**',r=>r.abort());await page.route('**/*.mp4',()=>{});await page.goto(base);await page.locator('.scroll-scrub__video').first().waitFor({state:'attached'});assert.equal(await page.locator('.scroll-scrub__video').first().evaluate(v=>v.loop&&v.muted&&v.playsInline),true,'initial video uses native muted loop');
 await page.evaluate(()=>{const band=document.querySelectorAll('[data-scroll-scrub-band]')[1];window.scrollTo({top:band.getBoundingClientRect().top+scrollY-innerHeight*.11,behavior:"instant"})});await page.waitForTimeout(100);
 const layers=await page.locator('[data-scroll-scrub-layer]').evaluateAll(es=>es.slice(0,2).map(e=>({opacity:Number(e.style.opacity),z:Number(e.style.zIndex)})));assert.ok(layers[1].opacity>0&&layers[1].opacity<1,'incoming layer blends before boundary');assert.ok(layers[1].z>layers[0].z,'incoming layer is visible above previous scene');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.close();console.log('PASS hero loop, cross-fade and overflow',width);
 }
 }finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
