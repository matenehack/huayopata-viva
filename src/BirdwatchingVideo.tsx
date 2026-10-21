import {useEffect,useRef,useState} from 'react';
import {sitePath} from './lib/site';
import './birdwatching-video.css';

export default function BirdwatchingVideo(){
 const video=useRef<HTMLVideoElement>(null);
 const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  const node=video.current;if(!node)return;
  const hide=()=>{if(document.hidden)node.pause()};
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)node.pause()},{threshold:0}):null;
  observer?.observe(node);document.addEventListener('visibilitychange',hide);
  return()=>{observer?.disconnect();document.removeEventListener('visibilitychange',hide);node.pause()};
 },[attempt,failed]);
 const src=sitePath('assets/activities/birdwatching-illustration.mp4');
 return <figure className="hv-bird-video">
  {failed?<div className="hv-bird-video-error" role="status"><p>El vídeo no pudo cargarse.</p><button onClick={()=>{setFailed(false);setAttempt(n=>n+1)}}>Reintentar vídeo</button><a href={src}>Abrir vídeo</a></div>:<video key={attempt} ref={video} controls playsInline muted preload="none" poster={sitePath('assets/activities/birdwatching-poster.webp')} width="1280" height="720" aria-label="Vídeo ilustrativo de un ave, generado con inteligencia artificial" onError={()=>setFailed(true)}><source src={src} type="video/mp4"/>Tu navegador no puede reproducir este vídeo. <a href={src}>Abrir vídeo</a></video>}
  <figcaption><strong>Observación de aves · ilustración</strong><span>10 segundos · Vídeo proporcionado para Huayopata Viva.</span><small>Generado con IA. No documenta un avistamiento en Huayopata.</small></figcaption>
 </figure>
}
