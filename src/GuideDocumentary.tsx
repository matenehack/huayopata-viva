import {useEffect,useRef,useState} from 'react';
import {Play,ExternalLink,X} from 'lucide-react';
import './guide-documentary.css';

const films={
 te:{title:'La comunidad tealera de Huyro',place:'HUYRO · HUAYOPATA',author:'Jarot',year:'2025',note:'Corto de un documental en proceso sobre la comunidad tealera de Huyro. Registro del autor; no es una oferta de visitas.',url:'https://vimeo.com/1045764533',embed:'https://player.vimeo.com/video/1045764533?dnt=1',poster:'https://i.vimeocdn.com/video/1969399931-d8f5946962fa403e15e8e60576f7551d81a1bd322de93f41ac1bb7000cbca1b2-d_960?region=us',portrait:true},
 cafe:{title:'Una visita a la finca de Rubén',place:'HUAYOPATA · CAFICULTURA',author:'X Travel Peru',year:'2023',note:'Registro de una visita dedicada al café en Huayopata. La publicación identifica la finca del señor Rubén; las actividades y la atención actuales deben confirmarse.',url:'https://www.youtube.com/watch?v=ZwcEH1GRf9A',embed:'https://www.youtube-nocookie.com/embed/ZwcEH1GRf9A',poster:'https://i.ytimg.com/vi/ZwcEH1GRf9A/hqdefault.jpg',portrait:false},
};
export default function GuideDocumentary({tema}:{tema:'te'|'cafe'}){
 const film=films[tema];const [loaded,setLoaded]=useState(false);const [imageFailed,setImageFailed]=useState(false);const playButton=useRef<HTMLButtonElement>(null);const frame=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{if(loaded)frame.current?.focus()},[loaded]);
 const close=()=>{setLoaded(false);requestAnimationFrame(()=>playButton.current?.focus())};
 return <figure className={'hv-guide-film '+(film.portrait?'is-portrait':'')}>
 <div className="hv-guide-film-screen">{loaded?<><iframe ref={frame} src={film.embed} title={film.title+' · '+film.author} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onKeyDown={e=>{if(e.key==='Escape')close()}}/><button className="hv-guide-film-close" onClick={close}><X size={16}/> Cerrar reproductor</button></>:<button ref={playButton} className="hv-guide-film-launch" onClick={()=>setLoaded(true)} aria-label={'Cargar documental: '+film.title}>{!imageFailed&&<img src={film.poster} alt="" loading="lazy" decoding="async" onError={()=>setImageFailed(true)}/>}<span className="hv-guide-film-play"><Play size={28} aria-hidden="true"/></span><span className="hv-guide-film-prompt">Ver documental aquí</span></button>}</div>
 <figcaption><span>{film.place}</span><h3>{film.title}</h3><p>{film.note}</p><small>{film.author} · {film.year} · Reproductor del autor. Se carga al pulsar.</small><a href={film.url} target="_blank" rel="noreferrer">Ver original en {tema==='te'?'Vimeo':'YouTube'} <ExternalLink size={14}/><span className="sr-only"> (nueva pestaña)</span></a></figcaption>
 </figure>
}
