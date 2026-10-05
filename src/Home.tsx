import {NatureSection,useEditorialReveal} from './Editorial';
import {UpcomingCalendar} from './calendar/Calendar';
import RouteExplorer from './RouteExplorer';
import SiteHeader from './SiteHeader';
import LocalGallery from './LocalGallery';
import PlanningIcon from './PlanningIcon';
import {MapPinned,CloudSun,Handshake,Leaf,Coffee,Mountain,ChevronDown} from 'lucide-react';
import ModuleBoundary from './ModuleBoundary';
import IntroShieldCurtain from './IntroShieldCurtain';
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
 const revealLandscape=()=>{if(window.location.hash==="#naturaleza"){const panel=document.querySelector<HTMLDetailsElement>(".hv-landscape-reading");if(panel)panel.open=true;requestAnimationFrame(()=>document.getElementById("naturaleza")?.scrollIntoView({block:"start"}))}};
 revealMap();revealLandscape(); window.addEventListener("hashchange", revealMap);window.addEventListener("hashchange",revealLandscape); return () => {window.removeEventListener("hashchange", revealMap);window.removeEventListener("hashchange",revealLandscape)};
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

<section id="descubre" className="hv-discovery" aria-labelledby="gallery-title"><LocalGallery/><details className="hv-landscape-reading"><summary>Leer el paisaje: bosque, agua y aventura <span aria-hidden="true">+</span></summary><NatureSection/></details></section>
<RouteExplorer/>
<UpcomingCalendar/>
<section className="hv-planning-bridge" aria-labelledby="bridge-title"><div className="hv-territory-marks" aria-hidden="true"><Mountain/><Leaf/><Coffee/></div><span>DEL DESCUBRIMIENTO AL VIAJE</span><h2 id="bridge-title">Llévate la calma.<br/><em>Prepara el camino.</em></h2><p>Ya tienes una primera mirada al valle.<br/>Ahora, lo esencial para llegar y recorrerlo.</p></section>
<section className="hv-guide hv-arrival hv-planning-unified" id="planifica" aria-labelledby="guide-title"><div className="hv-section-head"><span>PLANIFICA · A TU RITMO</span><h2 id="guide-title">Lo esencial,<br/>a mano.</h2></div><p className="hv-arrival-intro">Llegada, servicios y dudas. Abre solo lo que necesitas.</p><div className="hv-planning-panels">
<details className="hv-planning-panel" name="planning" id="guia-llegada"><summary><span className="hv-planning-number">01</span><span><strong>Antes de salir</strong><small>Llegada, camino y clima</small></span><PlanningIcon kind="arrival"/><ChevronDown aria-hidden="true"/></summary><div className="hv-planning-body"><div className="hv-arrival-grid"><article><MapPinned className="hv-arrival-icon" aria-hidden="true"/><h3>Cómo llegar</h3><p>Desde Cusco, Ollantaytambo o Quillabamba. Confirma transporte y horarios con el operador.</p><a href="https://www.google.com/maps/search/?api=1&query=Huyro%20Huayopata%20Cusco%20Peru" target="_blank" rel="noreferrer">Ubicar Huyro ↗</a></article><article><CloudSun className="hv-arrival-icon" aria-hidden="true"/><h3>Camino y clima</h3><p>Abrigo, impermeable y protección solar. Revisa la carretera antes de viajar.</p><a href="https://www.gob.pe/sutran" target="_blank" rel="noreferrer">Estado de las vías ↗</a></article><article><Handshake className="hv-arrival-icon" aria-hidden="true"/><h3>Durante la visita</h3><p>Coordina el ingreso a fincas. Pide permiso para fotografiar personas o utilizar drones.</p></article></div></div></details>
<details ref={mapRef} className="hv-planning-panel hv-map-disclosure" name="planning" id="servicios-del-valle" onToggle={event=>setMapOpen(event.currentTarget.open)}><summary><span className="hv-planning-number">02</span><span><strong>Mapa y servicios</strong><small>Lugares, guardados y emergencias</small></span><PlanningIcon kind="map"/><ChevronDown aria-hidden="true"/></summary>{mapOpen&&<div className="hv-planning-body"><ModuleBoundary><Suspense fallback={<div className="hv-integrated-state" role="status"><MapPinned aria-hidden="true"/><p>Preparando los lugares del valle…<br/><small>El directorio también funciona si falla el mapa.</small></p></div>}><ValleyDirectory active={mapOpen} contentRevision={contentRevision}/></Suspense></ModuleBoundary></div>}</details>
<details className="hv-planning-panel" name="planning" id="dudas-visita"><summary><span className="hv-planning-number">03</span><span><strong>Dudas de la visita</strong><small>Fincas, accesos y ayuda</small></span><PlanningIcon kind="questions"/><ChevronDown aria-hidden="true"/></summary><div className="hv-planning-body hv-faq"><details name="visit-faq"><summary>¿Puedo visitar una finca sin reservar?</summary><p>Coordina antes de ir. Las visitas y degustaciones dependen del productor y de la temporada.</p></details><details name="visit-faq"><summary>¿Están garantizados los accesos?</summary><p>Confirma la vía, el clima y los permisos con responsables locales antes de salir.</p></details><details name="visit-faq"><summary>¿Dónde encuentro ayuda?</summary><p>Abre «Mapa y servicios» para consultar los contactos de emergencia. La cobertura y la disponibilidad pueden variar.</p></details></div></details>
</div><div className="hv-municipal-close hv-municipal-close-impact"><span>HUAYOPATA VIVA</span><strong>Un encuentro que permanece.</strong></div></section>
<footer className="hv-footer"><div><strong>HUAYOPATA VIVA</strong><p>Una ventana digital al territorio de Huayopata.</p></div><div><span>FUENTES DE REFERENCIA</span><a href="https://www.munihuayopata.gob.pe/" target="_blank" rel="noreferrer">Municipalidad Distrital de Huayopata</a><a href="https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=6915" target="_blank" rel="noreferrer">Inventario MINCETUR: Wamanmarka</a><a href="https://www.gob.pe/munihuayopata" target="_blank" rel="noreferrer">Escudo: ficha institucional en Gob.pe</a></div><p>© 2026 · Cusco, Perú<br/>Proyecto turístico independiente · en desarrollo</p></footer>
</main>}
