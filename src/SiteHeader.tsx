import {useEffect,useRef,useState} from 'react';
import {sitePath} from './lib/site';
import './site-header.css';
import './visual-cleanup.css';
import './editorial-refinement.css';
import './control-layout.css';
type Section='home'|'stories'|'calendar';
const stories=[['abra-malaga','Abra Málaga'],['te','Té'],['cafe','Café'],['wamanmarka','Wamanmarka'],['comunidades','Comunidades']];
export default function SiteHeader({section='home'}:{section?:Section}){
 const [active,setActive]=useState('descubre');
 const [cinematic,setCinematic]=useState(section==='home');
 const header=useRef<HTMLElement>(null);
 const storySlug=decodeURIComponent(window.location.pathname).split('/descubre/')[1]?.replace(/\/$/,'');
 useEffect(()=>{
  if(section!=='home')return;
  const update=()=>{
   const nodes=['inicio','descubre','rutas','celebra','planifica'].map(id=>document.getElementById(id)).filter((el):el is HTMLElement=>!!el);
   const reached=nodes.filter(el=>el.getBoundingClientRect().top<=Math.min(window.innerHeight*.3,180));
   const id=reached.at(-1)?.id||'inicio';
   const discovery=document.getElementById('descubre');
   setCinematic(!!discovery&&discovery.getBoundingClientRect().top>90);
   setActive(id==='rutas'?'experiencias':id==='celebra'?'calendar':id==='planifica'?'planifica':'descubre');
  };
  let frame=0;const schedule=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;update()})};
  update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[section]);
 useEffect(()=>{
  const close=(event:KeyboardEvent)=>{if(event.key!=='Escape')return;const open=header.current?.querySelector<HTMLDetailsElement>('details[open]');if(open){open.open=false;open.querySelector('summary')?.focus()}};
  const outside=(event:PointerEvent)=>{if(!header.current?.contains(event.target as Node))header.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(d=>d.open=false)};
  window.addEventListener('keydown',close);document.addEventListener('pointerdown',outside);
  return()=>{window.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside)};
 },[]);
 const anchor=(id:string)=>section==='home'?'#'+id:sitePath('/#'+id);
 const items=[{id:'descubre',label:'Descubre',href:anchor('descubre')},{id:'experiencias',label:'Experiencias',href:anchor('rutas')},{id:'calendar',label:'Calendario',href:sitePath('/calendario/')},{id:'planifica',label:'Planifica',href:anchor('planifica')}];
 const current=(id:string):'page'|'location'|undefined=>section==='calendar'&&id==='calendar'?'page':section==='stories'&&id==='descubre'?'location':section==='home'&&active===id?'location':undefined;
 const closeMenu=(event:React.MouseEvent<HTMLElement>)=>{if((event.target as HTMLElement).closest('a')){header.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(d=>d.open=false)}};
 const storyLinks=()=>stories.map(([slug,label])=><a key={slug} href={sitePath('/descubre/'+slug)} aria-current={section==='stories'&&storySlug===slug?'page':undefined}>{label}</a>);
 return <header ref={header} className="hv-nav hv-global-nav" data-cinematic={cinematic}><a className="hv-brand" href={sitePath('/')} aria-label="Huayopata Viva, volver al inicio"><img className="hv-official-shield" src={sitePath('assets/identity/escudo-huayopata.webp')} alt="" width="34" height="34"/><span>HUAYOPATA VIVA</span></a><nav className="hv-global-links" aria-label="Navegación principal">{items.map(x=><div className="hv-nav-item" key={x.id}><a href={x.href} aria-current={current(x.id)}>{x.label}</a>{x.id==='descubre'&&<details className="hv-story-menu"><summary aria-label="Abrir historias del valle"><svg className="hv-discovery-chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></summary><nav aria-label="Historias del valle" onClick={closeMenu}><small>HISTORIAS DEL VALLE</small>{storyLinks()}</nav></details>}</div>)}</nav><details className="hv-global-menu"><summary>Menú <span aria-hidden="true">+</span></summary><nav aria-label="Navegación móvil" onClick={closeMenu}>{items.map(x=><a key={x.id} href={x.href} aria-current={current(x.id)}>{x.label}</a>)}<details className="hv-mobile-group"><summary>Historias del valle</summary><div className="hv-global-sub">{storyLinks()}</div></details></nav></details></header>
}
