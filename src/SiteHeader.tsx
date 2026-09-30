import {useEffect,useRef,useState} from 'react';
import {sitePath} from './lib/site';
import './site-header.css';
type Section='home'|'stories'|'calendar';
const stories=[['abra-malaga','Abra Málaga'],['te','Té'],['cafe','Café'],['wamanmarka','Wamanmarka'],['comunidades','Comunidades']];
export default function SiteHeader({section='home'}:{section?:Section}){
 const [active,setActive]=useState('inicio');
 const header=useRef<HTMLElement>(null);
 const storySlug=decodeURIComponent(window.location.pathname).split('/descubre/')[1]?.replace(/\/$/,'');
 useEffect(()=>{
  if(section!=='home')return;
  const update=()=>{
   const nodes=['inicio','tea','coffee','wamanmarka','community','naturaleza','galeria','rutas','servicios-del-valle','planifica'].map(id=>document.getElementById(id)).filter((el):el is HTMLElement=>!!el);
   const reached=nodes.filter(el=>el.getBoundingClientRect().top<=Math.min(window.innerHeight*.3,180));
   const id=reached.at(-1)?.id||'inicio';
   setActive(['tea','coffee','wamanmarka','community','galeria'].includes(id)?'naturaleza':id==='servicios-del-valle'?'mapa':id);
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
 const items=[{id:'inicio',label:'Inicio',href:anchor('inicio')},{id:'naturaleza',label:'Descubrir',href:anchor('naturaleza')},{id:'rutas',label:'Rutas',href:anchor('rutas')},{id:'calendar',label:'Calendario',href:sitePath('/calendario/')},{id:'mapa',label:'Mapa y servicios',href:anchor('mapa')}];
 const current=(id:string):'page'|'location'|undefined=>section==='calendar'&&id==='calendar'?'page':section==='stories'&&id==='naturaleza'?'location':section==='home'&&active===id?'location':undefined;
 const closeMenu=(event:React.MouseEvent<HTMLElement>)=>{if((event.target as HTMLElement).closest('a')){const d=event.currentTarget.closest('details');if(d)d.open=false}};
 const storyLinks=()=>stories.map(([slug,label])=><a key={slug} href={sitePath('/descubre/'+slug)} aria-current={section==='stories'&&storySlug===slug?'page':undefined}>{label}</a>);
 return <header ref={header} className="hv-nav hv-global-nav"><a className="hv-brand" href={sitePath('/')} aria-label="Huayopata Viva, volver al inicio"><img className="hv-official-shield" src={sitePath('assets/identity/escudo-huayopata.webp')} alt="" width="34" height="34"/><span>HUAYOPATA VIVA</span></a><nav className="hv-global-links" aria-label="Navegación principal">{items.map(x=><div className="hv-nav-item" key={x.id}><a href={x.href} aria-current={current(x.id)}>{x.label}</a>{x.id==='naturaleza'&&<details className="hv-story-menu"><summary aria-label="Abrir historias del valle"><span aria-hidden="true">⌄</span></summary><nav aria-label="Historias del valle" onClick={closeMenu}><small>HISTORIAS DEL VALLE</small>{storyLinks()}</nav></details>}</div>)}</nav><a className="hv-global-cta" href={anchor('planifica')}>Prepara tu visita <span aria-hidden="true">↗</span></a><details className="hv-global-menu"><summary>Menú <span aria-hidden="true">+</span></summary><nav aria-label="Navegación móvil" onClick={closeMenu}>{items.map(x=><a key={x.id} href={x.href} aria-current={current(x.id)}>{x.label}</a>)}<a href={anchor('planifica')} aria-current={current('planifica')}>Prepara tu visita</a><div className="hv-global-sub"><small>HISTORIAS DEL VALLE</small>{storyLinks()}</div></nav></details></header>
}
