# Huayopata celebra · Calendario vivo

Ruta pública: https://matenehack.github.io/huayopata-viva/calendario/

## Publicación editorial inicial · 29 septiembre 2026

29 fichas: las 16 celebraciones solicitadas, diez aniversarios institucionales y tres efemérides educativas nacionales. Se distinguen la fecha de referencia, los componentes documentados y el programa de una edición. Ninguna actividad futura se ha declarado confirmada.

- Unu Raymi: 22 marzo, inventario MINCETUR. Registro histórico de 2023.
- Huamanmarca Raymi: segundo domingo de junio, inventario MINCETUR de 2024. Escenificación, concurso de danzas educativas y muestra gastronómica descritos como componentes tradicionales, sin fecha ni hora de próxima edición.
- Aniversario distrital: 19 junio, saludo institucional de La Convención de 2025.
- Virgen del Carmen: 16 julio, ficha MINCETUR 13004, Huyro; el calendario histórico también menciona Amaybamba.
- Watunakuy: fecha variable; el inventario de Wamanmarka menciona agosto, un programa de 2021 lo ubica en junio. No ocupa un día ficticio.
- Expoferia: fecha por confirmar, Estadio Municipal de Huyro. Producción agroindustrial y pecuaria, gastronomía y pasacalles descritos en el inventario, sin convocatoria futura.
- Candelaria (2 febrero), Santísima Cruz (3 mayo), Asunta (15 agosto, Huyro), Santa Rosa (30 agosto), Señor de Huanca (14 septiembre), San Cipriano (23 septiembre, Sicre), Fátima (13 octubre, Huayopata Chonta), Señor de los Milagros (18 octubre, Amaybamba), Todos los Santos (1 noviembre), San Martín de Porres (3 noviembre, Zorrapata): referencias históricas de la tabla 16 de la investigación universitaria de 2017. La vigencia, localidad precisa y organización requieren ratificación municipal/comunitaria. No se sustituyen por fechas de otros distritos.
- Educación Inicial: 25 mayo. Primaria: 12 noviembre, RM 460-2022. Secundaria: 27 octubre, RM 436-2024. Son efemérides nacionales, no convocatorias de actividades locales.

Cada ficha contiene sus enlaces de fuente, procedencia y fecha de revisión. El respaldo completo está en `src/calendar/seed.json`.

## Instituciones identificadas

| Institución | Código modular | Localidad | Aniversario |
|---|---|---|---|
| José Carlos Mariátegui | 0236380 | Huyro | 14 junio, documentado en 2018 |
| 50275 | 0407619 | Huyro | Por confirmar |
| Leoncio Prado | 0621367 | Huayopata Rodeo | Por confirmar |
| Coronel Francisco Bolognesi | 0699678 | Amaybamba | Por confirmar |
| 50260 | 0407460 | San Pablo | Por confirmar |
| 50261 | 0407478 | Lauramarca | Por confirmar |
| 50274 | 0407601 | Ipal Pirhua | Por confirmar |
| 50748 | 0205229 | Alfamayo | Por confirmar |
| 50751 | 0205252 | Amaybamba | Por confirmar |
| 501093 | 0615377 | Huamanmarca | Por confirmar |

Identificación: documento UGEL La Convención de distribución de materiales de 2022. Nombres de localidad normalizados: el documento escribe Huayopata para Leoncio Prado e Ipalpilhua para 50274. Su vigencia actual y la nomenclatura deben ratificarse con las direcciones. El Congreso documenta las Bodas de Oro del José Carlos Mariátegui **de Huyro** el 14 junio de 2018; no se usaron colegios homónimos.

## Fotografía documental

