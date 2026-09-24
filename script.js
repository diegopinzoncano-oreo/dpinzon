/*
  ================================================================
  UP STYLE · script.js
  Aquí está el COMPORTAMIENTO de la página: lo que se mueve o
  reacciona cuando la persona hace algo (bajar, tocar, escribir).

  ÍNDICE
    0. Ajustes (lo único que normalmente necesitas cambiar)
    1. Menú en celular
    2. Efectos al bajar por la página (scroll)
    3. Contadores y barras
    4. Aparición de elementos al bajar
    5. Pestañas Colombia / Bogotá / Chía
    6. Fotos y videos que faltan
    7. Formularios (abren un correo)
    8. Ventanas emergentes (merch y equipo)

  Palabras que vas a ver mucho:
    const / let  → guardan un valor con un nombre (una "variable").
    function     → un grupo de instrucciones con nombre, que se puede
                   usar varias veces.
    document.querySelector('.clase')  → busca un elemento del HTML.
    addEventListener('click', ...)    → "cuando pase esto, haz esto".
    classList.add('x')                → le pone la clase x (el CSS
                                        decide cómo se ve esa clase).
  ================================================================
*/


/* ================================================================
   0. AJUSTES
   ================================================================ */

// EDITABLE (texto): correo al que llegan las preguntas y donaciones
const CORREO_DE_CONTACTO = 'hola@upstyle.com';

// Si la persona pidió "reducir movimiento" en su celular o computador,
// esta variable vale true y apagamos las animaciones.
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ================================================================
   1. MENÚ EN CELULAR
   El botón de 3 rayitas abre y cierra la lista de enlaces.
   ================================================================ */

const botonMenu = document.getElementById('navToggle');
const listaMenu = document.getElementById('navlinks');

function abrirOCerrarMenu(abrir) {
  listaMenu.classList.toggle('open', abrir);
  botonMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
}

// Al tocar el botón: si está abierto lo cierra, si está cerrado lo abre
botonMenu.addEventListener('click', function () {
  const estaAbierto = listaMenu.classList.contains('open');
  abrirOCerrarMenu(!estaAbierto);
});

// Al tocar un enlace del menú, se cierra
listaMenu.addEventListener('click', function (evento) {
  if (evento.target.closest('a')) abrirOCerrarMenu(false);
});

// Al tocar fuera del menú, también se cierra
document.addEventListener('click', function (evento) {
  if (listaMenu.classList.contains('open') && !evento.target.closest('.nav')) {
    abrirOCerrarMenu(false);
  }
});


/* ================================================================
   2. EFECTOS AL BAJAR POR LA PÁGINA (scroll)
   Todo lo que cambia mientras bajas:
     - la barra dorada de progreso de arriba
     - el menú se hace más delgado
     - se subraya la sección en la que estás
     - la foto del inicio se mueve más lento (efecto "parallax")
     - la costura del proceso se va "cosiendo"
   ================================================================ */

const encabezado = document.getElementById('siteHeader');
const barraProgreso = document.getElementById('scrollProgress');
const fotoInicio = document.querySelector('.hero-bg');
const listaProceso = document.getElementById('processList');
const costuraProceso = document.querySelector('.process-line-fill');
const pasosProceso = document.querySelectorAll('.process-item');

// Enlaces del menú y las secciones a las que apuntan
const enlacesMenu = document.querySelectorAll('.navlinks a');

function resaltarSeccionActual() {
  // Punto de referencia: un poco más arriba de la mitad de la pantalla
  const referencia = window.scrollY + window.innerHeight * 0.35;

  enlacesMenu.forEach(function (enlace) {
    const seccion = document.querySelector(enlace.getAttribute('href'));
    const empieza = seccion.offsetTop;
    const termina = empieza + seccion.offsetHeight;
    enlace.classList.toggle('active', referencia >= empieza && referencia < termina);
  });
}

