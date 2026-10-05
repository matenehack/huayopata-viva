import {createRoot} from 'react-dom/client';
import {useEffect,useState} from 'react';
import Home from './Home';
import Calendar from './calendar/Calendar';
import Topic,{topics} from './Topic';
import {loadContent} from './lib/content';
import './styles.css';
import './editorial.css';
import './interaction-refinement.css';
import './territorial-palette.css';
import './tactile-controls.css';
import './cultural-controls.css';
const base=import.meta.env.BASE_URL;
const path=decodeURIComponent(location.pathname.slice(base.length)).replace(/\/$/,'');
function App(){
 const [contentRevision,setContentRevision]=useState(0);
 const match=path.match(/^descubre\/([^/]+)$/);
 useEffect(()=>{
  let active=true;
  void loadContent().then(()=>{if(active)setContentRevision(value=>value+1)});
  // Resolve the initial anchor once; a content refresh must not move the visitor.
  const frame=requestAnimationFrame(()=>{
   if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();
  });
  return()=>{active=false;cancelAnimationFrame(frame)};
 },[]);
 useEffect(()=>{
  if(match&&topics[match[1]]){document.title=topics[match[1]].title+' | Huayopata Viva';document.querySelector('meta[name="description"]')?.setAttribute('content',topics[match[1]].intro)}
 },[contentRevision]);
 const calendarMatch=path.match(/^calendario(?:\/([a-z0-9-]+))?$/);
 return calendarMatch?<Calendar slug={calendarMatch[1]}/>:path===''?<Home contentRevision={contentRevision}/>:match?<Topic tema={match[1]}/>:<main className="hv-story-page hv-story-missing"><h1>Página no encontrada</h1><a href={base}>Volver a Huayopata Viva</a></main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
