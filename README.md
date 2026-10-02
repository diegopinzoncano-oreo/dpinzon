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
  - **Matcha Mint** (solo el nombre "Up Style"; no incluye tildes ni ñ)

La página funciona como sitio estático. Las animaciones de Motion son una mejora
progresiva: si la librería no carga o el sistema tiene activado *reducir movimiento*,
se usan las transiciones de CSS.

## Estructura

```
.
├── index.html        Contenido y estructura
├── style.css         Estilos, organizados por secciones numeradas
├── script.js         Menú, scroll, contadores, pestañas, formularios y ventanas
├── animaciones.js    Animaciones con Motion
├── motion.js         Librería Motion 13.4.4
├── fonts/            Tipografías WOFF2 y sus licencias (licencias/)
├── img/
│   ├── inicio/       Foto principal
│   ├── secciones/    Franja del ODS 12
│   ├── proceso/      Fotos del proceso
│   ├── merch/        Productos
│   ├── equipo/       Integrantes y foto grupal
│   └── biblioteca/   Material fotográfico del proyecto
└── video/            Videos de la página (opcionales)
```

## Secciones

1. Inicio
2. Problemática: cifras de residuos textiles en el mundo, Colombia, Bogotá y Chía
3. ODS 12
4. Proceso y por qué el denim
5. Merch
6. Redes sociales
7. Equipo
8. Participa: formulario de preguntas y de donación de jeans (generan un correo con `mailto:`)

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
| Guillermo Hudsong | Productor de audio y vestuario |
| Diego Méndez | Productor de audio |

## Fuentes de los datos

ONU, UAESP, CAR Cundinamarca, revista Semana, El Tiempo, Fashion Revolution,
Cumbre de la Moda de Copenhague, Fundación Ellen MacArthur y WRAP.

---

Proyecto formativo SENA · Chía, Cundinamarca · 2026
