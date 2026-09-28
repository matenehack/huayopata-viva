import{mkdir,readFile,writeFile}from'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
for(const route of ['abra-malaga','te','cafe','wamanmarka','comunidades']){await mkdir('dist/descubre/'+route,{recursive:true});await writeFile('dist/descubre/'+route+'/index.html',html)}
await writeFile('dist/404.html',html);await writeFile('dist/.nojekyll','');
