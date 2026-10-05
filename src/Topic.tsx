import {TopicExperience,TopicFilm,useEditorialReveal} from './Editorial';
import SiteHeader from './SiteHeader';
import topicCopy from './topic-copy.json';
import './factual-editorial.css';
import { sitePath } from "@/lib/site";
export type Topic = {
  number: string; title: string; eyebrow: string; intro: string; image: string; imageAlt: string;
  passage: string; steps: { title: string; body: string }[];
  visit: string[]; sources: { title: string; url: string }[];
};

export const topics: Record<string, Topic> = {
  "abra-malaga": {
    number: "01", eyebrow: "EL UMBRAL DEL VALLE", title: "Abra Málaga: donde cambia el paisaje",
    intro: "El descenso desde la altura andina hacia la ceja de selva permite ver cómo cambian el aire, la vegetación y el ritmo del camino.",
    image: "https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/content/valley.jpg", imageAlt: "Montañas y vegetación del valle",
    passage: "Haz del trayecto parte de la visita: mira la transición entre pisos ecológicos y detente solo en espacios seguros. La niebla y la lluvia pueden transformar las condiciones del recorrido.",
    steps: [
      { title: "Mirar la transición", body: "Observa cómo la vegetación se vuelve más densa durante el descenso hacia Huayopata." },
      { title: "Buscar miradores", body: "Consulta los accesos y las condiciones del día antes de detenerte o emprender una caminata." },
      { title: "Seguir hacia el valle", body: "Desde la ruta puedes continuar hacia Huyro, sus cultivos y el patrimonio de Amaybamba." },
    ],
    visit: ["Lleva abrigo, impermeable y protección solar: el clima cambia con la altitud.", "Para ciclismo o senderismo, coordina con un operador local y verifica la vía.", "No te detengas en curvas o zonas sin espacio seguro."],
    sources: [{ title: "Inventario turístico: Abra Málaga", url: "https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=3700" }],
  },
  te: {
    number: "02", eyebrow: "HOJAS DE ALTURA", title: "El mundo del té de Huayopata",
    intro: "Un cultivo que se entiende mejor al conocer a quienes lo cosechan, transforman y comparten en el valle.",
    image: "https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/content/tea.jpg", imageAlt: "Cultivo de té en una ladera verde",
    passage: "Una visita al té puede unir campo y taza. Pregunta por el manejo del cultivo, la cosecha de hojas tiernas, el procesamiento y las distintas formas de prepararlo. Cada productor tiene su propia historia.",
    steps: [
      { title: "En el cultivo", body: "Conoce las plantas y el trabajo que requiere seleccionar las hojas. Entra a la parcela solo con autorización." },
      { title: "De la hoja al té", body: "Pregunta cómo se procesan las hojas y por qué cambian aroma y sabor según la elaboración." },
      { title: "En la taza", body: "Prueba diferentes preparaciones y, si te gusta, compra directamente al productor." },
    ],
    visit: ["Coordina la visita antes de ir: las fincas son espacios de trabajo.", "Pregunta si hay demostraciones o degustaciones disponibles ese día.", "Respeta los tiempos de cosecha y pide permiso para fotografiar."],
    sources: [{ title: "Municipalidad de Huayopata: ordenanza sobre el té", url: "https://www.gob.pe/institucion/munihuayopata/informes-publicaciones/7301949-ordenanza-municipal-n-012-2025-mdh-lc" }],
  },
  cafe: {
    number: "03", eyebrow: "FRUTO ROJO", title: "Mundo cafetalero",
    intro: "Hay mucho más detrás de una taza: un fruto que madura en el campo, decisiones durante el beneficio y el trabajo de productores del valle.",
    image: "https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/content/coffee.jpg", imageAlt: "Cosecha de café en una finca",
    passage: "La mejor manera de acercarse al café de Huayopata es conversar con quien lo cultiva. Recorre un cafetal cuando esté abierto a visitas y sigue la historia desde la cereza hasta la bebida.",
    steps: [
      { title: "La cereza", body: "Descubre cómo se reconoce el fruto maduro y por qué la selección influye en el resultado." },
      { title: "El proceso", body: "Pregunta al productor por el despulpado, la fermentación, el lavado o el secado que aplica a su café." },
      { title: "La taza", body: "Compara aromas y sabores en una degustación y conoce quién produjo los granos." },
    ],
    visit: ["La cosecha y las actividades cambian según la temporada; confirma antes de salir.", "Consulta si la finca ofrece recorrido, demostración o degustación.", "Compra café de origen directamente cuando sea posible."],
    sources: [{ title: "Experiencia de café en Huayopata", url: "https://andeanmagictravel.com/es/tours/ruta-del-cafe-privada/" }],
  },
  wamanmarka: {
    number: "04", eyebrow: "MEMORIA DE PIEDRA", title: "Wamanmarka: historia en el camino",
    intro: "Un sitio arqueológico del valle de Amaybamba que invita a mirar la arquitectura inca y el paisaje como una sola historia.",
    image: "https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/content/wamanmarka.jpg", imageAlt: "Recinto de piedra de Wamanmarka entre montañas",
    passage: "El inventario turístico de MINCETUR describe recintos alrededor de un patio y un ushnu. Una visita pausada permite reconocer los espacios y pensar en los caminos que conectaban el territorio.",
    steps: [
      { title: "Leer el lugar", body: "Observa la disposición de los muros y el patio central sin subir a las estructuras." },
      { title: "Escuchar la memoria", body: "Busca una guía local para conocer los relatos y el contexto del sitio." },
      { title: "Cuidar el patrimonio", body: "No retires piedras ni dejes residuos. Sigue las indicaciones de acceso vigentes." },
    ],
    visit: ["Confirma el acceso y las condiciones de la vía antes de partir.", "Lleva calzado adecuado y protección para sol o lluvia.", "Evita tocar o alterar estructuras arqueológicas."],
    sources: [{ title: "Inventario turístico oficial: Wamanmarka", url: "https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=6915" }],
  },
  comunidades: {
    number: "05", eyebrow: "EL VALLE VIVO", title: "Gente, sabores y celebraciones",
    intro: "Huayopata también se conoce en las conversaciones, la mesa y las expresiones culturales de quienes habitan el distrito.",
    image: "https://rhghpitzpdstrraxuogz.supabase.co/storage/v1/object/public/huayopata-media/assets/content/culture.jpg", imageAlt: "Encuentro cultural y vida comunitaria",
    passage: "Acércate a productores, mercados y celebraciones con curiosidad y respeto. El calendario y las actividades pueden variar: confirma la información local antes de organizar una visita en torno a una fiesta.",
    steps: [
      { title: "Probar el valle", body: "Pregunta por productos de temporada, cocina local y pequeñas iniciativas familiares." },
      { title: "Conocer a sus productores", body: "El té, el café y el cacao ofrecen distintas formas de conversar sobre el trabajo del territorio." },
      { title: "Vivir una celebración", body: "Consulta el programa oficial de las fiestas y sigue las indicaciones de la comunidad anfitriona." },
    ],
    visit: ["Pide permiso antes de fotografiar personas o espacios privados.", "Apoya negocios y productores locales cuando visites.", "Consulta fechas y horarios con la municipalidad o los organizadores."],
    sources: [{ title: "Municipalidad Distrital de Huayopata", url: "https://www.munihuayopata.gob.pe/" }],
  },
};

