/*
  Up Style · script.js
  Comportamiento de la página.

  Índice
    0. Ajustes
    1. Menú en celular
    2. Efectos de scroll
    3. Contadores y barras
    4. Aparición de elementos
    5. Pestañas Colombia / Bogotá / Chía
    6. Fotos y videos
    7. Formularios
    8. Ventanas emergentes (merch y equipo)
    9. Carrusel del inicio
    10. Mascota flotante
*/


/* ================================================================
   0. AJUSTES
   ================================================================ */

// Destino de los formularios (mailto)
const CORREO_DE_CONTACTO = 'hola@upstyle.com';

const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ================================================================
   1. MENÚ EN CELULAR
   ================================================================ */

const botonMenu = document.getElementById('navToggle');
const listaMenu = document.getElementById('navlinks');

function abrirOCerrarMenu(abrir) {
  listaMenu.classList.toggle('open', abrir);
  document.getElementById('siteHeader').classList.toggle('menu-abierto', abrir);
  document.body.classList.toggle('menu-open', abrir); // bloquea el scroll de fondo
  botonMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
}

botonMenu.addEventListener('click', function () {
  const estaAbierto = listaMenu.classList.contains('open');
  abrirOCerrarMenu(!estaAbierto);
});

// Cierra el menú al elegir un enlace
listaMenu.addEventListener('click', function (evento) {
  if (evento.target.closest('a')) abrirOCerrarMenu(false);
});

// Cierra el menú al hacer clic fuera de la navegación
document.addEventListener('click', function (evento) {
  if (listaMenu.classList.contains('open') && !evento.target.closest('.nav')) {
    abrirOCerrarMenu(false);
  }
});


/* ================================================================
   2. EFECTOS DE SCROLL
   Barra de progreso, menú compacto, sección activa y parallax.
   ================================================================ */

const encabezado = document.getElementById('siteHeader');
const barraProgreso = document.getElementById('scrollProgress');
const fotoInicio = document.querySelector('.hero-bg');
const fotoOds = document.querySelector('.ods-bg');

const enlacesMenu = document.querySelectorAll('.navlinks a');
const pildoraMenu = document.querySelector('.nav-pill');
const seccionInicio = document.getElementById('inicio');
let mouseEnMenu = false;

function moverPildoraMenu(enlace) {
  if (!enlace) {
    pildoraMenu.style.opacity = '0';
    return;
  }
  pildoraMenu.style.opacity = '1';
  pildoraMenu.style.width = enlace.offsetWidth + 'px';
  pildoraMenu.style.transform = 'translateX(' + enlace.parentElement.offsetLeft + 'px)';
}

// La píldora sigue al puntero y, al salir, vuelve a la sección activa
enlacesMenu.forEach(function (enlace) {
  enlace.addEventListener('mouseenter', function () {
    mouseEnMenu = true;
    moverPildoraMenu(enlace);
  });
});
listaMenu.addEventListener('mouseleave', function () {
  mouseEnMenu = false;
  moverPildoraMenu(document.querySelector('.navlinks a.active'));
});

function resaltarSeccionActual() {
  const referencia = window.scrollY + window.innerHeight * 0.35;

  enlacesMenu.forEach(function (enlace) {
    const seccion = document.querySelector(enlace.getAttribute('href'));
    const empieza = seccion.offsetTop;
    const termina = empieza + seccion.offsetHeight;
    enlace.classList.toggle('active', referencia >= empieza && referencia < termina);
  });
  if (!mouseEnMenu) moverPildoraMenu(document.querySelector('.navlinks a.active'));
}

