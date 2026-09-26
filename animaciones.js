/*
  ================================================================
  UP STYLE · animaciones.js
  Aquí están las animaciones "premium" hechas con la librería
  MOTION (motion.dev). La librería está guardada dentro del
  proyecto en motion.js (funciona sin internet). Se carga en
  index.html, justo antes de script.js, y queda en window.Motion.

  IMPORTANTE: este archivo es un EXTRA.
  - Si Motion no carga (por ejemplo, si falta motion.js), o si la persona pidió
    "reducir movimiento" en su dispositivo, este archivo NO hace
    nada y la página sigue con sus animaciones normales (las de
    style.css y script.js).
  - Cuando Motion sí carga, le ponemos la clase "motion-on" a la
    etiqueta <html>. Así style.css sabe que Motion está activo
    (ver style.css → "== 18.").

  ÍNDICE
    0. Arranque: revisamos si Motion está disponible
    1. Ajustes (velocidades y curvas de movimiento)
    2. Herramientas pequeñas que usamos varias veces
    3. Títulos de sección: palabra por palabra
    4. Tarjetas en cascada (merch, equipo y "¿Por qué el denim?")
    5. Pasos del proceso: número y título desde la izquierda
    6. Fotos con parallax suave al bajar
    7. Sello del ODS 12 que se mueve al bajar
    8. Botones "magnéticos" al pasar el mouse

  Palabras de Motion que vas a ver:
    animate(elemento, { propiedad: [desde, hasta] }, { opciones })
        → mueve un elemento de un valor a otro.
    inView(elemento, funcion)
        → ejecuta la función cuando el elemento entra en pantalla.
    scroll(funcion, { target: elemento })
        → ejecuta la función cada vez que bajas, con un número de
          0 a 1 que dice cuánto del recorrido del elemento llevas.
    stagger(0.08)
        → "cascada": cada elemento arranca 0.08 segundos después
          del anterior.
  ================================================================
*/

