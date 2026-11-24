# Up Style · Moda circular en Chía

Sitio web de **Up Style**, un proyecto de moda circular de la Sabana Norte de Cundinamarca
que recupera prendas de denim en desuso y las transforma en nuevos productos.
Proyecto formativo del SENA alineado con el **ODS 12: Producción y consumo responsables**
(meta 12.5, reducción de desechos mediante prevención, reciclaje y reutilización).

## Tecnologías

- HTML5 y CSS3 (sin frameworks)
- JavaScript (sin dependencias de compilación)
- [Motion](https://motion.dev) 13.4.4, incluida localmente en `motion.js`
- Tipografías del manual de marca, incluidas en `fonts/` (formato WOFF2):
  - **Fredoka** SemiBold (títulos) y Medium (subtítulos, botones y etiquetas)
  - **Poppins** Regular (texto) y SemiBold (negritas y etiquetas de formulario)
  - **The August** (acento caligráfico del inicio). Licencia de uso personal.
  - **Matcha Mint** (fuente del nombre "Up Style"; se conserva en `fonts/`, pero la página muestra la marca con el imagotipo)

La página funciona como sitio estático. Las animaciones de Motion son una mejora
progresiva: si la librería no carga o el sistema tiene activado *reducir movimiento*,
se usan las transiciones de CSS.

## Estructura

```
.
├── index.html            Contenido y estructura
├── style.css             Estilos, organizados por secciones numeradas
├── script.js             Menú, scroll, contadores, pestañas, formularios y ventanas
├── animaciones.js        Animaciones con Motion
├── motion.js             Librería Motion 13.4.4
├── README.md             Documentación del proyecto
├── fonts/                Tipografías WOFF2 del manual de marca
│   └── licencias/        Licencias de cada tipografía
├── img/
│   ├── logo-upstyle.png       Logo circular (favicon y marca de la tarjeta de redes)
│   ├── logo/             Imagotipo con contorno blanco del menú y del pie de página (WebP y PNG)
│   ├── fondo-problematica.jpg Foto de la escena 01 (Convocatoria) del relato del proceso
│   ├── inicio/           Fotos del carrusel del inicio (residuos textiles y modelos); modelos.jpg es también la escena 06 (Comunidad) del relato
│   ├── secciones/        Fondos de sección en JPG y WebP: franja del ODS 12 (denim en la mesa del taller, 16:9 y 4:5) y Problemática (textura de tejido, horizontal y vertical)
│   ├── proceso/          Escenas 02 a 05 del relato, en 16:9 (tablet y computador) y 4:5 (celular), JPG y WebP; clasificacion-manos-prenda es la escena 05 (El bolso); clasificacion-mesa-denim y confeccion-fileteadora quedan de reserva; patronaje-tira-denim es el fondo de "¿Por qué el denim?"
│   ├── merch/            Productos
│   ├── equipo/           Integrantes y foto grupal
│   ├── mascota/          Mascota del proyecto (WebP y PNG de respaldo)
│   └── biblioteca/       Carpeta reservada para material fotográfico adicional
├── video/                Video opcional del proceso (proceso.mp4)
└── .vscode/              Extensiones recomendadas para VS Code
```

## Secciones

1. Inicio: carrusel de fotos que avanza solo (se pausa con el mouse encima). Cuenta primero el problema y al final la solución: montaña de ropa, desierto de ropa desechada, campo de ropa hasta el horizonte y los modelos de Up Style. Cada foto es un bloque `hero-slide` en `index.html`; para agregar o quitar una foto basta con agregar o quitar ese bloque, con su encuadre (`--encuadre` y `--encuadre-movil`) y su texto alternativo. Las fotos de residuos textiles son imágenes de referencia del desierto de Atacama (Chile), de uso académico, con crédito en el pie de página
2. Problemática: cifras de residuos textiles en el mundo, Colombia, Bogotá y Chía, sobre fondo beige claro con la textura de tejido bajo un velo del color de la página (foto real del taller; versión vertical en celular)
3. ODS 12: franja con la foto del taller bajo una capa carbón neutra (`--carbon`), para que el azul quede solo en la tela
4. Proceso y por qué el denim: relato visual "Del desecho a la calle" en 6 escenas con foto a sangre (convocatoria, clasificación, patronaje, confección, el bolso y comunidad), cada una con una frase corta y pastillas con el logo y el usuario de la red donde se cuenta (Instagram, TikTok o la web), enlazadas al perfil o a la sección. En computador la escena queda fija y, al bajar, la pista avanza en horizontal con contador y barra de progreso; las seis marcas de la barra llevan directo a cada escena. En tablet y celular, sin Motion o con movimiento reducido las escenas se apilan. El marco de cada escena sigue la proporción de la foto (16:9 en computador y tablet, 4:5 en celular) y las fotos no se amplían ni se desplazan, para que se vean completas. El enlace "Saltar el relato" (junto a la barra en computador; arriba a la derecha y fijo bajo el menú mientras dura el relato en celular) baja hasta "¿Por qué el denim?" (`#por-que-el-denim`), sin animación si se pide movimiento reducido. La escena 04 muestra `video/proceso.mp4` en lugar de la foto si el archivo existe. La escena 05 (El bolso) usa por ahora la foto de prendas de denim terminadas en la mesa del taller, y la 06 (Comunidad) la de los modelos; en celular el texto de las escenas 02, 03, 05 y 06 pasa debajo de la foto para no tapar las manos ni las caras. "¿Por qué el denim?" cierra la sección sobre la foto `img/proceso/patronaje-tira-denim` (16:9 en computador y tablet, 4:5 en celular; WebP con respaldo JPG) bajo un velo beige más denso arriba, donde va el título, con las tres tarjetas en vidrio blanco. La infografía detallada del proceso se publica en redes
5. Merch
6. Redes sociales: Instagram ([@up_style26](https://www.instagram.com/up_style26/)) y TikTok ([@up.style07](https://www.tiktok.com/@up.style07)), las cuentas oficiales de Up Style. El marco de celular muestra un video de TikTok con el reproductor oficial (`https://www.tiktok.com/player/v1/<ID>`, sin sonido y en bucle); para cambiarlo basta con reemplazar el ID en el `iframe` y en el enlace "Ver en TikTok" de `index.html`
7. Equipo
8. Participa: formulario de preguntas y de donación de jeans (generan un correo con `mailto:`)

Mascota flotante: Ren, el mapache de Up Style (`img/mascota/`), queda fijo abajo a la izquierda con el globo "Soy Ren, ¡dona tus jeans!". Al hacer clic caen tres prendas de jean (pantalón, chaqueta y bolsillo) a su bote de reciclaje, el bote rebota al recibirlas, aparece "¡Gracias!" y luego la página baja al formulario de donación (con movimiento reducido solo muestra el mensaje y baja directo). Se oculta en el inicio, durante el relato del proceso, junto al formulario y en el pie de página.

## Cómo verla

Abre `index.html` en el navegador, o sírvela con un servidor local:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Equipo

| Integrante | Rol |
|---|---|
| Diego Pinzón | Director |
| Jean Diego | Fotografía e iluminación |
| Isabella García | Productora |
| Guillermo Hudgson | Productor de audio y vestuario |
| Diego Méndez | Productor de audio |

## Fuentes de los datos

ONU, UAESP, CAR Cundinamarca, revista Semana, El Tiempo, Fashion Revolution,
Cumbre de la Moda de Copenhague, Fundación Ellen MacArthur y WRAP.

---

Proyecto formativo SENA · Chía, Cundinamarca · 2026
