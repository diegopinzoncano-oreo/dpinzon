/*
  Up Style · animaciones.js
  Animaciones con Motion 13.4.4 (motion.js, disponible en window.Motion).
  Es una mejora progresiva: sin Motion o con prefers-reduced-motion,
  la página conserva las animaciones de style.css y script.js.

  Índice
    0. Arranque
    1. Ajustes
    2. Utilidades
    3. Títulos de sección palabra por palabra
    4. Tarjetas en cascada
    5. Parallax de fotos (proceso y merch)
    6. Sello del ODS 12
    7. Botones magnéticos
*/

// Encapsulado para no compartir nombres con script.js
function iniciarAnimacionesMotion() {

  /* ==============================================================
     0. ARRANQUE
     ============================================================== */

  const pideMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sin Motion o con movimiento reducido quedan las animaciones de CSS
  if (!window.Motion || pideMenosMovimiento) return;

  const { animate, inView, scroll, stagger, motionValue } = window.Motion;

  // Activa las reglas de la sección 18 de style.css
  document.documentElement.classList.add('motion-on');


  /* ==============================================================
     1. AJUSTES
     ============================================================== */

  const curvaSuave = [0.22, 1, 0.36, 1];
  const resorteBoton = { type: 'spring', stiffness: 220, damping: 16, mass: 0.6 };

  const DURACION_TITULO = 0.9;    // s por palabra
  const DURACION_TARJETA = 0.8;   // s por tarjeta
  const CASCADA = 0.08;           // s entre elementos
  const DURACION_CORTINA = 1.1;   // s del revelado de cada foto de merch
  const CASCADA_MERCH = 0.14;     // s entre productos


  /* ==============================================================
     2. UTILIDADES
     ============================================================== */

  // Evita que .reveal (CSS) y Motion animen el mismo elemento
  function quitarAparicionCSS(elemento) {
    elemento.classList.remove('reveal', 'reveal-1', 'reveal-2', 'reveal-3', 'reveal-4', 'reveal-5');
  }

  // Limpia los estilos en línea al terminar para que vuelvan a aplicar
  // los :hover de style.css. Se espera un cuadro porque Motion escribe
  // su último valor justo después de resolver la promesa.
  function soltarEstilos(elementos) {
    requestAnimationFrame(function () {
      elementos.forEach(function (elemento) {
        elemento.style.opacity = '';
        elemento.style.transform = '';
        elemento.style.clipPath = '';
      });
    });
  }

  // Agrupa en una tanda los elementos que entran en pantalla en el
  // mismo cuadro, para animarlos en cascada.
  function crearTanda(animarTanda) {
    let enEspera = [];
    return function agregar(elemento) {
      enEspera.push(elemento);
      if (enEspera.length === 1) {
        // Un cuadro de espera agrupa los elementos que entran juntos
        requestAnimationFrame(function () {
          const tanda = enEspera;
          enEspera = [];
          // Orden del documento
          tanda.sort(function (a, b) {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
          });
          animarTanda(tanda);
        });
      }
    };
  }


  /* ==============================================================
     3. TÍTULOS DE SECCIÓN PALABRA POR PALABRA
     Cada palabra se envuelve en una máscara y sube en cascada.
     ============================================================== */

  document.querySelectorAll('.section-head h2').forEach(function (titulo) {
    // Títulos con marcado interno se dejan intactos
    if (titulo.children.length > 0) return;

    const texto = titulo.textContent.trim();
    const palabras = texto.split(/\s+/);

    // Los lectores de pantalla leen la frase completa
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

      // Espacio real entre palabras para permitir el salto de línea
      if (numero < palabras.length - 1) titulo.appendChild(document.createTextNode(' '));
    });

    // style.css oculta las palabras bajo su máscara
    titulo.classList.add('m-titulo');

    inView(titulo, function () {
      animate(
        titulo.querySelectorAll('.m-palabra'),
        { transform: ['translateY(110%)', 'translateY(0%)'] },
        { duration: DURACION_TITULO, ease: curvaSuave, delay: stagger(0.06) }
      );
    }, { amount: 0.5 });
  });


  /* ==============================================================
     4. TARJETAS EN CASCADA
     Equipo y "¿Por qué el denim?": opacidad y escala 0.94 → 1.
     Merch: la foto se revela como una cortina que sube mientras la
     imagen pasa de 1.15 a 1; el texto entra después.
     ============================================================== */

  const tarjetas = document.querySelectorAll('.member-card, .identity-card');

  const animarTarjetas = crearTanda(function (tanda) {
    animate(
      tanda,
      { opacity: [0, 1], transform: ['scale(0.94)', 'scale(1)'] },
      { duration: DURACION_TARJETA, ease: curvaSuave, delay: stagger(CASCADA) }
    ).then(function () { soltarEstilos(tanda); });
  });

  tarjetas.forEach(function (tarjeta) {
    quitarAparicionCSS(tarjeta);
    tarjeta.style.opacity = '0';
    inView(tarjeta, function () { animarTarjetas(tarjeta); }, { amount: 0.2 });
  });

  const animarProductos = crearTanda(function (tanda) {
    const animaciones = [];
    const animados = [];

    tanda.forEach(function (producto, numero) {
      const marco = producto.querySelector('.merch-photo');
      const foto = marco.querySelector('img');
      const texto = producto.querySelector('.merch-body');
      const retraso = numero * CASCADA_MERCH;

      animaciones.push(
        animate(marco,
          { clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] },
          { duration: DURACION_CORTINA, ease: curvaSuave, delay: retraso }),
        animate(foto,
          { transform: ['scale(1.15)', 'scale(1)'] },
          { duration: DURACION_CORTINA + 0.4, ease: curvaSuave, delay: retraso }),
        animate(texto,
          { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
          { duration: 0.8, ease: curvaSuave, delay: retraso + 0.4 })
      );
      animados.push(marco, foto, texto);
    });

    Promise.all(animaciones).then(function () { soltarEstilos(animados); });
  });

  document.querySelectorAll('.merch-card').forEach(function (producto) {
    quitarAparicionCSS(producto);
    // Estado inicial: foto cubierta y texto oculto
    producto.querySelector('.merch-photo').style.clipPath = 'inset(100% 0% 0% 0%)';
    producto.querySelector('.merch-photo img').style.transform = 'scale(1.15)';
    producto.querySelector('.merch-body').style.opacity = '0';
    inView(producto, function () { animarProductos(producto); }, { amount: 0.25 });
  });


  /* ==============================================================
     5. PARALLAX DE FOTOS (PROCESO Y MERCH)
     La imagen está ampliada en style.css (propiedad "scale") y se
     desplaza dentro de su marco sin pasar del margen que deja esa
     ampliación. La foto grupal queda fija para mostrarla completa.
     ============================================================== */

  document.querySelectorAll('.process-media .photo-frame img, .merch-photo img').forEach(function (foto) {
    foto.classList.add('m-parallax');

    // Margen sobrante por lado, en % del alto, con un 15% de holgura
    const escala = parseFloat(getComputedStyle(foto).scale) || 1;
    const limite = (escala - 1) / 2 * 100 * 0.85;

    scroll(function (progreso) {
      // 0: la foto asoma por abajo · 1: sale por arriba
      const mover = (progreso - 0.5) * 2 * limite;
      foto.style.setProperty('--m-mover', mover.toFixed(2) + '%');
    }, {
      target: foto.parentElement,
      offset: ['start end', 'end start']
    });
  });


  /* ==============================================================
     6. SELLO DEL ODS 12
     Escala sutil durante el recorrido, sin rotación. Se usa la
     propiedad "scale" para no chocar con el transform de .reveal.
     ============================================================== */

  const sello = document.querySelector('.ods-mark');
  const franjaOds = document.querySelector('.ods-band');

  if (sello && franjaOds) {
    scroll(function (progreso) {
      // Curva senoidal: 0.97 → 1 → 0.97 durante el recorrido
      const escala = 0.97 + 0.03 * Math.sin(progreso * Math.PI);
      sello.style.scale = escala.toFixed(3);
    }, {
      target: franjaOds,
      offset: ['start end', 'end start']
    });
  }


  /* ==============================================================
     7. BOTONES MAGNÉTICOS
     Solo con puntero fino (mouse).
     ============================================================== */

  const tieneMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (tieneMouse) {
    document.querySelectorAll('.btn-primary, .btn-denim').forEach(function (boton) {
      // Desplazamiento en x e y
      const corrimientoX = motionValue(0);
      const corrimientoY = motionValue(0);

      // "translate" evita conflictos con el transform de :hover en style.css
      function pintarBoton() {
        boton.style.translate = corrimientoX.get().toFixed(2) + 'px ' + corrimientoY.get().toFixed(2) + 'px';
      }
      corrimientoX.on('change', pintarBoton);
      corrimientoY.on('change', pintarBoton);

      boton.addEventListener('pointermove', function (evento) {
        const caja = boton.getBoundingClientRect();
        // Centro sin el desplazamiento actual
        const centroX = caja.left + caja.width / 2 - corrimientoX.get();
        const centroY = caja.top + caja.height / 2 - corrimientoY.get();
        // Seguimiento parcial del puntero, limitado a unos 8 px
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

// Si la inicialización falla, se restaura la visibilidad de todo lo animado
try {
  iniciarAnimacionesMotion();
} catch (error) {
  console.warn('Las animaciones de Motion no se pudieron iniciar:', error);
  document.documentElement.classList.remove('motion-on');
  document.querySelectorAll('.member-card, .identity-card, .merch-body').forEach(function (elemento) {
    elemento.style.opacity = '';
  });
  document.querySelectorAll('.merch-photo, .merch-photo img').forEach(function (elemento) {
    elemento.style.clipPath = '';
    elemento.style.transform = '';
  });
}