[Wamanmarka, 2007, AgainErick](https://commons.wikimedia.org/wiki/File:Huamanmarka_Archaeological_site.jpg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Autoría, procedencia, licencia, autorización por licencia pública, significado y modificaciones registrados en `event_media`. Versiones WebP de 1600 px y 640 px alojadas en el bucket existente `huayopata-media/assets/calendar/`. Redimensionado sin cambios de contenido. Las versiones derivadas conservan CC BY-SA 3.0.

La portada representa Wamanmarka, un lugar real del distrito. La ficha de Huamanmarca Raymi identifica expresamente que la imagen muestra el lugar y **no una edición del evento**. El resto de tarjetas usa diseño editorial, sin fotografías ajenas ni imágenes generadas que pretendan documentar fiestas. Las fotos y videos auténticos de las celebraciones y escuelas están pendientes de autorización y registro.

## Gestión en Supabase

Migración aditiva aplicada: `supabase/002_calendar.sql`. Conserva `places`, `chapters`, `media_assets` y el bucket existente. Cinco tablas relacionadas: `calendar_events`, `event_activities`, `event_media`, `event_organizers`, `educational_institutions`. Los registros contienen `data` JSONB editable en Supabase y campos de relación con restricciones. Todas tienen RLS y solo lectura pública de filas publicadas; actividades y medios exigen además un evento padre publicado. No hay políticas públicas de escritura ni claves privadas en React.

El calendario consulta las cinco tablas y renderiza inmediatamente el respaldo local. Si la red falla, una tabla no responde o los registros son inválidos, conserva el respaldo completo e indica ese estado. No altera la carga de las cinco historias y el directorio existentes.

Para editar desde una conexión administrativa autorizada:

1. Crear/actualizar el organizador y la institución, si corresponden.
2. Crear/editar `calendar_events.data` conservando los nombres del modelo `src/calendar/model.ts`. Mantener `id`, `slug`, `organizerId` e `institutionId` coherentes con las columnas. Guardar la fuente original.
3. Para fechas fijas: `dateRule: {kind: "annual", month: 7, day: 16}`. Para fechas variables sin anuncio: `{kind: "unknown"}`. Para una edición confirmada y rango real: `{kind: "one-off", start: "AAAA-MM-DD", end: "AAAA-MM-DD"}`.
4. Para estados confirmado/reprogramado/cancelado/finalizado en recurrencias anuales, registrar `editionYear`. La interfaz no transfiere la confirmación de un año al siguiente.
5. Registrar actividades independientes en `event_activities`: nombre, fecha ISO, hora, lugar, descripción, categoría, organizador, estado y enlace de fuente. Una actividad confirmada requiere fecha, hora y fuente HTTPS.
6. Registrar medios con autor, licencia, fuente, autorización, fecha/contexto y modificaciones. No publicar imágenes sin derechos verificados; subir archivos permitidos mediante un acceso administrativo a Storage.
7. Revisar y cambiar `published` a true. Los visitantes reciben los cambios al abrir de nuevo la página, sin editar React. Los programas pendientes no inventan horarios.

La actualización del contenido de rutas existentes no requiere código. **Crear un slug nuevo** requiere regenerar las páginas estáticas para que GitHub Pages atienda la recarga directa con HTTP 200. El build genera el calendario y las 29 fichas iniciales; `404.html` conserva el fallback React para otros slugs. Para mantener también el respaldo y el listado de rutas al añadir nuevas fichas, sincronizar `seed.json` mediante una revisión en GitHub. Un futuro panel municipal podrá automatizarlo; no se ha creado un panel de acceso público.

## Pruebas reproducibles

- `npm run typecheck`
- `BASE_PATH=/huayopata-viva/ npm run build`
- `node tests/calendar.mjs`
- `PLAYWRIGHT_MODULE=<ruta a playwright> CHROMIUM_EXECUTABLE=<ruta a Chromium> node tests/calendar-browser.cjs`

Las pruebas de navegador usan respuestas controladas para filtros, estados, fallos y 29 rutas, independientes de los cambios editoriales del servidor. La conexión real a Supabase y Storage se comprueba por separado, incluyendo rechazo de escritura anónima. Revisar también la publicación real después de GitHub Actions.

## Recursos solicitados a responsables locales

Programas oficiales con año, fecha/hora, escenario, responsable y estado; ratificación de fechas y localidades de las referencias de 2017; nueve aniversarios escolares y documentación institucional actual; coordenadas verificadas de escenarios/escuelas; fotografías y videos locales con autoría y licencia/autorización de publicación, especialmente Plaza de Huyro, Carmen, Unu Raymi, Expoferia, comunidades y escuelas. Para imágenes de personas y estudiantes, aportar las autorizaciones correspondientes. No se han inventado teléfonos ni puntos geográficos.

## Validación de esta entrega

Typecheck y build con base de GitHub Pages correctos. Pruebas de reglas de recurrencia (incluido segundo domingo), rangos entre meses, estados por edición, fechas desconocidas y metadatos de fuentes/derechos correctas. Pruebas de navegador en 1440 px y 390 px: filtros, selección del día, agenda, diez instituciones, 29 fichas con recarga directa, programa pendiente, descarga ICS y navegación por teclado; sin errores JavaScript ni desbordamiento horizontal. Respaldo probado con red interrumpida y respuesta malformada.

Regresión de cinco historias, etapas del té/café, Wamanmarka, mapa, favoritos, siete contactos de emergencia, menú móvil y cortina una sola vez: correcta. Supabase real devuelve 29 eventos, diez instituciones, seis componentes, un registro de imagen y 13 organizadores; la escritura anónima se rechaza (401). Ambas imágenes WebP responden HTTP 200. Advisor de seguridad: cero alertas. Los recursos existentes permanecen en 45 servicios y cinco capítulos.

Publicación comprobada en la URL oficial: portada con imagen real cargada (1600 px), estado «Contenido conectado a Supabase» y selección de junio de 2027 con tres referencias. GitHub Actions completó build y publicación correctamente. Se comprobó que las recargas directas de todas las fichas responden HTTP 200.