// Todo va dentro de esta función para que los nombres de aquí no
// choquen con los de script.js. Al final del archivo la llamamos.
function iniciarAnimacionesMotion() {

  /* ==============================================================
     0. ARRANQUE
     ============================================================== */

  // ¿La persona pidió "reducir movimiento" en su dispositivo?
  const pideMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si Motion no cargó (falta motion.js) o pidió menos movimiento: no hacemos nada.
  if (!window.Motion || pideMenosMovimiento) return;

  // Sacamos de Motion las herramientas que vamos a usar
  const { animate, inView, scroll, stagger, motionValue } = window.Motion;

  // Avisamos a style.css que Motion está activo
  document.documentElement.classList.add('motion-on');


  /* ==============================================================
     1. AJUSTES
     Si quieres que todo sea más lento o más rápido, cambia aquí.
     ============================================================== */

  // Curva de movimiento: arranca rápido y frena muy suave (estilo Apple)
  const curvaSuave = [0.22, 1, 0.36, 1];

  // "Resorte" para los botones: vuelve a su lugar con muy poco rebote
  const resorteBoton = { type: 'spring', stiffness: 220, damping: 16, mass: 0.6 };

  const DURACION_TITULO = 0.9;    // segundos que tarda cada palabra en subir
  const DURACION_TARJETA = 0.8;   // segundos que tarda cada tarjeta en aparecer
  const CASCADA = 0.08;           // segundos entre un elemento y el siguiente


  /* ==============================================================
     2. HERRAMIENTAS PEQUEÑAS
     ============================================================== */

  // Le quitamos a un elemento la animación de aparición de style.css
  // (clases "reveal" y "reveal-1", "reveal-2"...) para que Motion
  // sea el único que lo anima. Así no se animan dos veces a la vez.
  function quitarAparicionCSS(elemento) {
    elemento.classList.remove('reveal', 'reveal-1', 'reveal-2', 'reveal-3', 'reveal-4', 'reveal-5');
  }

  // Cuando Motion termina, borramos los estilos que dejó escritos en
  // el elemento. Así vuelven a funcionar los efectos de style.css al
  // pasar el mouse (por ejemplo, la tarjeta que sube un poquito).
  function soltarEstilos(elementos) {
    // Esperamos un cuadro (frame): Motion escribe su último valor justo
    // después de avisar que terminó. Si borráramos antes, ese último
    // valor quedaría pegado y taparía los efectos de style.css.
    requestAnimationFrame(function () {
      elementos.forEach(function (elemento) {
        elemento.style.opacity = '';
        elemento.style.transform = '';
      });
    });
  }

  // Junta los elementos que entran en pantalla al mismo tiempo en una
  // "tanda", para animarlos en cascada (uno detrás de otro).
  // "animarTanda" es la función que recibe la lista de la tanda.
  function crearTanda(animarTanda) {
    let enEspera = [];
    return function agregar(elemento) {
      enEspera.push(elemento);
      if (enEspera.length === 1) {
        // Esperamos un cuadro (frame) para recoger a todos los que llegan juntos
        requestAnimationFrame(function () {
          const tanda = enEspera;
          enEspera = [];
          // Los ordenamos como están en la página (de arriba a abajo)
          tanda.sort(function (a, b) {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
          });
          animarTanda(tanda);
        });
      }
    };
  }


  /* ==============================================================
     3. TÍTULOS DE SECCIÓN: PALABRA POR PALABRA
     Partimos el texto del título en palabras. Cada palabra queda
     dentro de una "máscara" (un span que esconde lo que se sale) y
     sube desde abajo, una detrás de otra.
     El HTML no cambia: esto lo hace JavaScript al cargar la página.
     ============================================================== */

  document.querySelectorAll('.section-head h2').forEach(function (titulo) {
    // Si el título tiene etiquetas adentro (negrita, enlaces...), lo
    // dejamos quieto para no dañarlo.
    if (titulo.children.length > 0) return;

    const texto = titulo.textContent.trim();
    const palabras = texto.split(/\s+/);

    // Los lectores de pantalla leen la frase completa, no palabra por palabra
    titulo.setAttribute('aria-label', texto);
    titulo.textContent = '';

    palabras.forEach(function (palabra, numero) {
      const mascara = document.createElement('span');
      mascara.className = 'm-mascara';
      mascara.setAttribute('aria-hidden', 'true');

      const pedazo = document.createElement('span');
      pedazo.className = 'm-palabra';
      pedazo.textContent = palabra;

      mascara.appendChild(pedazo);
      titulo.appendChild(mascara);

      // Espacio normal entre palabras (para que el título pueda bajar de línea)
      if (numero < palabras.length - 1) titulo.appendChild(document.createTextNode(' '));
    });

    // Con esta clase, style.css esconde las palabras debajo de su máscara
    titulo.classList.add('m-titulo');

    // Cuando el título entra en pantalla, las palabras suben en cascada
    inView(titulo, function () {
      animate(
        titulo.querySelectorAll('.m-palabra'),
        { transform: ['translateY(110%)', 'translateY(0%)'] },
        { duration: DURACION_TITULO, ease: curvaSuave, delay: stagger(0.06) }
      );
    }, { amount: 0.5 }); // cuando se ve la mitad del título
  });


  /* ==============================================================
     4. TARJETAS EN CASCADA
     Merch, integrantes del equipo y "¿Por qué el denim?".
     Aparecen de la transparencia y crecen un poquito (94% → 100%).
     ============================================================== */

  const tarjetas = document.querySelectorAll('.merch-card, .member-card, .identity-card');

  const animarTarjetas = crearTanda(function (tanda) {
    animate(
      tanda,
      { opacity: [0, 1], transform: ['scale(0.94)', 'scale(1)'] },
      { duration: DURACION_TARJETA, ease: curvaSuave, delay: stagger(CASCADA) }
    ).then(function () { soltarEstilos(tanda); });
  });

  tarjetas.forEach(function (tarjeta) {
    quitarAparicionCSS(tarjeta);
    tarjeta.style.opacity = '0'; // escondida hasta que entre en pantalla
    inView(tarjeta, function () { animarTarjetas(tarjeta); }, { amount: 0.2 });
  });


  /* ==============================================================
     5. PASOS DEL PROCESO
     El número y el título entran deslizándose desde la izquierda,
     y luego aparece el texto. La línea de arriba de cada paso la
     sigue dibujando style.css cuando script.js le pone la clase
     "in-view" (como antes).
     ============================================================== */

  const pasos = document.querySelectorAll('.step');

  const animarPasos = crearTanda(function (tanda) {
    const numerosYTitulos = [];
    const textos = [];
    tanda.forEach(function (paso) {
      numerosYTitulos.push(paso.querySelector('.step-num'), paso.querySelector('.step-title'));
      textos.push(paso.querySelector('.step-text'));
    });

    animate(
      numerosYTitulos,
      { opacity: [0, 1], transform: ['translateX(-48px)', 'translateX(0px)'] },
      { duration: 0.9, ease: curvaSuave, delay: stagger(0.07) }
    ).then(function () { soltarEstilos(numerosYTitulos); });

    animate(
      textos,
      { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
      { duration: 0.9, ease: curvaSuave, delay: stagger(0.14, { startDelay: 0.2 }) }
    ).then(function () { soltarEstilos(textos); });
  });

  pasos.forEach(function (paso) {
    quitarAparicionCSS(paso);
    paso.querySelectorAll('.step-num, .step-title, .step-text').forEach(function (parte) {
      parte.style.opacity = '0'; // escondidos hasta que el paso entre en pantalla
    });
    inView(paso, function () { animarPasos(paso); }, { amount: 0.3 });
  });


  /* ==============================================================
     6. FOTOS CON PARALLAX SUAVE
     Mientras bajas, la foto se mueve un poquito más lento que la
     página (de -5% a 5%). La foto está un 12% más grande (style.css)
     para que nunca se vean sus bordes.
     ============================================================== */

  document.querySelectorAll('.process-media .photo-frame img, .group-photo img').forEach(function (foto) {
    foto.classList.add('m-parallax');

    scroll(function (progreso) {
      // progreso va de 0 (la foto asoma abajo) a 1 (la foto sale por arriba)
      const mover = (progreso - 0.5) * 10;
      foto.style.setProperty('--m-mover', mover.toFixed(2) + '%');
    }, {
      target: foto.parentElement,          // el marco de la foto
      offset: ['start end', 'end start']   // desde que asoma hasta que se va
    });
  });


  /* ==============================================================
     7. SELLO DEL ODS 12
     Mientras la franja azul cruza la pantalla, el sello crece un
     poquito y gira unos grados. Usamos "scale" y "rotate" aparte
     para no chocar con la aparición de style.css (que usa transform).
     ============================================================== */

  const sello = document.querySelector('.ods-mark');
  const franjaOds = document.querySelector('.ods-band');

  if (sello && franjaOds) {
    scroll(function (progreso) {
      // Math.sin hace una "loma": pequeño al entrar, más grande en la mitad, pequeño al salir
      const escala = 0.94 + 0.08 * Math.sin(progreso * Math.PI);
      const giro = (0.5 - progreso) * 10; // de 5 grados a -5 grados
      sello.style.scale = escala.toFixed(3);
      sello.style.rotate = giro.toFixed(2) + 'deg';
    }, {
      target: franjaOds,
      offset: ['start end', 'end start']
    });
  }


  /* ==============================================================
     8. BOTONES "MAGNÉTICOS"
     Al pasar el mouse, el botón se acerca un poquito al puntero.
     Al salir, vuelve a su lugar con un resorte suave.
     Solo en computadores (en celular no hay mouse).
     Los botones del menú no se tocan: el menú tiene su propia animación.
     ============================================================== */

  const tieneMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (tieneMouse) {
    document.querySelectorAll('.btn-primary, .btn-denim').forEach(function (boton) {
      if (boton.closest('#siteHeader')) return; // botones del menú: no

      // Dos "valores de Motion": cuánto se corre el botón en x y en y
      const corrimientoX = motionValue(0);
      const corrimientoY = motionValue(0);

      // Cada vez que cambian, movemos el botón con la propiedad "translate"
      // (así no chocamos con el "transform" que usa style.css al pasar el mouse)
      function pintarBoton() {
        boton.style.translate = corrimientoX.get().toFixed(2) + 'px ' + corrimientoY.get().toFixed(2) + 'px';
      }
      corrimientoX.on('change', pintarBoton);
      corrimientoY.on('change', pintarBoton);

      boton.addEventListener('pointermove', function (evento) {
        const caja = boton.getBoundingClientRect();
        // Centro del botón (restamos lo que ya se movió para medir bien)
        const centroX = caja.left + caja.width / 2 - corrimientoX.get();
        const centroY = caja.top + caja.height / 2 - corrimientoY.get();
        // El botón sigue al puntero, pero solo una parte (máximo unos 8 px)
        const haciaX = Math.max(-8, Math.min(8, (evento.clientX - centroX) * 0.2));
        const haciaY = Math.max(-6, Math.min(6, (evento.clientY - centroY) * 0.3));
        animate(corrimientoX, haciaX, resorteBoton);
        animate(corrimientoY, haciaY, resorteBoton);
      });

      boton.addEventListener('pointerleave', function () {
        animate(corrimientoX, 0, resorteBoton);
        animate(corrimientoY, 0, resorteBoton);
      });
    });
  }
}

// Llamamos la función. Si algo falla, mostramos todo para que nada
// quede escondido y la página siga funcionando sin Motion.
try {
  iniciarAnimacionesMotion();
} catch (error) {
  console.warn('Las animaciones de Motion no se pudieron iniciar:', error);
  document.documentElement.classList.remove('motion-on');
  document.querySelectorAll('.merch-card, .member-card, .identity-card, .step-num, .step-title, .step-text').forEach(function (elemento) {
    elemento.style.opacity = '';
  });
}