function alBajar() {
  const bajado = window.scrollY;
  const totalQueSePuedeBajar = document.documentElement.scrollHeight - window.innerHeight;

  const progreso = totalQueSePuedeBajar > 0 ? bajado / totalQueSePuedeBajar : 0;
  barraProgreso.style.transform = 'scaleX(' + progreso + ')';

  encabezado.classList.toggle('scrolled', bajado > 40);

  const finDelInicio = seccionInicio.offsetHeight - encabezado.offsetHeight;
  encabezado.classList.toggle('sobre-inicio', bajado < finDelInicio);

  resaltarSeccionActual();

  if (reducirMovimiento) return;

  if (bajado < window.innerHeight * 1.2) {
    fotoInicio.style.transform = 'translateY(' + bajado * 0.3 + 'px)';
  }

  const cajaOds = fotoOds.parentElement.getBoundingClientRect();
  if (cajaOds.bottom > 0 && cajaOds.top < window.innerHeight) {
    fotoOds.style.transform = 'translateY(' + cajaOds.top * -0.15 + 'px)';
  }
}

// Limita el cálculo a un cuadro de animación por evento de scroll
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
// Las fuentes web cambian el ancho de los enlaces: se recoloca la píldora
document.fonts.ready.then(alBajar);


/* ================================================================
   3. CONTADORES Y BARRAS
   ================================================================ */

function ponerPuntosDeMiles(numero) {
  return numero.toLocaleString('es-CO');
}

