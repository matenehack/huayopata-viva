// Run after BASE_PATH=/huayopata-viva/ npm run build. Uses the same browser setup as calendar-browser.cjs.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),http=require('http'),assert=require('assert/strict'),path=require('path');
const dir=process.cwd(),base='http://127.0.0.1:4177/huayopata-viva/';
const server=http.createServer((req,res)=>{let f=dir+'/dist'+req.url.split('?')[0].replace('/huayopata-viva','');if(f.endsWith('/'))f+='index.html';if(!fs.existsSync(f)){res.writeHead(404);res.end();return}res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.webp')?'image/webp':f.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(f))});
const poll=async(fn)=>{for(let i=0;i<100;i++){if(await fn())return;await new Promise(r=>setTimeout(r,50))}throw Error('Expected UI state was not reached')};
(async()=>{
 await new Promise(r=>server.listen(4177,'127.0.0.1',r));
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox']});
 try{
 for(const width of [320,390,768,1024,1440]){
  const p=await b.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/rest/v1/**',r=>r.abort());await p.route('**/*.mp4',r=>r.abort());
  let failTiles=true;await p.route('**/tile.openstreetmap.org/**',r=>failTiles?r.abort():r.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64')}));
  await p.goto(base+'#galeria');await p.locator('#gallery-title').waitFor();
  assert.equal(await p.locator('.hv-municipal-close-impact a').count(),0,'closing passage does not repeat calendar access');
  assert.equal(await p.locator('.hv-explore-hub').count(),0,'duplicate story hub removed');
  assert.equal(await p.locator('#descubre #galeria').count(),1,'authentic gallery belongs to discovery');
  assert.equal(await p.locator('#planifica .hv-map-disclosure').count(),1,'directory belongs to planning');
  assert.equal(await p.locator('.hv-global-cta').count(),0,'no competing header CTA');
  assert.deepEqual(await p.locator('.hv-global-links .hv-nav-item>a').allTextContents(),['Descubre','Experiencias','Calendario','Planifica']);
  const trigger=p.getByRole('button',{name:'Ampliar fotografía documental de Wamanmarka'});await trigger.click();await p.locator('dialog[open]').waitFor();
  assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Cerrar fotografía');
  for(let i=0;i<5;i++){await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>!!document.activeElement.closest('dialog')),true)}
  await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').count(),0);assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);assert.equal(await p.evaluate(()=>document.body.style.overflow),'');
  await p.locator('#gallery-title').scrollIntoViewIfNeeded();await poll(async()=>await p.locator('.hv-global-links a[aria-current],.hv-global-menu>nav>a[aria-current]').first().innerText()==='Descubre');
  if(width>850){assert.equal(await p.evaluate(()=>document.querySelector('.hv-brand').getBoundingClientRect().right<document.querySelector('.hv-global-links').getBoundingClientRect().left&&document.querySelector('.hv-global-links').getBoundingClientRect().right<=innerWidth),true,'desktop navigation collision');await p.getByLabel('Abrir historias del valle').click();assert.equal(await p.getByRole('navigation',{name:'Historias del valle',exact:true}).getByRole('link').count(),5);await p.keyboard.press('Escape');assert.equal(await p.locator('.hv-story-menu').first().getAttribute('open'),null)}
  else{await p.locator('.hv-global-menu>summary').click();assert.deepEqual(await p.locator('.hv-global-menu>nav>a').allTextContents(),['Descubre','Experiencias','Calendario','Planifica']);assert.equal(await p.locator('.hv-mobile-group').count(),1);await p.keyboard.press('Escape');assert.equal(await p.locator('.hv-global-menu').getAttribute('open'),null)}
  await p.goto(base+'#planifica');assert.equal(await p.locator('.vd').count(),0,'map is deferred until requested');
  await p.locator('.hv-map-disclosure>summary').click();await p.locator('.vd').waitFor();assert.equal(await p.locator('.vd-intro,.vd-categories,.vd-useful').count(),0,'tools open without a second landing page');
  await p.goto(base+'#emergencias');await p.locator('#emergencias').waitFor();assert.equal(await p.locator('.vd-emergency-call').count(),7);
  await p.goto(base+'#mapa');await p.locator('.vd').waitFor();await p.locator('.vd-map-entry').scrollIntoViewIfNeeded();
  if(width<=760){assert.equal(await p.locator('.vd-results').isVisible(),false);await p.locator('.vd-mobile-tabs').getByRole('button',{name:'Lugares',exact:true}).click();assert.equal(await p.locator('.vd-map').isVisible(),false);assert.equal(await p.locator('.vd-results').isVisible(),true)}
  await p.locator('.vd-select').first().click();await p.locator('.vd-detail-head h3').waitFor();
  if(width<=760)await poll(()=>p.locator('.vd-detail').evaluate(e=>document.activeElement===e));
  await p.getByRole('button',{name:'Cerrar ficha',exact:true}).click();if(width<=760)assert.equal(await p.locator('.vd-select').first().evaluate(e=>document.activeElement===e),true);
  if(width<=760){await p.locator('.vd-mobile-tabs').getByRole('button',{name:/Guardados/}).click();await p.getByRole('button',{name:'Mostrar todos los lugares'}).click();assert.equal(await p.locator('.vd-mobile-tabs').getByRole('button',{name:'Lugares',exact:true}).getAttribute('aria-pressed'),'true')}
  await p.locator('.vd-heart').first().click();assert.equal(await p.locator('.vd-heart').first().getAttribute('aria-pressed'),'true');
  if(width<=760){await p.locator('.vd-mobile-tabs').getByRole('button',{name:/Guardados/}).click();assert.equal(await p.locator('.vd-result').count(),1);const exportButton=p.getByRole('button',{name:'Descargar guardados',exact:true});assert.equal(await exportButton.isVisible(),true);const downloaded=p.waitForEvent('download');await exportButton.click();const file=await downloaded;assert.equal(file.suggestedFilename(),'Mis-lugares-Huayopata.txt');assert.ok(fs.readFileSync(await file.path(),'utf8').includes('MIS LUGARES'));await p.locator('.vd-mobile-tabs').getByRole('button',{name:'Mapa',exact:true}).click()}
  await p.getByRole('button',{name:'Reintentar mapa ↻'}).waitFor();failTiles=false;await p.getByRole('button',{name:'Reintentar mapa ↻'}).click();await poll(async()=>await p.locator('.vd-map-recovery').count()===0&&await p.locator('.vd-map-loading').count()===0);
  assert.equal(await p.locator('.vd-emergency-call').count(),7);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow at '+width);
  fs.mkdirSync(dir+'/test-results',{recursive:true});await p.locator('.vd-mobile-tabs').isVisible().then(v=>v?p.locator('.vd-mobile-tabs').scrollIntoViewIfNeeded():p.locator('.vd-map-entry').scrollIntoViewIfNeeded());await p.screenshot({path:dir+'/test-results/ux-map-'+width+'.png'});
  await p.goto(base+'descubre/te/');await p.getByRole('heading',{level:1}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'theme overflow at '+width);
  const menu=width>850?'.hv-nav-item:first-child .hv-story-menu>summary':'.hv-global-menu>summary';await p.locator(menu).click();if(width<=850)await p.locator('.hv-mobile-group').getByText('Historias del valle',{exact:true}).click();assert.equal(await p.locator('header a[aria-current=page]:visible').innerText(),'Té');await p.keyboard.press('Escape');
  await p.goto(base+'descubre/comunidades/#aves');await p.locator('#aves').waitFor();assert.equal(await p.locator('#ciclismo').count(),1);await p.locator('#aves summary').click();assert.equal(await p.locator('#aves details').getAttribute('open'),'');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'valley activities overflow');
  fs.mkdirSync(dir+'/test-results',{recursive:true});await p.locator('#aves').scrollIntoViewIfNeeded();await p.screenshot({path:dir+'/test-results/valley-activities-'+width+'.png'});
  await p.goto(base+'#community');assert.equal(await p.locator('#community .hv-valley-actions a').count(),2);assert.equal(await p.getByRole('link',{name:'Conocer el valle vivo',exact:true}).count(),0);assert.equal(await p.locator('.hv-valley-actions a').last().evaluate(e=>getComputedStyle(e).borderRadius==='0px'&&getComputedStyle(e).backgroundColor==='rgba(0, 0, 0, 0)'),true,'birdwatching is an editorial link');
  assert.deepEqual(errors,[]);console.log('PASS shared navigation, gallery focus/Escape, directory views, saved reset, selection, tile retry, emergencies, theme',width);await p.close();
 }
 if(fs.existsSync('/tmp/hv-test-video.mp4')){
  const p=await b.newPage({viewport:{width:1440,height:900}});await p.route('**/rest/v1/**',r=>r.abort());await p.route('**/*.mp4',r=>r.fulfill({contentType:'video/mp4',body:fs.readFileSync('/tmp/hv-test-video.mp4')}));
  await p.goto(base+'#community');await p.getByRole('button',{name:'Comunidades',exact:true}).click();
  try{await poll(()=>p.evaluate(()=>Array.from(document.querySelectorAll('video')).some(v=>v.src.includes('/culture.mp4')&&v.loop&&v.muted&&v.playsInline&&!v.paused&&v.currentTime>0)))}catch(e){console.log(await p.evaluate(()=>({y:scrollY,active:document.querySelector('[data-active-section]')?.getAttribute('data-active-section'),videos:Array.from(document.querySelectorAll('video')).map(v=>({src:v.src,loop:v.loop,paused:v.paused,time:v.currentTime,ready:v.readyState,error:v.error?.message}))})));throw e}
  console.log('PASS community background uses native muted looping playback (controlled media fixture)');await p.close();
 }
 for(const failure of ['photo','directory']){
  const p=await b.newPage({reducedMotion:'reduce'});await p.route('**/rest/v1/**',r=>r.abort());await p.route('**/*.mp4',r=>r.abort());
  if(failure==='photo'){await p.route('**/wamanmarka*.webp',r=>r.abort());await p.goto(base+'#galeria');await p.getByRole('button',{name:'Ampliar fotografía documental de Wamanmarka'}).scrollIntoViewIfNeeded();await p.locator('.hv-gallery-unavailable').waitFor();await p.getByRole('button',{name:'Ampliar fotografía documental de Wamanmarka'}).click();await p.getByRole('button',{name:'Reintentar fotografía'}).waitFor();await p.keyboard.press('Escape')}
  else{await p.route('**/assets/valley-directory-*.js',r=>r.abort());await p.goto(base+'#mapa');await p.locator('.hv-module-error').waitFor();assert.ok(await p.locator('#gallery-title').count());assert.equal(await p.getByRole('link',{name:'Descargar datos y contactos ↓'}).getAttribute('href'),'/huayopata-viva/servicios-huayopata.json')}
  console.log('PASS isolated failure recovery',failure);await p.close();
 }
 }finally{await b.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
