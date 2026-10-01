// Focused acceptance checks for visual cleanup 3.0; run against the production build.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),http=require('http'),assert=require('assert/strict');
const root=process.cwd(),base='http://127.0.0.1:4178/huayopata-viva/';
const server=http.createServer((req,res)=>{let f=root+'/dist'+req.url.split('?')[0].replace('/huayopata-viva','');if(f.endsWith('/'))f+='index.html';if(!fs.existsSync(f)){res.writeHead(404);res.end();return}res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.webp')?'image/webp':f.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(f))});
(async()=>{
 await new Promise(r=>server.listen(4178,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox']});
 try{for(const width of [320,390,768,1024,1440]){
  const p=await b.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/rest/v1/**',r=>r.abort());await p.route('**/*.mp4',r=>r.abort());await p.route('**/tile.openstreetmap.org/**',r=>r.abort());
  await p.goto(base+'#descubre');await p.locator('#gallery-title').waitFor();await p.locator('#galeria').scrollIntoViewIfNeeded();await p.waitForFunction(()=>!!document.querySelector('.hv-gallery-unavailable')||document.querySelector('.hv-gallery-feature img')?.complete);
  assert.equal(await p.locator('.hv-discovery .hv-local-gallery').count(),1);
  assert.equal(await p.getByRole('navigation',{name:'Descubrir Huayopata'}).getByRole('link').count(),5);
  assert.equal(await p.locator('.hv-landscape-reading').getAttribute('open'),null);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  fs.mkdirSync(root+'/test-results',{recursive:true});await p.screenshot({path:root+'/test-results/cleanup-discovery-'+width+'.png'});
  await p.locator('.hv-landscape-reading>summary').press('Enter');assert.equal(await p.locator('#naturaleza').isVisible(),true);
  await p.goto(base+'#naturaleza');assert.equal(await p.locator('#naturaleza').isVisible(),true,'legacy nature link expands its content');
  await p.goto(base+'#planifica');await p.locator('#planifica').scrollIntoViewIfNeeded();assert.equal(await p.locator('.vd').count(),0);await p.waitForFunction(()=>document.querySelector('.hv-global-links .hv-nav-item:last-child>a').getAttribute('aria-current')==='location',{},{timeout:3000});
  await p.screenshot({path:root+'/test-results/cleanup-planning-'+width+'.png'});
  await p.locator('#guia-llegada>summary').press('Enter');assert.equal(await p.locator('#guia-llegada').getAttribute('open'),'');
  await p.locator('#dudas-visita>summary').press('Enter');assert.equal(await p.locator('#guia-llegada').getAttribute('open'),null);assert.equal(await p.locator('.hv-planning-panels>details[open]').count(),1);
  await p.locator('#dudas-visita>summary').press('Enter');
  assert.equal(await p.locator('.hv-event-edition').count(),2);assert.equal(await p.locator('.hv-event-edition time[datetime]').count(),2);
  await p.locator('#celebra').scrollIntoViewIfNeeded();await p.screenshot({path:root+'/test-results/editorial-events-'+width+'.png'});

  if(width<=850){await p.locator('.hv-global-menu>summary').click();assert.deepEqual(await p.locator('.hv-global-menu>nav>a').allTextContents(),['Descubre','Experiencias','Calendario','Planifica']);await p.keyboard.press('Escape')}
  await p.goto(base+'#mapa');await p.locator('.vd').waitFor();assert.equal(await p.locator('.hv-global-menu').getAttribute('open'),null);
  assert.equal(await p.locator('#planifica #mapa').count(),1);assert.equal(await p.locator('.vd-emergency-call').count(),7);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.goto(base+'calendario/virgen-del-carmen/');await p.getByRole('heading',{level:1}).waitFor();
  assert.equal(await p.getByRole('button',{name:'Guardar fecha de referencia'}).count(),1);
  assert.equal(await p.locator('.cal-event-aside .cal-button').count(),1,'one primary action in event details');
  assert.equal(await p.locator('.cal-editorial-link').count(),1);assert.deepEqual(errors,[]);
  console.log('PASS discovery merge, disclosure keyboard, legacy nature anchor, planning tools, emergency access, event hierarchy',width);await p.close();
 }}finally{await b.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