function alBajar() {
  const bajado = window.scrollY;
  const totalQueSePuedeBajar = document.documentElement.scrollHeight - window.innerHeight;

  // Barra de progreso: 0 = arriba del todo, 1 = abajo del todo
  const progreso = totalQueSePuedeBajar > 0 ? bajado / totalQueSePuedeBajar : 0;
  barraProgreso.style.transform = 'scaleX(' + progreso + ')';

  // Menú más delgado después de bajar 40 píxeles
  encabezado.classList.toggle('scrolled', bajado > 40);

  resaltarSeccionActual();

  if (reducirMovimiento) return; // sin animaciones: aquí paramos

  // Parallax: la foto del inicio baja al 30% de la velocidad
  if (bajado < window.innerHeight * 1.2) {
    fotoInicio.style.transform = 'translateY(' + bajado * 0.3 + 'px)';
  }

  // Costura del proceso: se llena según cuánto de la lista ya pasó
  const caja = listaProceso.getBoundingClientRect();
  const linea = window.innerHeight * 0.6; // línea imaginaria al 60% de la pantalla
  let avance = (linea - caja.top) / caja.height;
  avance = Math.min(Math.max(avance, 0), 1); // lo dejamos entre 0 y 1
  costuraProceso.style.transform = 'scaleY(' + avance + ')';

  // Cada círculo numerado se pinta de azul cuando la costura lo alcanza
  pasosProceso.forEach(function (paso) {
    paso.classList.toggle('passed', paso.getBoundingClientRect().top + 24 < linea);
  });
}

// requestAnimationFrame hace que el efecto se calcule una sola vez por
// cuadro de animación, así la página no se pone lenta.
let esperandoCuadro = false;
window.addEventListener('scroll', function () {
  if (esperandoCuadro) return;
  esperandoCuadro = true;
  requestAnimationFrame(function () {
    alBajar();
    esperandoCuadro = false;
  });
}, { passive: true });

window.addEventListener('resize', alBajar);
alBajar();

// Sin animaciones: dejamos la costura completa desde el principio
if (reducirMovimiento) {
  costuraProceso.style.transform = 'scaleY(1)';
  pasosProceso.forEach(function (paso) { paso.classList.add('passed'); });
}


/* ================================================================
   3. CONTADORES Y BARRAS
   Un contador es un <span class="counter" data-target="92">.
   Cuando aparece en pantalla, cuenta desde 0 hasta data-target.
   ================================================================ */

function ponerPuntosDeMiles(numero) {
  return numero.toLocaleString('es-CO'); // 147767 → "147.767"
}

function animarContador(contador) {
  if (contador.dataset.yaConto) return; // cada contador cuenta solo una vez
  contador.dataset.yaConto = 'si';

  const numeroFinal = parseFloat(contador.dataset.target) || 0;
  const despues = contador.dataset.suffix || '';

  if (reducirMovimiento) {
    contador.textContent = ponerPuntosDeMiles(numeroFinal) + despues;
    return;
  }

  const duracion = 1600; // milisegundos (1,6 segundos)
  let inicio = null;

  function paso(tiempo) {
    if (!inicio) inicio = tiempo;
    const avance = Math.min((tiempo - inicio) / duracion, 1); // de 0 a 1
    const suave = 1 - Math.pow(1 - avance, 4); // empieza rápido y frena al final
    contador.textContent = ponerPuntosDeMiles(Math.round(numeroFinal * suave)) + despues;
    if (avance < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

// Llena las barras de un panel según su data-width (y data-max si tiene)
function llenarBarras(contenedor) {
  contenedor.querySelectorAll('.bar-fill').forEach(function (barra) {
    const valor = parseFloat(barra.dataset.width);
    const maximo = parseFloat(barra.dataset.max);
    // Si hay data-max, calculamos el porcentaje; si no, el valor ya es un %
    const porcentaje = maximo ? Math.max((valor / maximo) * 100, 1.5) : valor;
    barra.style.width = porcentaje + '%';
  });
}

// Al cargar, los contadores muestran 0 para luego contar hacia arriba
if (!reducirMovimiento) {
  document.querySelectorAll('.counter').forEach(function (contador) {
    contador.textContent = '0' + (contador.dataset.suffix || '');
  });
}


/* ================================================================
   4. APARICIÓN DE ELEMENTOS AL BAJAR
   Todo lo que tiene la clase "reveal" en el HTML empieza invisible
   y aparece suavemente cuando entra en la pantalla.
   IntersectionObserver es un "vigilante" que avisa cuando un
   elemento se vuelve visible.
   ================================================================ */

function mostrarElemento(elemento) {
  elemento.classList.add('in-view');

  // Si tiene contadores (y no están en una pestaña escondida), que cuenten
  elemento.querySelectorAll('.counter').forEach(function (contador) {
    if (!contador.closest('.tab-panel:not(.active)')) animarContador(contador);
  });

  // Si tiene pestañas, llenamos las barras de la pestaña visible
  const panelVisible = elemento.querySelector('.tab-panel.active');
  if (panelVisible) llenarBarras(panelVisible);
}

const elementosQueAparecen = document.querySelectorAll('.reveal');

const vigilante = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      mostrarElemento(entrada.target);
      vigilante.unobserve(entrada.target); // ya apareció: dejamos de vigilarlo
    }
  });
}, { threshold: 0.15 }); // aparece cuando se ve el 15% del elemento

