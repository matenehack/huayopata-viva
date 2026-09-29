import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile('src/calendar/model.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const data=JSON.parse(await readFile('src/calendar/seed.json','utf8'));
const find=id=>data.events.find(e=>e.id===id);
assert.equal(m.dateKey(m.occurrence(find('huamanmarca-raymi'),2027)),'2027-06-13');
assert.equal(m.dateKey(m.occurrence(find('huamanmarca-raymi'),2026)),'2026-06-14');
assert.equal(m.dateKey(m.nextOccurrence(find('virgen-del-carmen'),new Date(2026,7,1))),'2027-07-16');
assert.equal(m.dateKey(m.nextOccurrence(find('todos-santos'),new Date(2026,10,1))),'2026-11-01');
assert.equal(m.occurrence(find('watunakuy'),2027),null);
assert.equal(m.occurrence(find('expoferia-huayopata'),2027),null);
const confirmed={...find('aniversario-huayopata'),status:'Programa confirmado',editionYear:2026};
assert.equal(m.editionStatus(confirmed,2026),'Programa confirmado');
assert.equal(m.editionStatus(confirmed,2027),'Programa pendiente');
const range={...confirmed,dateRule:{kind:'one-off',start:'2027-06-30',end:'2027-07-02'}};
assert.equal(m.datesInMonth(range,2027,6).length,2);
assert.equal(m.occursOn(range,new Date(2027,6,3)),false);
assert.equal(m.occurrence(range,2028),null);assert.equal(m.dateKey(m.nextOccurrence(range,new Date(2027,6,1))),'2027-06-30');
assert.equal(data.events.length,29);assert.equal(data.institutions.length,10);
assert.equal(new Set(data.events.map(e=>e.slug)).size,29);
for(const e of data.events){assert.ok(e.sources.length);assert.ok(data.organizers.some(o=>o.id===e.organizerId));assert.notEqual(e.status,'Programa confirmado');}
for(const i of data.institutions){assert.match(i.modularCode,/^\d{7}$/);if(i.id==='ie-0236380'){assert.equal(i.anniversary,'06-14');assert.equal(find('aniversario-'+i.id).dateRule.day,14)}else{assert.equal(i.anniversary,null);assert.equal(find('aniversario-'+i.id).dateRule.kind,'unknown')}}
for(const a of data.activities){assert.equal(a.date,null);assert.equal(a.time,null);assert.equal(a.status,'Tradición documentada');}
for(const p of data.media){assert.ok(p.author&&p.source&&p.license&&p.authorization);assert.match(p.url,/supabase.co\/storage/);assert.match(p.represented,/No muestra/);}
assert.equal(find('educacion-secundaria').dateRule.day,27);assert.deepEqual(m.localityNames(find('educacion-secundaria')),['Distrito de Huayopata']);
console.log('PASS recurrence, month ranges, year-specific confirmation, pending dates, all source and rights records');
