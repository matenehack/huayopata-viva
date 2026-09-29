import{mkdir,readFile,writeFile}from'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
const pages={
 'abra-malaga':['Abra Málaga: donde cambia el paisaje','Descubre el paisaje de altura, la conservación y el bosque de neblina de Abra Málaga.'],
 te:['El mundo del té de Huayopata','Explora el cultivo, la cosecha, la elaboración y la degustación del té.'],
 cafe:['Mundo cafetalero','Sigue el café desde el cafetal y la cereza hasta el beneficio, el secado y la taza.'],
 wamanmarka:['Wamanmarka: historia en el camino','Conoce la memoria de piedra del valle de Amaybamba y consulta las referencias oficiales.'],
 comunidades:['Gente, sabores y celebraciones','Acércate a productores, cocina local y celebraciones de Huayopata con respeto.']
};
for(const [route,[title,description]] of Object.entries(pages)){
 const page=html.replace(/<title>.*?<\/title>/,`<title>${title} | Huayopata Viva</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${description}"/>`).replace(/<meta property="og:title" content="[^"]*"\s*\/>/,`<meta property="og:title" content="${title} | Huayopata Viva"/>`);
 await mkdir('dist/descubre/'+route,{recursive:true});await writeFile('dist/descubre/'+route+'/index.html',page)
}
await writeFile('dist/404.html',html);await writeFile('dist/.nojekyll','');

const calendar=JSON.parse(await readFile('src/calendar/seed.json','utf8'));
const escape=value=>value.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
for(const item of [{slug:'',title:'Huayopata celebra · Calendario vivo',summary:'Celebraciones, instituciones educativas y actividades documentadas de Huayopata.'},...calendar.events]){
 const route='dist/calendario/'+(item.slug?item.slug+'/':'');
 const page=html.replace(/<title>.*?<\/title>/,`<title>${escape(item.title)} | Huayopata Viva</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(item.summary)}"/>`).replace(/<meta property="og:title" content="[^"]*"\s*\/>/,`<meta property="og:title" content="${escape(item.title)} | Huayopata Viva"/>`).replace(/<meta property="og:image" content="[^"]*"\s*\/>/,`<meta property="og:image" content="${calendar.media[0].url}"/>`);
 await mkdir(route,{recursive:true});await writeFile(route+'index.html',page);
}
