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

Copia el archivo en la carpeta indicada **con el nombre exacto**:

| Qué | Dónde y con qué nombre |
|---|---|
| Foto del integrante 5 | `img/equipo/integrante-5.jpg` |
| Video de introducción | `video/intro.mp4` |
| Video del proceso (opcional) | `video/proceso.mp4` |
| Cambiar cualquier foto | Reemplaza el archivo en `img/` con el mismo nombre |

Mientras falte un archivo, la página muestra un recuadro que dice cuál falta.

## Lo que falta completar

- Precios y características de cada producto de merch.
- Enlaces reales de Instagram y YouTube.
- Biografía y redes de cada integrante; nombre, rol y foto del integrante 5.
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

- `ejercicio-commune/`: ejercicio anterior (landing "Commune").