for(const [id,copy] of Object.entries(topicCopy))Object.assign(topics[id],copy);

const chapterIds: Record<string, string> = { "abra-malaga": "abra", te: "tea", cafe: "coffee", wamanmarka: "wamanmarka", comunidades: "community" };
const topicImage=(key:string)=>sitePath("assets/content/"+({"abra-malaga":"valley",te:"tea",cafe:"coffee",wamanmarka:"wamanmarka",comunidades:"culture"}[key]||"valley")+".webp");
const order = ["abra-malaga", "te", "cafe", "wamanmarka", "comunidades"];
export default function TopicPage({tema}:{tema:string}) {
  useEditorialReveal(tema);
  const topic = topics[tema];
  if (!topic) return <main className="hv-story-page hv-story-missing"><a href={sitePath("/")}>← Volver a Huayopata Viva</a><h1>Esta historia aún no está disponible.</h1></main>;
  return <main className={"hv-story-page hv-topic-"+tema}>
    <SiteHeader section="stories"/><a className="hv-story-back" href={sitePath(`/#${chapterIds[tema]}`)}>← Volver al recorrido cinematográfico</a>
    <section className="hv-story-hero" style={{ backgroundImage: `url('${topicImage(tema)}')` }} aria-labelledby="story-title">
      <div><span>{topic.number} · {topic.eyebrow}</span><h1 id="story-title">{topic.title}</h1><p>{topic.intro}</p><a href="#historia">Consultar información ↓</a></div>
    </section>
    <nav className="hv-story-toc" aria-label="Contenido de esta historia"><a href="#historia">Datos del lugar</a><a href="#experiencias">Actividades</a><a href="#visita">Antes de ir</a></nav>
    <section className="hv-story-intro" data-reveal id="historia"><span>HUAYOPATA · CUSCO</span><p>{topic.passage}</p></section>
    <TopicExperience tema={tema}/>{tema!=='te'&&tema!=='cafe'&&<TopicFilm tema={tema}/>}
    <section className="hv-story-visit" data-reveal id="visita" aria-labelledby="visit-title"><div><span>ANTES DE IR</span><h2 id="visit-title">Prepara la visita.</h2><p>Confirma acceso, atención y condiciones del recorrido.</p><a href={sitePath(tema==="te"||tema==="cafe"?`/?tema=${tema}#mapa`:"/#mapa")}>{tema==="te"?"Consultar lugares relacionados con el té":tema==="cafe"?"Consultar lugares relacionados con el café":"Ver mapa y servicios"} ↗</a></div><ul>{topic.visit.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section className="hv-story-next" aria-labelledby="next-title"><div className="hv-story-section-title"><span>CONTINÚA</span><h2 id="next-title">Otros temas de Huayopata.</h2></div><div>{order.filter(key => key !== tema).map(key => <a key={key} href={sitePath(`/descubre/${key}`)}><img src={topicImage(key)} alt="" loading="lazy"/><span>{topics[key].number}</span><strong>{topics[key].title}</strong><span aria-hidden="true">↗</span></a>)}</div></section>
    <footer className="hv-story-footer"><a href={sitePath("/")}>HUAYOPATA VIVA ↑</a><div><span>FUENTES DE INFORMACIÓN</span>{topic.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</div><small>Información orientativa. Confirma accesos y actividades localmente.</small></footer>
  </main>;
}
