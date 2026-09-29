import {contentStatus} from "./lib/content";
import { sitePath } from "@/lib/site";
import {useEffect,useRef,useState,useMemo} from "react";
import {ArrowUpRight,ArrowDown,Search,Heart,MapPin,Sprout,BedDouble,UtensilsCrossed,Navigation,Stethoscope,Fuel,BusFront,Landmark,Store,Tent,LocateFixed,Download,Phone,ExternalLink,X,SlidersHorizontal,ShieldCheck,Flame,Ambulance} from "lucide-react";
import type {Map as LeafletMap,MarkerClusterGroup,Marker} from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import {servicePlaces, type ServicePlace} from "./service-data";
import "./valley-directory.css";
import {attractions} from "./attractions";
const cats=[
{id:"naturaleza",name:"Naturaleza",short:"Naturaleza",line:"Bosques, agua y paisajes.",icon:Sprout,img:""},
{id:"patrimonio",name:"Patrimonio",short:"Patrimonio",line:"Memoria de piedra.",icon:Landmark,img:""},
{id:"emergencias",name:"Servicios de emergencia",short:"Emergencias",line:"Contactos de ayuda y atención local.",icon:ShieldCheck,img:""},
{id:"sabores",name:"Fincas y sabores",short:"Sabores",line:"Conoce de dónde viene tu próxima taza.",icon:Sprout,img:"https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/world/tea-harvest-poster.jpg"},
{id:"dormir",name:"Dormir en el valle",short:"Dormir",line:"Dale una noche más a este paisaje.",icon:BedDouble,img:"https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/content/valley.jpg"},
{id:"comer",name:"Una pausa con sabor",short:"Comer",line:"Cocina local, té y conversación.",icon:UtensilsCrossed,img:"https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/world/coffee-process-poster.jpg"},
{id:"servicios",name:"A mano en el camino",short:"Servicios",line:"Lo que necesitas para seguir disfrutando.",icon:Navigation,img:"https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/world/huayopata-intro-poster.jpg"}
];
const norm=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const searchLink=(p:ServicePlace)=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.name+" "+p.area+" Huayopata Cusco Perú");
const routeLink=(p:ServicePlace)=>"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(p.lat!=null?p.lat+","+p.lng:p.name+" "+p.area+" Huayopata Cusco Perú");
function placeIcon(p:Pick<ServicePlace,"category"|"kind">){
 const kind=norm(p.kind);
 if(/comisaría|comisaria|policial|serenazgo|carretera/.test(kind))return ShieldCheck;
 if(/incendio|rescate/.test(kind))return Flame;
 if(/ambulancia/.test(kind))return Ambulance;
 if(/salud|posta|farmacia|hospital/.test(kind))return Stethoscope;
 if(/combustible|grifo/.test(kind))return Fuel;
 if(/transporte|terminal|paradero/.test(kind))return BusFront;
 if(/banco|cajero/.test(kind))return Landmark;
 if(/tienda|compras|mercado/.test(kind))return Store;
 if(/camping/.test(kind))return Tent;
 return cats.find(c=>c.id===p.category)?.icon||MapPin;
}
function Icon({place}:{place:Pick<ServicePlace,"category"|"kind">}){const C=placeIcon(place);return <C size={20} strokeWidth={2.1} aria-hidden="true"/>;}
const markerArt:Record<string,string>={
 naturaleza:'<path d="M3 20 9 6l5 9 3-5 4 10H3Z"/>',
 patrimonio:'<path d="M3 21h18M5 21V9m7 12V9m7 12V9M2 9h20L12 3 2 9Z"/>',
 sabores:'<path d="M5 8h12v7a6 6 0 0 1-12 0V8Zm12 1h2a3 3 0 0 1 0 6h-2M4 21h15M8 3v2m4-2v2"/>',
 dormir:'<path d="M3 18V8m0 6h18m0 4V9H3m2 0V5h6v4m2 0V5h6v4M3 18v2m18-2v2"/>',
 comer:'<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18m12-18c-4 2-5 6-5 10h5V3Zm0 10v8"/>',
 emergencias:'<path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4Z"/>',
 servicios:'<path d="M12 21s7-6 7-12A7 7 0 1 0 5 9c0 6 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>'
};
function pinArt(p:ServicePlace){const kind=norm(p.kind);const path=/salud|posta|farmacia|hospital/.test(kind)?'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"/>':/combustible|grifo/.test(kind)?'<path d="M4 21V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v17M4 9h11m-11 9h12m2-12 3 3v9a2 2 0 0 1-4 0v-5h-2M2 21h16"/>':markerArt[p.category]||markerArt.servicios;return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`}
const visitTip=(p:ServicePlace)=>p.category==="emergencias"?"Indica qué ocurrió, tu ubicación y cuántas personas necesitan ayuda.":p.category==="dormir"?"Consulta habitaciones, precio y horario de ingreso.":p.category==="comer"?"Consulta el horario de atención y el menú del día.":p.category==="sabores"?"Coordina la visita o degustación antes de acudir.":"Consulta atención, horario y disponibilidad antes de ir.";
export default function ValleyDirectory({contentRevision=0,active=true}:{contentRevision?:number;active?:boolean}){
 const [category,setCategory]=useState("atractivos"),[query,setQuery]=useState(""),[savedOnly,setSavedOnly]=useState(false),[saved,setSaved]=useState<string[]>([]),[ready,setReady]=useState(false),[selected,setSelected]=useState<ServicePlace|null>(null),[notice,setNotice]=useState(""),[expanded,setExpanded]=useState(false);
 const [mapReady,setMapReady]=useState(false),[tilesReady,setTilesReady]=useState(false),[mapError,setMapError]=useState(""),[loadMap,setLoadMap]=useState(false),[mapAttempt,setMapAttempt]=useState(0),[fit,setFit]=useState(0);
 const mount=useRef<HTMLDivElement>(null),map=useRef<LeafletMap|null>(null),layer=useRef<MarkerClusterGroup|null>(null),markers=useRef<Record<string,Marker>>({}),lib=useRef<typeof import("leaflet")|null>(null);
 const selectedRef=useRef(setSelected); selectedRef.current=setSelected;
 const places=useMemo(()=>[...attractions,...servicePlaces],[contentRevision]);
 const visible=useMemo(()=>places.filter(p=>(category==="todos"||(category==="atractivos"&&["naturaleza","patrimonio"].includes(p.category))||p.category===category)&&(!savedOnly||saved.includes(p.id))&&norm(p.name+" "+p.area+" "+p.kind+" "+p.description+" "+(p.phone||"")).includes(norm(query))),[category,query,savedOnly,saved,contentRevision]);
 const mapped=useMemo(()=>visible.filter(p=>p.lat!=null&&p.lng!=null),[visible]);
 const current=selected&&visible.some(p=>p.id===selected.id)?selected:null;
 useEffect(()=>{try{const s=JSON.parse(localStorage.getItem("hv-saved-services")||"[]");if(Array.isArray(s))setSaved(s.filter((id:unknown)=>typeof id==="string"&&places.some(p=>p.id===id)))}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem("hv-saved-services",JSON.stringify(saved))}catch{setNotice("No se pudo guardar en este navegador. Puedes descargar tus lugares.")}},[saved,ready]);
 useEffect(()=>{if(active)setLoadMap(true)},[active]);
 useEffect(()=>{if(!active||!loadMap||!mount.current)return;let cancelled=false;let observer:ResizeObserver|undefined;let tileTimeout:number|undefined;
 setMapReady(false);setTilesReady(false);setMapError("");
 import("leaflet").then(async ({default:L})=>{await import("leaflet.markercluster");if(cancelled||!mount.current)return;lib.current=L;const m=L.map(mount.current,{scrollWheelZoom:false,maxZoom:19}).setView([-13.007,-72.546],13);map.current=m;layer.current=L.markerClusterGroup({
  showCoverageOnHover:false,maxClusterRadius:64,spiderfyDistanceMultiplier:1.6,
  animate:!window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  iconCreateFunction:cluster=>{const count=cluster.getChildCount();return L.divIcon({className:"vd-cluster",iconSize:[52,52],html:`<span aria-label="${count} lugares cercanos. Acercar el mapa"><strong>${count}</strong><small>lugares</small></span>`})}
 }).addTo(m);
 const labelClusters=()=>mount.current?.querySelectorAll<HTMLElement>(".vd-cluster").forEach(el=>{el.setAttribute("aria-label",el.querySelector("span")?.getAttribute("aria-label")||"Acercar grupo de lugares")});
 m.on("layeradd zoomend",labelClusters);
 layer.current.on("animationend",labelClusters);
 const tiles=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'});
 tiles.on("load",()=>{if(!cancelled){window.clearTimeout(tileTimeout);setTilesReady(true);setMapError("")}});
 tiles.on("tileerror",()=>{if(!cancelled)setMapError("Algunas partes del mapa no cargaron. Puedes reintentar o consultar las fichas y direcciones.")});
 tiles.addTo(m);
 tileTimeout=window.setTimeout(()=>{if(!cancelled)setMapError("El mapa está tardando demasiado. Reintenta la carga; las fichas siguen disponibles.")},12000);
 observer=new ResizeObserver(()=>m.invalidateSize());observer.observe(mount.current);
 requestAnimationFrame(()=>{if(!cancelled){m.invalidateSize();setMapReady(true)}});

 }).catch(()=>{if(!cancelled)setMapError("No se pudo iniciar el mapa. Reintenta o utiliza las fichas para consultar los lugares.")});
 return()=>{cancelled=true;window.clearTimeout(tileTimeout);observer?.disconnect();map.current?.remove();map.current=null;lib.current=null;layer.current=null;markers.current={}}
 },[active,loadMap,mapAttempt]);
 useEffect(()=>{const L=lib.current,m=map.current,g=layer.current;if(!mapReady||!L||!m||!g)return;g.clearLayers();markers.current={};
 mapped.forEach((p,index)=>{const number=String(index+1).padStart(2,"0");const marker=L.marker([p.lat!,p.lng!],{title:`Punto ${number}: ${p.name}`,icon:L.divIcon({className:"vd-pin-wrap",html:`<span class="vd-pin vd-pin-${p.category}">${pinArt(p)}<span class="vd-pin-number">${number}</span></span>`,iconSize:[44,48],iconAnchor:[22,45]})}).addTo(g);const popup=document.createElement("div");const title=document.createElement("strong");title.textContent=p.name;const sub=document.createElement("p");sub.textContent=p.kind+" · "+p.area;const a=document.createElement("a");a.href=routeLink(p);a.target="_blank";a.rel="noreferrer";a.textContent="Cómo llegar ↗";const detail=document.createElement("p");detail.textContent=visitTip(p);popup.append(title,sub,detail,a);marker.bindPopup(popup);marker.on("click",()=>selectedRef.current(p));markers.current[p.id]=marker});
 if(mapped.length)m.fitBounds(L.latLngBounds(mapped.map(p=>[p.lat!,p.lng!])),{padding:[35,35],maxZoom:15,animate:false});
 },[mapReady,mapped,fit]);
 useEffect(()=>{
  const marker=current?markers.current[current.id]:undefined,m=map.current;
  let cancelled=false;
  Object.entries(markers.current).forEach(([id,item])=>item.getElement()?.classList.toggle("is-active",id===current?.id));
  if(marker&&m){
   const open=()=>{if(!cancelled&&current&&markers.current[current.id]===marker){const popup=marker.getPopup();if(popup)popup.setLatLng(marker.getLatLng()).openOn(m);marker.getElement()?.classList.add("is-active")}};
   const reveal=()=>{if(!cancelled)open()};
   m.setView(marker.getLatLng(),Math.max(m.getZoom(),17),{animate:false});
   requestAnimationFrame(reveal);
  }
  return()=>{cancelled=true};
 },[current,mapReady,mapped]);
 function choose(id:string){setCategory(id);setQuery("");setSavedOnly(false);setSelected(null);document.getElementById("resultados-servicios")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}
 function selectPlace(p:ServicePlace){setSelected(p);if(window.innerWidth<=760)requestAnimationFrame(()=>document.querySelector(".vd-detail")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"}))}
 function toggle(p:ServicePlace){setSaved(s=>s.includes(p.id)?s.filter(id=>id!==p.id):[...s,p.id]);setNotice(saved.includes(p.id)?"Lugar retirado de tus guardados.":"Lugar guardado en este navegador.")}
 function download(){const list=places.filter(p=>saved.includes(p.id));const t=["MIS LUGARES · HUAYOPATA VIVA","Confirma atención y acceso antes de visitar.",...list.map(p=>p.name+"\n"+p.area+"\n"+routeLink(p)+"\n"+(p.phone||"")+"\n"+p.source)].join("\n\n");const url=URL.createObjectURL(new Blob([t],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="Mis-lugares-Huayopata.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice("Tus lugares están descargados. Los mapas necesitan conexión.")}
 function locate(){if(!navigator.geolocation){setNotice("Tu navegador no ofrece ubicación.");return}setNotice("Buscando tu ubicación…");navigator.geolocation.getCurrentPosition(pos=>{const L=lib.current,m=map.current;if(!L||!m)return;L.circleMarker([pos.coords.latitude,pos.coords.longitude],{radius:8}).addTo(m).bindPopup("Tu ubicación aproximada").openPopup();m.setView([pos.coords.latitude,pos.coords.longitude],14);setNotice("Ubicación mostrada. No se guarda en este sitio.")},()=>setNotice("No se pudo obtener tu ubicación. Puedes explorar el mapa manualmente."),{timeout:10000,maximumAge:60000})}
 return <section className="vd" id="quedate" aria-labelledby="stay-title">
 <div className="vd-intro"><div className="vd-intro-copy"><span className="vd-eyebrow">04 / HAZLE UN ESPACIO AL VALLE</span><h2 id="stay-title">Quédate<br/><em>un rato.</em><span className="vd-sun">✳</span></h2><p>A veces, lo mejor del camino es la pausa.<br/>Una taza recién hecha. Una mesa compartida.<br/>Un lugar donde despertar entre montañas.</p><a className="vd-primary" href="#mapa-servicios">Encuentra tu próxima parada <ArrowDown size={18}/></a><div className="vd-intro-foot"><span>HUAYOPATA, CUSCO</span><span>Saborea. Descansa. Descubre.</span></div></div><figure className="vd-cover"><img src="https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/world/tea-harvest-poster.jpg" alt="Cosecha de hojas de té en el valle" loading="lazy"/><figcaption><span>EL VALLE SE CONOCE DESPACIO</span><strong>Donde una hoja<br/>se vuelve historia.</strong></figcaption><span className="vd-stamp">HECHO<br/>DE PAUSAS<br/>Y ENCUENTROS</span></figure></div>
 <div className="vd-categories">{cats.filter(c=>!["emergencias","naturaleza","patrimonio"].includes(c.id)).map((c,i)=><button key={c.id} className={"vd-category vd-category-"+c.id} onClick={()=>choose(c.id)}><div className="vd-category-picture"><img src={c.img} alt="" loading="lazy"/><span>0{i+1}</span><ArrowUpRight/></div><div className="vd-category-title"><c.icon size={22}/><h3>{c.name}</h3></div><p>{c.line}</p><span className="vd-category-count">{servicePlaces.filter(p=>p.category===c.id).length} lugares para explorar <span>→</span></span></button>)}</div>
 <div className="vd-directory" id="directorio-del-valle"><div className="vd-directory-head"><div><span className="vd-eyebrow">EL VALLE, CERCA DE TI</span><h2>Una buena parada.<br/><em>Justo por aquí.</em></h2></div><p>Descubre atractivos y servicios de Huayopata. Acerca el mapa o filtra por categoría. Toca un punto o una ficha para conocer el lugar y abrir las indicaciones.</p></div>

 <div className="vd-map-entry" id="mapa"><span id="mapa-servicios" className="vd-anchor" aria-hidden="true"/>
 <div className="vd-map-access"><p>Los números de la lista coinciden con los puntos del mapa. Toca un grupo para acercarte.</p><a href="#emergencias"><ShieldCheck size={17}/> Contactos de emergencia</a></div>
 <div className="vd-controls" id="resultados-servicios"><label className="vd-search"><Search size={20}/><span className="vd-sr">Buscar servicios</span><input placeholder="Busca un atractivo, té, un lodge…" value={query} onChange={e=>{setQuery(e.target.value);setSelected(null)}}/>{query&&<button aria-label="Limpiar búsqueda" onClick={()=>setQuery("")}><X size={17}/></button>}</label><button className="vd-saved" aria-pressed={savedOnly} onClick={()=>{setSavedOnly(!savedOnly);setSelected(null)}}><Heart size={18}/> Guardados <b>{saved.length}</b></button><button className="vd-download" disabled={!saved.length} onClick={download} aria-label="Descargar lugares guardados"><Download size={18}/><span>Descargar</span></button></div>
 <div className="vd-filters" aria-label="Filtrar servicios">{[{id:"atractivos",short:"Atractivos"},{id:"todos",short:"Todos"},...cats].map(c=><button key={c.id} aria-pressed={category===c.id} onClick={()=>{setCategory(c.id);setSelected(null)}}>{c.short}<span>{c.id==="todos"?places.length:c.id==="atractivos"?attractions.length:places.filter(p=>p.category===c.id).length}</span></button>)}</div>
 <div className={"vd-map-layout"+(expanded?" vd-expanded":"")}><div className="vd-results"><div className="vd-result-count" aria-live="polite"><SlidersHorizontal size={15}/>{visible.length} fichas · {mapped.length} puntos en el mapa</div><div className="vd-list">{visible.map(p=><article key={p.id} className={"vd-result"+(current?.id===p.id?" is-selected":"")}><button className="vd-select" onClick={()=>selectPlace(p)} aria-pressed={current?.id===p.id}><span className={"vd-list-icon vd-color-"+p.category}><Icon place={p}/></span><span><small>{p.kind} · {p.area}</small><strong>{p.name}</strong><span className="vd-location-label">{p.contactOnly?"Atención telefónica · "+(p.phoneDisplay||p.phone):p.lat!=null?<>Punto {String(mapped.findIndex(item=>item.id===p.id)+1).padStart(2,"0")} · Ubicado en el mapa</>:"Ubicación exacta por confirmar"}</span></span></button><button className="vd-heart" aria-label={(saved.includes(p.id)?"Quitar guardado: ":"Guardar: ")+p.name} aria-pressed={saved.includes(p.id)} onClick={()=>toggle(p)}><Heart size={19} fill={saved.includes(p.id)?"currentColor":"none"}/></button></article>)}{!visible.length&&<div className="vd-empty"><Search/><h3>No encontramos esa parada</h3><p>Prueba otro nombre o explora todas las categorías.</p><button onClick={()=>{setQuery("");setCategory("todos");setSavedOnly(false)}}>Mostrar todos los lugares</button></div>}</div></div>
 <div className="vd-map-side"><div className="vd-map-tools"><span><MapPin size={15}/> Huayopata · Perú</span><div><button disabled={!mapReady} onClick={()=>setFit(x=>x+1)}>Ver puntos</button><button disabled={!mapReady} onClick={locate} aria-label="Mostrar mi ubicación"><LocateFixed size={18}/></button><button onClick={()=>setExpanded(!expanded)} aria-pressed={expanded}>{expanded?"Reducir":"Ampliar"}</button></div></div><div className="vd-map" ref={mount} aria-label="Mapa interactivo de servicios de Huayopata"/>{(!mapReady||!tilesReady)&&!mapError&&<div className="vd-map-loading" role="status">Preparando el mapa del valle…</div>}{mapError&&<div className="vd-map-recovery" role="status"><p>{mapError}</p><button onClick={()=>{setMapError("");setMapAttempt(v=>v+1)}}>Reintentar mapa ↻</button></div>}
 <div className="vd-detail" aria-live="polite">{current?<><div className="vd-detail-head"><span className={"vd-list-icon vd-color-"+current.category}><Icon place={current}/></span><div><small>{current.kind} · {current.area}</small><h3>{current.name}</h3></div><button aria-label="Cerrar ficha" onClick={()=>setSelected(null)}><X size={18}/></button></div>{current.image&&<img className="vd-detail-photo" src={current.image} alt={"Imagen del capítulo "+current.name} loading="lazy"/>}<p>{current.description}</p>{current.topic&&<a className="vd-topic-link" href={sitePath("/descubre/"+current.topic)}>Explorar esta historia <ArrowUpRight size={17}/></a>}<div className="vd-place-facts"><div><span>UBICACIÓN</span><strong>{current.area}</strong><small>{current.lat!=null?`${current.lat.toFixed(5)}, ${current.lng?.toFixed(5)}`:current.contactOnly?"Contacto telefónico; sin marcador en el mapa":"Punto exacto por confirmar"}</small></div><div><span>{current.category==="emergencias"?"AL PEDIR AYUDA":"ANTES DE VISITAR"}</span><strong>{visitTip(current)}</strong><small>{current.category==="emergencias"?"Sigue las indicaciones del operador.":"Horario y disponibilidad no confirmados."}</small></div></div>{current.lat==null&&!current.contactOnly&&<p className="vd-unlocated">Sin punto confirmado en este mapa. Consulta la ubicación con el establecimiento.</p>}<div className="vd-detail-actions">{!current.contactOnly&&<a className="vd-primary" href={current.lat!=null?routeLink(current):searchLink(current)} target="_blank" rel="noreferrer"><Navigation size={16}/>{current.lat!=null?"Cómo llegar":"Buscar ubicación"}</a>}{current.phone&&<a href={"tel:"+current.phone}><Phone size={16}/> Llamar {current.phoneDisplay||current.phone}</a>}{current.whatsapp&&<a href={current.whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>}<button onClick={()=>toggle(current)}><Heart size={16}/>{saved.includes(current.id)?"Guardado":"Guardar"}</button></div><div className="vd-source"><span>Fuente: </span><a href={current.source} target="_blank" rel="noreferrer">{current.sourceLabel} <ExternalLink size={12}/></a><span> · {current.note}</span>{current.coordinateSource&&<a href={current.coordinateSource} target="_blank" rel="noreferrer"> Referencia cartográfica ↗</a>}{current.phoneSource&&<a href={current.phoneSource} target="_blank" rel="noreferrer"> Fuente del teléfono ↗</a>}</div></>:<div className="vd-map-invite"><MapPin/><div><h3>Tu próxima pausa empieza con un punto.</h3><p>Selecciona un lugar. Aquí encontrarás cómo llegar, su referencia y el contacto disponible.</p></div></div>}</div></div></div>
 {contentStatus==="backup"&&<p role="status" className="vd-notice">Mostrando la copia guardada de los servicios; no se pudo consultar la base de datos.</p>}<div className="vd-map-foot"><a href={sitePath("/calendario/")}>Celebraciones del distrito · Calendario vivo ↗</a><p>Selección de referencias públicas, con mayor cobertura en Huyro y el corredor de Amaybamba. No es un censo completo ni indica disponibilidad en tiempo real. Confirma atención antes de ir.</p><a href={sitePath("/servicios-huayopata.json")} download>Datos y fuentes ↓</a><a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noreferrer">Corregir un punto ↗</a></div><p className="vd-notice" role="status">{notice}</p>
 </div>
 <section className="vd-emergency" id="emergencias" aria-labelledby="emergency-title"><div className="vd-emergency-heading"><ShieldCheck size={30}/><div><span className="vd-eyebrow">AYUDA A MANO</span><h3 id="emergency-title">Servicios de emergencia</h3><p>Contactos oficiales para llamar desde Perú. Indica qué ocurrió, dónde estás y cuántas personas necesitan ayuda.</p></div></div><div className="vd-emergency-contacts">{servicePlaces.filter(p=>p.category==="emergencias"&&p.phone).map(p=><article key={p.id}><div className="vd-emergency-label"><Icon place={p}/><small>{p.area}</small></div><h4>{p.name}</h4><a className="vd-emergency-call" href={"tel:"+p.phone} aria-label={"Llamar a "+p.name+": "+(p.phoneDisplay||p.phone)}><Phone size={18}/>{p.phoneDisplay||p.phone}</a><p>{p.description}</p><a className="vd-emergency-source" href={p.phoneSource||p.source} target="_blank" rel="noreferrer">Fuente oficial <ExternalLink size={12}/></a></article>)}</div><div className="vd-emergency-foot"><span>Consulta de fuentes: 28/09/2026. La cobertura y disponibilidad de respuesta dependen de cada servicio.</span><button onClick={()=>choose("emergencias")}>Ver establecimientos y contactos en el directorio <ArrowDown size={16}/></button></div></section>
 </div>
 <div className="vd-useful"><div><span className="vd-eyebrow">MENOS VUELTAS, MÁS VALLE</span><h2>Lo útil,<br/><em>a un toque.</em></h2></div><button onClick={()=>{choose("emergencias");setQuery("Salud")}}><span>01 / SI LO NECESITAS</span><strong>Encontrar atención de salud</strong><ArrowUpRight/></button><button onClick={()=>{choose("servicios");setQuery("Transporte")}}><span>02 / SIGUE EL CAMINO</span><strong>Ubicar transporte local</strong><ArrowUpRight/></button><button onClick={()=>{choose("servicios");setQuery("Combustible")}}><span>03 / ANTES DE SALIR</span><strong>Buscar un grifo</strong><ArrowUpRight/></button></div>
 </section>
}