elementosQueAparecen.forEach(function (elemento) {
  vigilante.observe(elemento);
});


/* ================================================================
   5. PESTAÑAS COLOMBIA / BOGOTÁ / CHÍA
   Cada botón tiene data-tab="colombia" y muestra el panel con
   data-panel="colombia". La "píldora" azul se desliza al botón activo.
   ================================================================ */

const botonesPestana = Array.from(document.querySelectorAll('.tab-btn'));
const panelesPestana = document.querySelectorAll('.tab-panel');
const pildora = document.querySelector('.tab-indicator');
const grupoPestanas = document.querySelector('.tabs-group');
let pestanaActiva = 0;

function moverPildora() {
  const boton = botonesPestana[pestanaActiva];
  pildora.style.width = boton.offsetWidth + 'px';
  pildora.style.transform = 'translateX(' + boton.offsetLeft + 'px)';
}

function activarPestana(numero, darFoco) {
  // Si llega a -1 va a la última, y si pasa la última vuelve a la primera
  pestanaActiva = (numero + botonesPestana.length) % botonesPestana.length;
  const botonElegido = botonesPestana[pestanaActiva];
  const nombre = botonElegido.dataset.tab;

  botonesPestana.forEach(function (boton) {
    const esElElegido = boton === botonElegido;
    boton.classList.toggle('active', esElElegido);
    boton.setAttribute('aria-selected', esElElegido ? 'true' : 'false');
    boton.tabIndex = esElElegido ? 0 : -1;
  });

  let panelNuevo = null;
  panelesPestana.forEach(function (panel) {
    const esElPanel = panel.dataset.panel === nombre;
    panel.classList.toggle('active', esElPanel);
    if (esElPanel) panelNuevo = panel;
  });

  moverPildora();
  if (darFoco) botonElegido.focus();

  // Animamos barras y contadores solo si la sección ya se ve en pantalla
  if (panelNuevo && grupoPestanas.classList.contains('in-view')) {
    panelNuevo.querySelectorAll('.bar-fill').forEach(function (barra) { barra.style.width = '0%'; });
    panelNuevo.offsetWidth; // truco: obliga al navegador a "reiniciar" la animación
    llenarBarras(panelNuevo);
    panelNuevo.querySelectorAll('.counter').forEach(animarContador);
  }
}

botonesPestana.forEach(function (boton, numero) {
  boton.addEventListener('click', function () { activarPestana(numero); });

  // Con el teclado también se puede: flechas izquierda y derecha
  boton.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowRight') { evento.preventDefault(); activarPestana(pestanaActiva + 1, true); }
    if (evento.key === 'ArrowLeft') { evento.preventDefault(); activarPestana(pestanaActiva - 1, true); }
  });
});

