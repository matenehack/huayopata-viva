# Huayopata Viva

Sitio turístico independiente para Huayopata, Cusco. Código en GitHub, contenido y archivos audiovisuales en Supabase.

## Desarrollo

Node 22 o superior:

```bash
npm ci
npm run dev
npm run build
```

Los servicios, cinco capítulos y 45 archivos multimedia están en el proyecto Supabase `rhghpitzpdstrraxuogz` (São Paulo). La web lee tablas `places` y `chapters` mediante una clave pública de solo lectura. Si falla la conexión, muestra el contenido guardado en el código y avisa al visitante. Las fotos y videos públicos se sirven desde el bucket `huayopata-media`, incluido el video de Huamanmarca. Se conserva una copia original del sitio en el bucket privado `migration-backups`.

Las fuentes de lugares y teléfonos constan en cada registro. No constituyen disponibilidad en tiempo real. El mapa usa OpenStreetMap/Leaflet y carga al solicitarlo.

## Publicación

El flujo **Build and verify** compila el sitio en cada actualización. **Publish GitHub Pages** es manual y prepara la ruta `/huayopata-viva/`. Activa GitHub Pages con origen **GitHub Actions** para habilitarlo. Una rama o dominio propio puede usar `BASE_PATH=/` en la compilación. Hay copias HTML de las cinco historias para abrir sus URL directamente.

## Datos y seguridad

`supabase/001_content.sql` reproduce el esquema y las políticas de solo lectura pública. `supabase/seed-content.json` conserva una exportación editable de los datos. Para actualizar tablas tras cambiarla, ejecuta `SUPABASE_SERVICE_ROLE_KEY=... npm run seed` en un entorno confiable; esa clave jamás va al navegador ni al repositorio. Los cambios hechos en Supabase se aplican en la web al volver a abrirla. Actualiza también la copia del código si cambias contenido importante para que el modo sin conexión esté vigente.

Los videos y fotografías viven en Storage; los dos pósteres de la portada también se guardan localmente para que la primera imagen aparezca de inmediato. El archivo original de Higgsfield está respaldado de forma privada en Supabase; la nueva web no utiliza sus rutas de publicación ni requiere iniciar sesión allí.