function animarContador(contador) {
  if (contador.dataset.yaConto) return;
  contador.dataset.yaConto = 'si';

  const numeroFinal = parseFloat(contador.dataset.target) || 0;
  const despues = contador.dataset.suffix || '';

  if (reducirMovimiento) {
    contador.textContent = ponerPuntosDeMiles(numeroFinal) + despues;
    return;
  }

  const duracion = 1600;
  let inicio = null;

  function paso(tiempo) {
    if (!inicio) inicio = tiempo;
    const avance = Math.min((tiempo - inicio) / duracion, 1);
    const suave = 1 - Math.pow(1 - avance, 4); // ease-out cuártico
    contador.textContent = ponerPuntosDeMiles(Math.round(numeroFinal * suave)) + despues;
    if (avance < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

// data-width es un porcentaje, o un valor absoluto si hay data-max
function llenarBarras(contenedor) {
  contenedor.querySelectorAll('.bar-fill').forEach(function (barra) {
    const valor = parseFloat(barra.dataset.width);
    const maximo = parseFloat(barra.dataset.max);
    const porcentaje = maximo ? Math.max((valor / maximo) * 100, 1.5) : valor;
    barra.style.width = porcentaje + '%';
  });
}

if (!reducirMovimiento) {
  document.querySelectorAll('.counter').forEach(function (contador) {
    contador.textContent = '0' + (contador.dataset.suffix || '');
  });
}


/* ================================================================
   4. APARICIÓN DE ELEMENTOS
   ================================================================ */

function mostrarElemento(elemento) {
  elemento.classList.add('in-view');

  // Los contadores de pestañas ocultas se animan al activarlas
  elemento.querySelectorAll('.counter').forEach(function (contador) {
    if (!contador.closest('.tab-panel:not(.active)')) animarContador(contador);
  });

  const panelVisible = elemento.querySelector('.tab-panel.active');
  if (panelVisible) llenarBarras(panelVisible);
}

const elementosQueAparecen = document.querySelectorAll('.reveal');

const vigilante = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      mostrarElemento(entrada.target);
      vigilante.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

elementosQueAparecen.forEach(function (elemento) {
  vigilante.observe(elemento);
});

// Ciclo del proceso: el diagrama completo (computador) y cada paso y el
// cierre (celular) se activan por separado; style.css decide qué se anima.
const vigilanteCiclo = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('in-view');
      vigilanteCiclo.unobserve(entrada.target);
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll('.ciclo, .ciclo-paso, .ciclo-centro').forEach(function (elemento) {
  vigilanteCiclo.observe(elemento);
});


/* ================================================================
   5. PESTAÑAS COLOMBIA / BOGOTÁ / CHÍA
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
  // Navegación circular
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

  if (panelNuevo && grupoPestanas.classList.contains('in-view')) {
    panelNuevo.querySelectorAll('.bar-fill').forEach(function (barra) { barra.style.width = '0%'; });
    panelNuevo.offsetWidth; // fuerza un reflow para reiniciar la transición
    llenarBarras(panelNuevo);
    panelNuevo.querySelectorAll('.counter').forEach(animarContador);
  }
}

botonesPestana.forEach(function (boton, numero) {
  boton.addEventListener('click', function () { activarPestana(numero); });

  boton.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowRight') { evento.preventDefault(); activarPestana(pestanaActiva + 1, true); }
    if (evento.key === 'ArrowLeft') { evento.preventDefault(); activarPestana(pestanaActiva - 1, true); }
  });
});

window.addEventListener('resize', moverPildora);
activarPestana(0);
document.fonts.ready.then(moverPildora);


/* ================================================================
   6. FOTOS Y VIDEOS
   Imágenes no disponibles, videos opcionales y reproducción
   automática al entrar en pantalla.
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
    '<b>Foto próximamente</b>' +
    (tarjeta.dataset.name ? '<span class="pending-name">' + tarjeta.dataset.name + '</span>' : '') +
    (tarjeta.dataset.role ? '<span class="pending-role">' + tarjeta.dataset.role + '</span>' : '');
  (foto.closest('.merch-photo') || tarjeta).appendChild(aviso);
}

document.querySelectorAll('.member-card img, .merch-card img').forEach(function (foto) {
  foto.addEventListener('error', function () { marcarFotoPendiente(foto); });
  // La imagen pudo fallar antes de registrar el evento
  if (foto.complete && foto.naturalWidth === 0) marcarFotoPendiente(foto);
});

document.querySelectorAll('.slot-video').forEach(function (video) {
  function videoListo() { video.closest('.video-slot').classList.add('ready'); }
  video.addEventListener('loadedmetadata', videoListo);
  if (video.readyState >= 1) videoListo();
});

const vigilanteVideos = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    const video = entrada.target;
    if (entrada.isIntersecting) {
      // El navegador puede bloquear la reproducción automática
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.5 });

if (!reducirMovimiento) {
  document.querySelectorAll('video[data-play-on-scroll]').forEach(function (video) {
    vigilanteVideos.observe(video);
  });
}


/* ================================================================
   7. FORMULARIOS
   Generan un correo (mailto) con asunto y mensaje prellenados.
   ================================================================ */

function leer(id) {
  return document.getElementById(id).value.trim();
}

function prepararFormulario(idFormulario, idMensajeGracias, armarCorreo) {
  const formulario = document.getElementById(idFormulario);
  const gracias = document.getElementById(idMensajeGracias);

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const correo = armarCorreo();
    window.location.href =
      'mailto:' + CORREO_DE_CONTACTO +
      '?subject=' + encodeURIComponent(correo.asunto) +
      '&body=' + encodeURIComponent(correo.mensaje);

    gracias.classList.add('show');
    formulario.reset();
    setTimeout(function () { gracias.classList.remove('show'); }, 8000);
  });
}

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
   Se llenan con los atributos data-* de la tarjeta seleccionada.
   ================================================================ */

let ventanaAbierta = null;
let botonQueLaAbrio = null;
const zonasDeFondo = document.querySelectorAll('body > header, body > main, body > footer, body > .mascota');

// inert deja el resto de la página fuera del foco mientras la ventana está abierta
function bloquearFondo(bloquear) {
  zonasDeFondo.forEach(function (zona) { zona.inert = bloquear; });
}

function abrirVentana(ventana, boton) {
  ventanaAbierta = ventana;
  botonQueLaAbrio = boton;
  ventana.classList.add('open');
  document.body.classList.add('modal-open');
  bloquearFondo(true);
  setTimeout(function () { ventana.querySelector('.modal-close').focus(); }, 50);
}

function cerrarVentana() {
  if (!ventanaAbierta) return;
  ventanaAbierta.classList.remove('open');
  document.body.classList.remove('modal-open');
  bloquearFondo(false);
  ventanaAbierta = null;
  if (botonQueLaAbrio) botonQueLaAbrio.focus(); // devuelve el foco a la tarjeta
}

// Cierre con el botón, clic en el fondo o tecla Escape
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

// Sin foto disponible, la ventana pasa a una sola columna
function ponerFoto(ventana, idFoto, tarjeta) {
  const foto = tarjeta.querySelector('img');
  const hayFoto = !tarjeta.classList.contains('sin-foto');
  const fotoVentana = document.getElementById(idFoto);
  fotoVentana.src = hayFoto ? foto.src : 'data:,';
  fotoVentana.alt = foto.alt;
  ventana.querySelector('.modal').classList.toggle('modal-sin-foto', !hayFoto);
}

// ---------- Producto ----------
const ventanaMerch = document.getElementById('merchModal');

document.querySelectorAll('.merch-card').forEach(function (tarjeta) {
  tarjeta.addEventListener('click', function () {
    ponerFoto(ventanaMerch, 'merchModalPhoto', tarjeta);
    document.getElementById('merchModalName').textContent = tarjeta.dataset.name || '';
    document.getElementById('merchModalPrice').textContent = tarjeta.dataset.price || '';
    document.getElementById('merchModalFeatures').textContent = tarjeta.dataset.features || '';
    abrirVentana(ventanaMerch, tarjeta);
  });
});

// ---------- Integrante ----------
const ventanaEquipo = document.getElementById('memberModal');
const cajaRedes = document.getElementById('memberModalSocials');
const tituloRedes = ventanaEquipo.querySelector('.socials-title');

// El orden de la lista define el orden de los botones.
// "clave" corresponde al atributo data-* de la tarjeta.
const redesSociales = [
  { clave: 'ig', nombre: 'Instagram',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>' },
  { clave: 'tiktok', nombre: 'TikTok',
    icono: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
  { clave: 'yt', nombre: 'YouTube',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10 9 5 3-5 3V9Z"/><rect x="2" y="5" width="20" height="14" rx="3"/></svg>' },
  { clave: 'behance', nombre: 'Behance',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h5.5a3 3 0 0 1 0 6H3zM3 12h6a3 3 0 0 1 0 6H3zM14 14h7a3.5 3.5 0 1 0-1 2.5M15 7h5"/></svg>' },
  { clave: 'linkedin', nombre: 'LinkedIn',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>' },
  { clave: 'web', nombre: 'Portafolio',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>' }
];

// "https://www.instagram.com/upstyle/" → "@upstyle"; un dominio se devuelve tal cual
function sacarUsuario(enlace) {
  const partes = enlace.split('?')[0].split('/').filter(function (parte) { return parte; });
  const ultima = partes[partes.length - 1] || '';
  if (partes.length <= 2) return ultima;
  return ultima.startsWith('@') ? ultima : '@' + ultima;
}

document.querySelectorAll('.member-card').forEach(function (tarjeta) {
  tarjeta.addEventListener('click', function () {
    ponerFoto(ventanaEquipo, 'memberModalPhoto', tarjeta);
    document.getElementById('memberModalName').textContent = tarjeta.dataset.name || '';
    document.getElementById('memberModalRole').textContent = tarjeta.dataset.role || '';
    document.getElementById('memberModalBio').textContent = tarjeta.dataset.bio || '';

    cajaRedes.innerHTML = '';
    redesSociales.forEach(function (red) {
      const enlace = tarjeta.dataset[red.clave];
      if (!enlace) return;
      const a = document.createElement('a');
      a.href = enlace;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = red.icono +
        '<span><span class="red">' + red.nombre + '</span>' +
        '<span class="usuario"></span></span>';
      a.querySelector('.usuario').textContent = sacarUsuario(enlace);
      cajaRedes.appendChild(a);
    });

    // Sin redes registradas se oculta el bloque completo
    const sinRedes = !cajaRedes.children.length;
    tituloRedes.hidden = sinRedes;
    cajaRedes.hidden = sinRedes;

    abrirVentana(ventanaEquipo, tarjeta);
  });
});


/* ================================================================
   9. CARRUSEL DEL INICIO
   El cambio de foto ocurre al terminar de llenarse la barra activa
   (animationend). Así, la pausa por CSS detiene a la vez el tiempo,
   la barra y el zoom.
   ================================================================ */

const diapositivas = Array.from(fotoInicio.querySelectorAll('.hero-slide'));
const cajaBarras = document.querySelector('.carrusel-barras');
const DURACION_SALIDA = 1300; // ms, algo más que --carrusel-transicion

let fotoActual = 0;
let solicitudActual = 0;
let temporizadorSalida = null;
const fotosPrecargadas = [];
const motivosDePausa = new Set();

function urlDeFoto(diapositiva) {
  const fondo = getComputedStyle(diapositiva).backgroundImage;
  const coincidencia = fondo.match(/url\(["']?(.*?)["']?\)/);
  return coincidencia ? coincidencia[1] : '';
}

// Promesa que se cumple cuando la foto ya se puede pintar sin parpadeo
function precargarFoto(indice) {
  if (!fotosPrecargadas[indice]) {
    const imagen = new Image();
    imagen.src = urlDeFoto(diapositivas[indice]);
    fotosPrecargadas[indice] = imagen.decode().catch(function () {});
  }
  return fotosPrecargadas[indice];
}

const barrasCarrusel = diapositivas.map(function (diapositiva, indice) {
  const barra = document.createElement('button');
  barra.type = 'button';
  barra.className = 'carrusel-barra';
  barra.setAttribute('aria-label', 'Ver foto ' + (indice + 1) + ' de ' + diapositivas.length);
  barra.innerHTML = '<span class="carrusel-progreso"></span>';
  barra.addEventListener('click', function () {
    mostrarFoto(indice);
  });
  return barra;
});

function marcarFotoActiva(indice) {
  diapositivas.forEach(function (diapositiva, i) {
    if (i === indice) diapositiva.removeAttribute('aria-hidden');
    else diapositiva.setAttribute('aria-hidden', 'true');
  });
  barrasCarrusel.forEach(function (barra) {
    barra.classList.remove('es-activa');
    barra.removeAttribute('aria-current');
  });
  void cajaBarras.offsetWidth; // reinicia el llenado aunque sea la misma barra
  barrasCarrusel[indice].classList.add('es-activa');
  barrasCarrusel[indice].setAttribute('aria-current', 'true');
}

function cambiarDiapositiva(indice) {
  const anterior = diapositivas[fotoActual];
  const siguiente = diapositivas[indice];

  // Una salida sin terminar se descarta para no acumular capas
  clearTimeout(temporizadorSalida);
  diapositivas.forEach(function (diapositiva) {
    if (diapositiva === anterior) return;
    diapositiva.classList.remove('es-saliente', 'es-activa');
    diapositiva.style.scale = '';
  });
  void siguiente.offsetWidth; // la entrante parte siempre desde la derecha

  // Congela el zoom de la saliente en su valor actual para que no salte
  anterior.style.scale = getComputedStyle(anterior).scale;
  anterior.classList.remove('es-activa');
  anterior.classList.add('es-saliente');
  siguiente.classList.add('es-activa');

  fotoActual = indice;
  marcarFotoActiva(indice);
  precargarFoto((indice + 1) % diapositivas.length);

  temporizadorSalida = setTimeout(function () {
    anterior.classList.remove('es-saliente');
    anterior.style.scale = '';
  }, DURACION_SALIDA);
}

// Espera a que la foto esté cargada; si llega otra orden antes, gana la última
function mostrarFoto(indice) {
  if (indice === fotoActual) return;
  const solicitud = ++solicitudActual;
  precargarFoto(indice).then(function () {
    if (solicitud === solicitudActual && indice !== fotoActual) cambiarDiapositiva(indice);
  });
}

function pausarCarrusel(motivo, pausar) {
  if (pausar) motivosDePausa.add(motivo);
  else motivosDePausa.delete(motivo);
  seccionInicio.classList.toggle('en-pausa', motivosDePausa.size > 0);
}

if (diapositivas.length > 1) {
  barrasCarrusel.forEach(function (barra) {
    cajaBarras.appendChild(barra);
  });

  diapositivas[0].classList.add('es-activa');
  fotoInicio.classList.add('carrusel-listo');
  marcarFotoActiva(0);
  precargarFoto(1);

  // Con movimiento reducido la barra no se anima y el cambio es manual
  cajaBarras.addEventListener('animationend', function (evento) {
    if (evento.animationName !== 'llenarBarra' || reducirMovimiento) return;
    mostrarFoto((fotoActual + 1) % diapositivas.length);
  });

  seccionInicio.addEventListener('pointerenter', function (evento) {
    if (evento.pointerType === 'mouse') pausarCarrusel('mouse', true);
  });
  seccionInicio.addEventListener('pointerleave', function (evento) {
    if (evento.pointerType === 'mouse') pausarCarrusel('mouse', false);
  });
  document.addEventListener('visibilitychange', function () {
    pausarCarrusel('pestana', document.visibilityState === 'hidden');
  });
  new IntersectionObserver(function (entradas) {
    pausarCarrusel('pantalla', !entradas[0].isIntersecting);
  }).observe(seccionInicio);
}


/* ================================================================
   10. MASCOTA FLOTANTE
   Ren lleva al formulario de donación: al hacer clic caen prendas a su
   bote de jean y luego la página baja al formulario. Se oculta en el
   inicio y mientras el formulario o el pie de página están en pantalla.
   ================================================================ */

const mascota = document.getElementById('mascota');
const tarjetaDonar = document.getElementById('donar');
const campoNombreDonante = document.getElementById('dName');
const piePagina = document.querySelector('body > footer');

// Espera a que termine el desplazamiento suave (con respaldo por tiempo)
function alTerminarDesplazamiento(accion) {
  let hecho = false;
  function terminar() {
    if (hecho) return;
    hecho = true;
    window.removeEventListener('scrollend', terminar);
    accion();
  }
  window.addEventListener('scrollend', terminar, { once: true });
  setTimeout(terminar, reducirMovimiento ? 50 : 1200);
}

function resaltarTarjetaDonar() {
  tarjetaDonar.classList.remove('resaltada');
  void tarjetaDonar.offsetWidth; // reinicia la animación si ya estaba aplicada
  tarjetaDonar.classList.add('resaltada');
  setTimeout(function () { tarjetaDonar.classList.remove('resaltada'); }, 1200);
}

function irAlFormularioDonar() {
  tarjetaDonar.scrollIntoView({
    behavior: reducirMovimiento ? 'auto' : 'smooth',
    block: 'center'
  });
  alTerminarDesplazamiento(function () {
    if (campoNombreDonante) campoNombreDonante.focus({ preventScroll: true });
    resaltarTarjetaDonar();
  });
}

// Tiempos de la animación del bote (ms), sincronizados con style.css
const MASCOTA_GRACIAS = reducirMovimiento ? 0 : 980;
const MASCOTA_IR_AL_FORMULARIO = reducirMovimiento ? 600 : 1150;
const MASCOTA_FIN = 1900;
let mascotaAnimando = false;

if (mascota && tarjetaDonar) {
  mascota.addEventListener('click', function (evento) {
    evento.preventDefault();
    if (mascotaAnimando) return; // los clics repetidos no reinician la animación
    mascotaAnimando = true;

    mascota.classList.add('llenando');
    setTimeout(function () { mascota.classList.add('agradece'); }, MASCOTA_GRACIAS);
    setTimeout(irAlFormularioDonar, MASCOTA_IR_AL_FORMULARIO);
    setTimeout(function () {
      mascota.classList.remove('llenando', 'agradece');
      mascotaAnimando = false;
    }, MASCOTA_FIN);
  });

  // Zonas que la mascota no debe tapar: el formulario, el pie y los botones del inicio
  const zonasEnPantalla = new Set();
  function anotarZonas(entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) zonasEnPantalla.add(entrada.target);
      else zonasEnPantalla.delete(entrada.target);
    });
    mascota.classList.toggle('mascota-oculta', zonasEnPantalla.size > 0);
  }

  const observadorMascota = new IntersectionObserver(anotarZonas, { rootMargin: '0px 0px -12% 0px' });
  observadorMascota.observe(tarjetaDonar);
  if (piePagina) observadorMascota.observe(piePagina);

  // El inicio cuenta mientras ocupa la franja inferior, donde está la mascota
  new IntersectionObserver(anotarZonas, { rootMargin: '-75% 0px 0px 0px' }).observe(seccionInicio);
}