window.addEventListener('resize', moverPildora);
activarPestana(0);
// Cuando terminan de cargar las fuentes, los botones cambian de ancho
document.fonts.ready.then(moverPildora);


/* ================================================================
   6. FOTOS Y VIDEOS QUE FALTAN
   Así puedes subir archivos sin tocar el código:
   - FOTOS: si una foto de merch o del equipo no existe todavía,
     la tarjeta muestra "Foto pendiente" y el nombre del archivo
     que hay que subir.
   - VIDEOS: el <video class="slot-video"> solo se muestra cuando
     el archivo existe. Mientras tanto se ve el recuadro de espera.
   ================================================================ */

function marcarFotoPendiente(foto) {
  const tarjeta = foto.closest('.member-card, .merch-card');
  if (!tarjeta || tarjeta.classList.contains('sin-foto')) return;
  tarjeta.classList.add('sin-foto');

  const aviso = document.createElement('span');
  aviso.className = 'photo-missing';
  aviso.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>' +
    '<b>Foto pendiente</b>' +
    '<small>' + foto.getAttribute('src') + '</small>' +
    (tarjeta.dataset.name ? '<span class="pending-name">' + tarjeta.dataset.name + '</span>' : '') +
    (tarjeta.dataset.role ? '<span class="pending-role">' + tarjeta.dataset.role + '</span>' : '');
  (foto.closest('.merch-photo') || tarjeta).appendChild(aviso);
}

document.querySelectorAll('.member-card img, .merch-card img').forEach(function (foto) {
  foto.addEventListener('error', function () { marcarFotoPendiente(foto); });
  // Por si la foto ya falló antes de que este código se ejecutara
  if (foto.complete && foto.naturalWidth === 0) marcarFotoPendiente(foto);
});

document.querySelectorAll('.slot-video').forEach(function (video) {
  function videoListo() { video.closest('.video-slot').classList.add('ready'); }
  video.addEventListener('loadedmetadata', videoListo);
  if (video.readyState >= 1) videoListo(); // ya había cargado
});


/* ================================================================
   7. FORMULARIOS
   Al enviar, se abre el programa de correo de la persona con el
   asunto y el mensaje ya escritos (eso hace "mailto:").
   ================================================================ */

function leer(id) {
  return document.getElementById(id).value.trim(); // trim quita espacios sobrantes
}

function prepararFormulario(idFormulario, idMensajeGracias, armarCorreo) {
  const formulario = document.getElementById(idFormulario);
  const gracias = document.getElementById(idMensajeGracias);

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // evita que la página se recargue

    const correo = armarCorreo();
    window.location.href =
      'mailto:' + CORREO_DE_CONTACTO +
      '?subject=' + encodeURIComponent(correo.asunto) +
      '&body=' + encodeURIComponent(correo.mensaje);

    gracias.classList.add('show');
    formulario.reset(); // limpia los campos
    setTimeout(function () { gracias.classList.remove('show'); }, 8000); // se oculta en 8 s
  });
}

// EDITABLE (texto): asunto y cuerpo de los correos que se generan
prepararFormulario('questionForm', 'qSuccess', function () {
  return {
    asunto: 'Pregunta para Up Style: ' + leer('qName'),
    mensaje: 'Nombre: ' + leer('qName') + '\n\nPregunta:\n' + leer('qText')
  };
});

prepararFormulario('donateForm', 'dSuccess', function () {
  return {
    asunto: 'Quiero donar jeans a Up Style: ' + leer('dName'),
    mensaje: 'Nombre: ' + leer('dName') +
             '\nContacto: ' + leer('dContact') +
             '\nCantidad de prendas: ' + leer('dQty')
  };
});


/* ================================================================
   8. VENTANAS EMERGENTES (merch y equipo)
   Al tocar un producto o integrante, se copia su información
   (los data-... del HTML) dentro de la ventana y se muestra.
   ================================================================ */

