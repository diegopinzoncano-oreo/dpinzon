# Up Style · Moda circular en Chía (Proyecto SENA)

Página web del proyecto Up Style.

## Los 3 archivos

| Archivo | Qué tiene | Cuándo lo abres |
|---|---|---|
| `index.html` | El **contenido**: textos, fotos, videos, enlaces | Para cambiar palabras, precios, enlaces |
| `style.css` | El **diseño**: colores, tamaños, animaciones | Para cambiar colores o espacios |
| `script.js` | El **comportamiento**: menú, contadores, ventanas, formularios | Para cambiar el correo de contacto |

Cada archivo empieza con un índice y explicaciones en español.

## Cómo editar

1. Abre la carpeta en **VS Code**. Te ofrecerá instalar las extensiones recomendadas: acepta.
2. Clic derecho en `index.html` → **Open with Live Server**. La página se abre en el navegador
   y se actualiza sola cada vez que guardas.
3. Busca con **Ctrl + F** la palabra `EDITABLE`. Cada lugar dice si es texto, foto, video o enlace.

## Subir fotos y videos (sin tocar código)

Copia el archivo en la carpeta indicada **con el nombre exacto**.
Para cambiar una foto que ya existe, reemplázala con el mismo nombre.

| Sección | Archivo | Recomendación |
|---|---|---|
| Inicio (modelos) | `img/inicio/modelos.jpg` | Horizontal, mínimo 2000 px de ancho, modelos en el centro. En computador la foto va a la derecha; en celular arriba. |
| Problemática (fondo suave) | `img/fondo-problematica.jpg` | Ropa acumulada, contenedores de ropa, relleno sanitario. Se ve muy clara, casi transparente. |
| **ODS 12 (franja grande)** | `img/secciones/ods12.jpg` | Horizontal, mínimo 1600 px de ancho. Montaña de jeans, manos separando prendas o el punto Renovamoda de Chía. Se oscurece sola. |
| Proceso | `img/proceso/midiendo-denim.jpg`, `img/proceso/herramientas.jpg` | Horizontales 4:3 (1200 × 900 px). Fotos reales del taller: corte, costura, clasificación. |
| Video del proceso (opcional) | `video/proceso.mp4` | Horizontal 16:9, corto (10 a 20 s), sin sonido. Se repite solo. |
| Merch | `img/merch/gorra.jpg` … | Cuadradas 1:1 (1000 × 1000 px), fondo de denim o liso. |
| Historia de Up Style | `video/intro.mp4` | Vertical 9:16 (como un reel). Se reproduce sola al llegar a la sección. Si es horizontal, ver el comentario en `index.html`. |
| Equipo | `img/equipo/diego-pinzon.jpg`, `jean-diego.jpg`, `isabella-garcia.jpg`, `guillermo-hudson.jpg`, `diego-mendez.jpg` | Verticales 8:11 (800 × 1100 px). Todas con el mismo fondo y encuadre. |
| Foto grupal | `img/equipo/equipo-completo.jpg` | Horizontal 2:1. |

Mientras falte un archivo, la página muestra un recuadro que dice cuál falta.
Consejo: que cada foto pese menos de 500 KB y cada video menos de 20 MB
(puedes comprimirlas en squoosh.app y los videos en handbrake.fr).

## Redes sociales de cada integrante

En `index.html`, sección 6 (Equipo), cada integrante tiene:
`data-ig`, `data-tiktok`, `data-yt`, `data-behance`, `data-linkedin`, `data-web`.
Pega el enlace completo entre las comillas. Las que queden vacías no aparecen.
En la ventana se muestra el botón de la red con el @usuario.

## Lo que falta completar

- Precios y características de cada producto de merch.
- Enlaces reales de Instagram y YouTube.
- Biografía y redes de cada integrante.
- Video de la historia de Up Style y foto para la franja del ODS 12.
- Correo real de contacto (en `index.html` y en `script.js` → `CORREO_DE_CONTACTO`).

## Extensiones de VS Code recomendadas

Están en `.vscode/extensions.json`:

- **Live Server**: ver la página en vivo mientras editas.
- **Prettier**: ordena el código con clic derecho → Dar formato al documento.
- **Auto Rename Tag**: si cambias `<div>`, cambia también su `</div>`.
- **HTML CSS Support** y **CSS Peek**: autocompleta clases y te lleva a su estilo.
- **Color Highlight**: muestra los colores (#2F4468) pintados en el código.
- **Code Spell Checker** + español: marca errores de ortografía.
- **Paquete de idioma español** para VS Code.

## Publicar en la web (GitHub Pages)

1. En GitHub: **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, la rama y la carpeta `/ (root)`.
3. Guarda. En uno o dos minutos la página queda en
   `https://<tu-usuario>.github.io/dpinzon/`.

## Otros

- `img/biblioteca/`: biblioteca de imágenes del proyecto (fotos que aún no están en la página).
- `ejercicio-commune/`: ejercicio anterior (landing "Commune").
