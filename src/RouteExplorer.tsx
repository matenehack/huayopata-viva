import {useState} from 'react';
import {ArrowRight,Clock3,MapPin,Mountain,Leaf,Landmark} from 'lucide-react';
import {sitePath} from './lib/site';
import './route-explorer.css';

type Stop={label:string;detail:string;url?:string};
type Journey={days:number;name:string;tag:string;description:string;stops:Stop[];note:string};
const journeys:Journey[]=[
 {days:1,name:'El valle en una jornada',tag:'PAISAJE Y SABORES',description:'Una primera mirada a la transición andina y a la producción local.',stops:[
 {label:'Abra Málaga',detail:'Paisaje de altura y cambio de clima.',url:sitePath('/descubre/abra-malaga')},
 {label:'Descenso hacia el valle',detail:'Paradas únicamente en zonas seguras y autorizadas.'},
 {label:'Huyro · té o café',detail:'Visita a una finca que confirme atención.',url:sitePath('/descubre/te')}],note:'Recorrido orientativo. Consulta transporte, carretera y disponibilidad antes de salir.'},
 {days:2,name:'Sabores y memoria',tag:'AGROTURISMO Y PATRIMONIO',description:'Más tiempo para conversar con productores y conocer el patrimonio del valle.',stops:[
 {label:'Día 1 · Abra Málaga y Huyro',detail:'Transición ecológica y llegada al valle.',url:sitePath('/descubre/abra-malaga')},
 {label:'Día 1 · Experiencia productiva',detail:'Té o café con un anfitrión confirmado.',url:sitePath('/descubre/cafe')},
 {label:'Día 2 · Wamanmarka',detail:'Patrimonio con condiciones de acceso verificadas.',url:sitePath('/descubre/wamanmarka')},
 {label:'Día 2 · Gastronomía local',detail:'Consulta el directorio para encontrar una parada.'}],note:'Wamanmarka requiere confirmar el permiso y el acceso vigente.'},
 {days:3,name:'Conocerlo sin prisa',tag:'NATURALEZA Y CULTURA',description:'Una propuesta pausada que añade naturaleza y tiempo en el valle.',stops:[
 {label:'Día 1 · Altura y bosque',detail:'Abra Málaga y llegada al valle.',url:sitePath('/descubre/abra-malaga')},
 {label:'Día 2 · Té, café y comunidad',detail:'Experiencias coordinadas y descanso en Huyro.',url:sitePath('/descubre/comunidades')},
 {label:'Día 3 · Patrimonio o naturaleza',detail:'Wamanmarka o una salida a Pasto Grande, según acceso.',url:sitePath('/descubre/wamanmarka')}],note:'Pasto Grande no tiene inicio de sendero ni coordenadas de acceso verificadas en el mapa; coordina con un responsable local.'}
];
export default function RouteExplorer(){
 const [index,setIndex]=useState(0);const journey=journeys[index];
 return <section className="hv-journeys" id="rutas" aria-labelledby="journeys-title">
 <div className="hv-journeys-head"><span>EXPLORA A TU RITMO</span><h2 id="journeys-title">¿Cuánto tiempo le darías al valle?</h2><p>Tres ideas para organizar tu visita. Elige una y descubre qué experiencias combinar, sin horarios ni accesos inventados.</p></div>
 <div className="hv-journeys-tabs" role="group" aria-label="Duración propuesta">{journeys.map((item,i)=><button key={item.days} aria-pressed={index===i} onClick={()=>setIndex(i)}>{item.days} {item.days===1?'día':'días'}</button>)}</div>
 <div className="hv-journey-panel" key={journey.days}><div className="hv-journey-copy"><span>{journey.tag}</span><h3>{journey.name}</h3><p>{journey.description}</p><div className="hv-journey-note"><Clock3 size={18}/><span>Duración orientativa por jornadas; tiempos de traslado por confirmar.</span></div><p className="hv-journey-caution">{journey.note}</p><a className="hv-journey-cta" href="#mapa">Consultar mapa y servicios <ArrowRight size={18}/></a></div><ol className="hv-journey-stops">{journey.stops.map((stop,i)=><li key={stop.label}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{stop.label}</strong><p>{stop.detail}</p>{stop.url&&<a href={stop.url}>Explorar historia <ArrowRight size={15}/></a>}</div></li>)}</ol></div>
 <div className="hv-journeys-foot"><Mountain size={18}/><Leaf size={18}/><Landmark size={18}/><span>Rutas inspiracionales, no paquetes turísticos ni indicaciones GPS. Confirma accesos, anfitriones y condiciones del viaje.</span></div>
 </section>;
}