let ventanaAbierta = null;
let botonQueLaAbrio = null;

function abrirVentana(ventana, boton) {
  ventanaAbierta = ventana;
  botonQueLaAbrio = boton;
  ventana.classList.add('open');
  document.body.classList.add('modal-open'); // la página de atrás no se mueve
  setTimeout(function () { ventana.querySelector('.modal-close').focus(); }, 50);
}

function cerrarVentana() {
  if (!ventanaAbierta) return;
  ventanaAbierta.classList.remove('open');
  document.body.classList.remove('modal-open');
  ventanaAbierta = null;
  if (botonQueLaAbrio) botonQueLaAbrio.focus(); // el foco vuelve a donde estaba
}

// Se cierra con la X, tocando el fondo oscuro o con la tecla Escape
document.querySelectorAll('.modal-backdrop').forEach(function (ventana) {
  ventana.querySelector('.modal-close').addEventListener('click', cerrarVentana);
  ventana.addEventListener('click', function (evento) {
    if (evento.target === ventana) cerrarVentana();
  });
});
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') {
    cerrarVentana();
    abrirOCerrarMenu(false);
  }
});

// ---------- Ventana de producto ----------
const ventanaMerch = document.getElementById('merchModal');

document.querySelectorAll('.merch-card').forEach(function (tarjeta) {
  tarjeta.addEventListener('click', function () {
    const foto = tarjeta.querySelector('img');
    const hayFoto = !tarjeta.classList.contains('sin-foto');
    const fotoVentana = document.getElementById('merchModalPhoto');
    fotoVentana.hidden = !hayFoto;
    fotoVentana.src = hayFoto ? foto.src : 'data:,';
    fotoVentana.alt = foto.alt;
    document.getElementById('merchModalName').textContent = tarjeta.dataset.name || '';
    document.getElementById('merchModalPrice').textContent = tarjeta.dataset.price || '';
    document.getElementById('merchModalFeatures').textContent = tarjeta.dataset.features || '';
    abrirVentana(ventanaMerch, tarjeta);
  });
});

// ---------- Ventana de integrante ----------
const ventanaEquipo = document.getElementById('memberModal');
const cajaRedes = document.getElementById('memberModalSocials');

// Dibujos (íconos) de cada red social
const iconosRedes = {
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M16 3c.5 3 2.5 5 6 5.5"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10 9 5 3-5 3V9Z"/><rect x="2" y="5" width="20" height="14" rx="3"/></svg>'
};
const nombresRedes = { ig: 'Instagram', tiktok: 'TikTok', yt: 'YouTube' };

document.querySelectorAll('.member-card').forEach(function (tarjeta) {
  tarjeta.addEventListener('click', function () {
    const foto = tarjeta.querySelector('img');
    const hayFoto = !tarjeta.classList.contains('sin-foto');
    const fotoVentana = document.getElementById('memberModalPhoto');
    fotoVentana.hidden = !hayFoto;
    fotoVentana.src = hayFoto ? foto.src : 'data:,';
    fotoVentana.alt = foto.alt;
    document.getElementById('memberModalName').textContent = tarjeta.dataset.name || '';
    document.getElementById('memberModalRole').textContent = tarjeta.dataset.role || '';
    document.getElementById('memberModalBio').textContent = tarjeta.dataset.bio || '';

    // Creamos un botón por cada red social que tenga enlace
    cajaRedes.innerHTML = '';
    ['ig', 'tiktok', 'yt'].forEach(function (red) {
      const enlace = tarjeta.dataset[red];
      if (!enlace) return; // si está vacío, no se muestra
      const a = document.createElement('a');
      a.href = enlace;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = iconosRedes[red] + '<span>' + nombresRedes[red] + '</span>';
      cajaRedes.appendChild(a);
    });
    if (!cajaRedes.children.length) {
      cajaRedes.innerHTML = '<p class="empty">Aún no se han agregado redes sociales.</p>';
    }

    abrirVentana(ventanaEquipo, tarjeta);
  });
});
