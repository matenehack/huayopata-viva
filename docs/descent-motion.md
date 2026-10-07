# Descender de la montaña al valle

## Paso 1 · Abra Málaga (7 de octubre de 2026)
- La portada conserva sus vídeos y crossfades. No se superpone otra animación al vídeo.
- En la guía de Abra Málaga, transición cromática continua entre altura y biodiversidad.
- Una sola capa decorativa de niebla, ligada al scroll mediante CSS view timeline. Solo anima opacidad y desplazamiento de 32 px en total; sin temporizadores, blur, parallax de fotografías ni listeners adicionales.
- Textos y elementos de lectura permanecen estables; se neutralizan sus revelados individuales en este tramo.
- Sin soporte de scroll timeline: degradado estático. Reduced motion: sin desplazamiento ni animación.
- Las rutas de 1/2/3 días no cambian.

## Próximos pasos (no implementados todavía)
2. Bosque, fauna y flora: una entrada orgánica del conjunto fotográfico, sin mover títulos ni controles.
3. Té y café: un trazo botánico por sección, sin superponerlo al vídeo.
4. Patrimonio, comunidades y calendario: graduar el ritmo y color.
5. Planifica: estabilizar la interfaz y retirar efectos decorativos.

Verificación de esta entrega: TypeScript, build y test:calendar. Revisar la guía pública tras GitHub Actions. No se afirma una auditoría completa de cinco anchos de pantalla.
