import {useState} from 'react';
import {ArrowDown,MapPin} from 'lucide-react';
import {sitePath} from './lib/site';

/** Documentary image already catalogued in Biodiversity; no new location claims. */
export default function JourneyInterlude(){
 const [failed,setFailed]=useState(false);
 return <section className="hv-journey-interlude" aria-labelledby="bridge-title">
  <figure className="hv-interlude-photo" data-unavailable={failed}>
   {failed?<p className="hv-interlude-unavailable">Flora de Abra Málaga<br/><small>Fotografía temporalmente no disponible. La fuente permanece al pie.</small></p>:<picture><source media="(max-width:650px)" srcSet={sitePath('assets/biodiversity/ourisia-640.webp')}/><img src={sitePath('assets/biodiversity/ourisia-1280.webp')} alt="Flores rojas de Ourisia chamaedrifolia entre rocas y musgo en Abra Málaga" width="1280" height="960" loading="lazy" decoding="async" onError={()=>setFailed(true)}/></picture>}
   <figcaption><span><MapPin size={14} aria-hidden="true"/> ABRA MÁLAGA</span><strong>Ourisia chamaedrifolia</strong><a href="https://commons.wikimedia.org/wiki/File:Ourisia_chamaedrifolia_-_Ruth_Guti%C3%A9rrez_Oliveros_-_243470335.jpeg" target="_blank" rel="noreferrer">Ruth Gutiérrez Oliveros · 2022 · CC0 · Fuente ↗</a></figcaption>
  </figure>
  <div className="hv-interlude-copy"><span className="hv-interlude-kicker">DEL TERRITORIO A TU VISITA</span><h2 id="bridge-title">Conoce el lugar.<br/><em>Prepara el viaje.</em></h2><p>Antes de salir, consulta el acceso, coordina las visitas y guarda los contactos que puedas necesitar.</p><a className="hv-interlude-action" href="#planifica">Prepara tu visita <ArrowDown size={18} aria-hidden="true"/></a><div className="hv-interlude-index" aria-hidden="true"><span>01 · Llegada</span><span>02 · Servicios</span><span>03 · Ayuda</span></div></div>
 </section>
}
