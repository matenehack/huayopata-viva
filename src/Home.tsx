import {NatureSection,useEditorialReveal} from './Editorial';
import {UpcomingCalendar} from './calendar/Calendar';
import RouteExplorer from './RouteExplorer';
import SiteHeader from './SiteHeader';
import LocalGallery from './LocalGallery';
import IntroShieldCurtain from './IntroShieldCurtain';
import { sitePath } from "@/lib/site";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
const ValleyDirectory = lazy(() => import("@/valley-directory"));

export default function Index({contentRevision=0}:{contentRevision?:number}){
useEditorialReveal();
const mapRef = useRef<HTMLDetailsElement>(null);
const [mapOpen,setMapOpen] = useState(false);
useEffect(() => {
 const revealMap = () => { if (["#mapa", "#quedate", "#mapa-servicios", "#emergencias"].includes(window.location.hash) && mapRef.current) { mapRef.current.open = true; setMapOpen(true); requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({block:"start"})); } };
 revealMap(); window.addEventListener("hashchange", revealMap); return () => window.removeEventListener("hashchange", revealMap);
}, []);
useEffect(() => {
 if(!mapOpen || !mapRef.current)return;
 const id=window.location.hash.slice(1);
 if(!["mapa","quedate","mapa-servicios","emergencias"].includes(id))return;
 const scrollWhenReady=()=>{const target=document.getElementById(id);if(target){target.scrollIntoView({block:"start"});return true}return false};
 if(scrollWhenReady())return;
 const observer=new MutationObserver(()=>{if(scrollWhenReady())observer.disconnect()});
 observer.observe(mapRef.current,{childList:true,subtree:true});
 return()=>observer.disconnect();
},[mapOpen]);
return <main className="hv-site"><IntroShieldCurtain/><a className="hv-skip-link" href="#mapa">Ir al mapa y servicios</a>
<SiteHeader/>
<div id="inicio"><ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme}/></div>
<section className="hv-manifesto hv-manifesto-impact" aria-labelledby="manifesto-title"><p className="hv-index">HUAYOPATA · CUSCO</p><h2 id="manifesto-title">Donde los Andes<br/><em>se vuelven valle.</em></h2><p>En pocos kilómetros, la altura se convierte en bosque de nubes, cultivos y vida local. Descubre el territorio desde sus propias historias.</p><a className="hv-manifesto-link hv-action hv-action-dark" href="#naturaleza">Descubrir el valle <span aria-hidden="true">↓</span></a></section>
<NatureSection/>
<section className="hv-explore-hub" aria-labelledby="explore-hub-title"><div className="hv-explore-head"><span>HISTORIAS DEL VALLE</span><h2 id="explore-hub-title">Un lugar. Muchas formas de sentirlo.</h2><p>Conoce los cultivos, el patrimonio y las personas que dan vida a Huayopata.</p></div><div className="hv-explore-options"><a href={sitePath("/descubre/te")}><span>01 / EXPERIENCIAS</span><strong>Del cultivo a la taza</strong><small>Té, café y la vida de los productores.</small><b aria-hidden="true">↗</b></a><a href={sitePath("/descubre/wamanmarka")}><span>02 / PATRIMONIO</span><strong>Memoria de piedra</strong><small>Wamanmarka y la historia de Amaybamba.</small><b aria-hidden="true">↗</b></a><a href={sitePath("/descubre/comunidades")}><span>03 / CULTURA VIVA</span><strong>Gente del valle</strong><small>Productores, sabores y encuentros locales.</small><b aria-hidden="true">↗</b></a></div></section>
<LocalGallery/>
<RouteExplorer/>
<UpcomingCalendar/>
<section className="hv-map-preview" id="servicios-del-valle" aria-labelledby="map-preview-title">
<div><span>MAPA DEL VALLE</span><h2 id="map-preview-title">Encuentra tu próxima parada.</h2><p>Elige un atractivo, consulta los servicios cercanos y confirma los accesos antes de salir.</p></div>
<details ref={mapRef} className="hv-map-disclosure" onToggle={event=>setMapOpen(event.currentTarget.open)}><summary>Explorar mapa y servicios <b aria-hidden="true">+</b></summary>{mapOpen&&<Suspense fallback={<div className="hv-map-module-loading" role="status">Preparando el directorio y el mapa…</div>}><ValleyDirectory active={mapOpen} contentRevision={contentRevision}/></Suspense>}</details>
</section>
<section className="hv-guide hv-arrival" id="planifica" aria-labelledby="guide-title"><div className="hv-section-head"><span>PREPARA TU VISITA</span><h2 id="guide-title">Tu camino hacia Huayopata.</h2></div><p className="hv-arrival-intro">Descubre el valle con información práctica. Elige tu punto de partida, confirma el transporte disponible y coordina el acceso a experiencias y fincas antes de viajar.</p><div className="hv-arrival-grid"><article><span>01 / CÓMO LLEGAR</span><h3>Ubica tu punto de partida</h3><p>Consulta la conexión terrestre desde Cusco, Ollantaytambo o Quillabamba. Verifica horarios y disponibilidad directamente con los transportistas.</p><a href="https://www.google.com/maps/search/?api=1&query=Huyro%20Huayopata%20Cusco%20Peru" target="_blank" rel="noreferrer">Ubicar Huyro en el mapa ↗</a></article><article><span>02 / CAMINO Y CLIMA</span><h3>Prepárate para el cambio</h3><p>La vía atraviesa distintos pisos altitudinales. Lleva una capa para lluvia, abrigo y protección solar; revisa las condiciones de carretera.</p><a href="https://www.gob.pe/sutran" target="_blank" rel="noreferrer">Consultar SUTRAN ↗</a></article><article><span>03 / DURANTE LA VISITA</span><h3>Conoce con respeto</h3><p>Coordina las visitas a cultivos y los accesos restringidos. Solicita permiso antes de fotografiar personas o utilizar drones.</p><a href="#mapa">Consultar atractivos y servicios ↗</a></article></div><div className="hv-faq"><h3>Antes de adentrarte</h3><details><summary>¿Puedo visitar una finca sin reservar?</summary><p>Coordina directamente. Las fincas son espacios de trabajo y las visitas, demostraciones y degustaciones dependen del productor y de la temporada.</p><a href="#mapa">Buscar fincas en el directorio ↗</a></details><details><summary>¿Dónde encuentro ayuda durante el viaje?</summary><p>El directorio reúne contactos de emergencia y puntos de atención. La cobertura y la disponibilidad pueden variar.</p><a href="#emergencias">Abrir contactos de emergencia ↗</a></details></div>
<div className="hv-municipal-close hv-municipal-close-impact"><span>HUAYOPATA VIVA</span><strong>Tu próxima historia puede empezar aquí.</strong><p>Elige cuándo venir y conoce qué hace especial a este valle.</p><a className="hv-action hv-action-accent" href={sitePath("/calendario/")}>Ver próximas celebraciones <span aria-hidden="true">↗</span></a></div></section>
<footer className="hv-footer"><div><strong>HUAYOPATA VIVA</strong><p>Una ventana digital al territorio de Huayopata.</p></div><div><span>FUENTES DE REFERENCIA</span><a href="https://www.munihuayopata.gob.pe/" target="_blank" rel="noreferrer">Municipalidad Distrital de Huayopata</a><a href="https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=6915" target="_blank" rel="noreferrer">Inventario MINCETUR: Wamanmarka</a><a href="https://www.gob.pe/munihuayopata" target="_blank" rel="noreferrer">Escudo: ficha institucional en Gob.pe</a></div><p>© 2026 · Cusco, Perú<br/>Proyecto turístico independiente · en desarrollo</p></footer>
</main>}
