# CLAUDE.md · Up Style

## Cómo trabajar (reglas del usuario)

1. **Claude es una IA y puede cometer errores.** Revisa y prueba todo antes de entregar.
2. **Nunca ejecutes el trabajo por tu cuenta:** delega siempre la tarea a un subagente.
3. **Distribución de modelos** (especifica el modelo en cada llamada al subagente):
   - **Fable 5.1:** arquitectura, bugs complejos y revisión de código.
   - **Opus 5.5:** ediciones, pruebas, documentación y refactorización.
   - **Haiku 4.5:** investigaciones y resúmenes.
4. **Delegación:**
   - Un subagente por tarea. Planifica antes de ejecutar.
   - Ejecuta en paralelo los subagentes que sean independientes.
   - Lee el informe del subagente, nunca los archivos.

## Contexto del proyecto

Página web estática **"Up Style · Moda circular en Chía"**, proyecto formativo del SENA
sobre recuperación textil (ODS 12). El dueño es un estudiante de diseño gráfico que está
empezando a programar y edita la página en clase con VS Code.

## Estructura de archivos

- `index.html`: contenido de la página.
- `style.css`: diseño.
- `script.js`: comportamiento.
- `animaciones.js`: animaciones con la librería Motion.
- `motion.js`: librería de animaciones Motion 13.4.4, guardada en el proyecto (funciona sin internet). **No editar.**
- `README.md`: documentación del proyecto.
- `fonts/`: tipografías del manual de marca en WOFF2 y sus licencias en `licencias/`. Fredoka 600 para títulos y 500 para subtítulos, Poppins 400 para texto (600 en negritas), The August para el acento caligráfico (licencia solo de uso personal) y Matcha Mint solo para el nombre "Up Style" (no tiene tildes ni ñ).
- `img/`: imágenes, organizadas en `equipo/`, `merch/`, `proceso/`, `inicio/`, `secciones/` y `biblioteca/`.
- `video/`: aquí van `intro.mp4` y `proceso.mp4`.
- `.vscode/`: extensiones recomendadas.
- `ejercicio-commune/`: ejercicio anterior. **No tocar.**

## Convenciones que deben mantenerse

- Código con aspecto de producción: comentarios breves y profesionales en español
  (encabezados de sección y notas sobre lo no obvio), sin tono de tutorial ni instrucciones al lector.
- Sin marcas de edición en el HTML.
- Sin textos de relleno ni instrucciones visibles en la página (rutas de archivos, "escribe aquí",
  precios de ejemplo). Si falta un dato, usar un texto neutro y terminado ("Precio por confirmar").
- Nombres claros y en español en `script.js`.
- CSS ordenado por secciones numeradas `== N.` con un índice al inicio del archivo.
- Estilo visual limpio y editorial, tipo Nike/Adidas.
- El menú es de vidrio azul denim traslúcido con degradé.

### Qué evitar (al usuario no le gusta y "se ve hecho con IA")

- Costuras o bordes punteados decorativos.
- Emojis visibles en la página.
- Guiones largos en los textos visibles.

## Pruebas

Antes de entregar, prueba los cambios en el navegador con **Playwright** (Chromium ya está
instalado), tanto en tamaño de computador como de celular.

## Flujo de entrega

1. Desarrolla en la rama `claude/sena-project-page-wfzvxh`.
2. Haz commit y luego `git push -u origin claude/sena-project-page-wfzvxh`.
3. Publica la vista previa en el artifact https://claude.ai/artifact/QYBA1zJ7jynvdsLtoqsEMR
4. Entrega al usuario `index.html`, `style.css`, `script.js` y un `.zip` del proyecto.
5. Responde al usuario siempre en español.
