(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // EDITABLE: correo real al que llegan las preguntas y donaciones
  var CONTACT_EMAIL = 'hola@upstyle.com';

  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scrollProgress');
  var heroBg = document.querySelector('.hero-bg');
  var processList = document.getElementById('processList');
  var processFill = processList ? processList.querySelector('.process-line-fill') : null;
  var processItems = processList ? Array.prototype.slice.call(processList.querySelectorAll('.process-item')) : [];

  // ---------- Menú en celular ----------
  var navToggle = document.getElementById('navToggle');
  var navlinks = document.getElementById('navlinks');
  function setMenu(open){
    navlinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  navToggle.addEventListener('click', function(){ setMenu(!navlinks.classList.contains('open')); });
  navlinks.addEventListener('click', function(e){ if(e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', function(e){
    if(navlinks.classList.contains('open') && !e.target.closest('.nav')) setMenu(false);
  });

  // ---------- Scrollspy: resalta el enlace de la sección visible ----------
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.navlinks a'));
  var spySections = navAnchors.map(function(a){ return document.querySelector(a.getAttribute('href')); });

  function updateSpy(){
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = -1;
    spySections.forEach(function(sec, i){ if(sec && sec.offsetTop <= pos) current = i; });
    navAnchors.forEach(function(a, i){ a.classList.toggle('active', i === current); });
  }

  // ---------- Todo lo que depende del scroll, en un solo frame ----------
  function onScroll(){
    var y = window.scrollY;
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    progress.style.transform = 'scaleX(' + (scrollable > 0 ? y / scrollable : 0) + ')';
    header.classList.toggle('scrolled', y > 40);
    updateSpy();

    if(reduceMotion) return;

    // Parallax suave de la foto principal
    if(heroBg && y < window.innerHeight * 1.2){
      heroBg.style.transform = 'translateY(' + (y * 0.3) + 'px)';
    }

    // La costura del proceso se "cose" a medida que bajas
    if(processFill){
      var r = processList.getBoundingClientRect();
      var mid = window.innerHeight * 0.6;
      var p = Math.min(Math.max((mid - r.top) / r.height, 0), 1);
      processFill.style.transform = 'scaleY(' + p + ')';
      processItems.forEach(function(item){
        item.classList.toggle('passed', item.getBoundingClientRect().top + 24 < mid);
      });
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){ onScroll(); ticking = false; });
  }, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
  if(reduceMotion){
    if(processFill) processFill.style.transform = 'scaleY(1)';
    processItems.forEach(function(item){ item.classList.add('passed'); });
  }

  // ---------- Contadores y barras ----------
  function formatNum(n){ return n.toLocaleString('es-CO'); }

  function runCounter(el){
    if(el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if(reduceMotion){ el.textContent = formatNum(target) + suffix; return; }
    var start = null, dur = 1600;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = formatNum(Math.round(target * eased)) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function fillBars(scope){
    scope.querySelectorAll('.bar-fill').forEach(function(bar){
      var max = parseFloat(bar.getAttribute('data-max'));
      var val = parseFloat(bar.getAttribute('data-width'));
      var pct = max ? Math.max((val / max) * 100, 1.5) : val;
      bar.style.width = pct + '%';
    });
  }

  // Los contadores arrancan en 0 (sin JS se ve el número real escrito en el HTML)
  if(!reduceMotion){
    document.querySelectorAll('.counter').forEach(function(c){ c.textContent = '0' + (c.getAttribute('data-suffix') || ''); });
  }

  // ---------- Aparición de elementos al hacer scroll ----------
  function activate(el){
    el.classList.add('in-view');
    el.querySelectorAll('.counter').forEach(function(c){
      if(!c.closest('.tab-panel:not(.active)')) runCounter(c);
    });
    var activePanel = el.querySelector('.tab-panel.active');
    if(activePanel) fillBars(activePanel);
  }
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ activate(entry.target); io.unobserve(entry.target); }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(activate);
  }

  // ---------- Pestañas (Colombia / Bogotá / Chía) ----------
  function initTabs(group){
    var row = document.querySelector('.tabs-row[data-tabgroup="' + group + '"]');
    if(!row) return;
    var buttons = Array.prototype.slice.call(row.querySelectorAll('.tab-btn'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel[data-tabgroup="' + group + '"]'));
    var indicator = row.querySelector('.tab-indicator');
    var wrapper = row.closest('.reveal');
    var activeIndex = 0;

    function moveIndicator(){
      var btn = buttons[activeIndex];
      indicator.style.width = btn.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    }
    function setActive(index, focus){
      activeIndex = (index + buttons.length) % buttons.length;
      var btn = buttons[activeIndex];
      var key = btn.getAttribute('data-tab');
      buttons.forEach(function(b, i){
        var on = i === activeIndex;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-panel') === key); });
      moveIndicator();
      if(focus) btn.focus();

      var activePanel = panels.filter(function(p){ return p.classList.contains('active'); })[0];
      // Solo anima si la sección ya está en pantalla
      if(activePanel && (!wrapper || wrapper.classList.contains('in-view'))){
        activePanel.querySelectorAll('.bar-fill').forEach(function(bar){ bar.style.width = '0%'; });
        activePanel.offsetWidth; // reinicia la transición de las barras
        fillBars(activePanel);
        activePanel.querySelectorAll('.counter').forEach(runCounter);
      }
    }
    buttons.forEach(function(btn, i){
      btn.addEventListener('click', function(){ setActive(i); });
      btn.addEventListener('keydown', function(e){
        if(e.key === 'ArrowRight'){ e.preventDefault(); setActive(activeIndex + 1, true); }
        if(e.key === 'ArrowLeft'){ e.preventDefault(); setActive(activeIndex - 1, true); }
      });
    });
    window.addEventListener('resize', moveIndicator);
    setActive(0);
    // Recalcula cuando cargan las fuentes (cambia el ancho de los botones)
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
  }
  initTabs('impacto');

  // ---------- Formularios: abren un correo ya escrito ----------
  function mailForm(formId, successId, build){
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = build();
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(data.subject) +
        '&body=' + encodeURIComponent(data.body);
      success.classList.add('show');
      form.reset();
      setTimeout(function(){ success.classList.remove('show'); }, 8000);
    });
  }
  function val(id){ return document.getElementById(id).value.trim(); }

  mailForm('questionForm', 'qSuccess', function(){
    return {
      subject: 'Pregunta para Up Style: ' + val('qName'),
      body: 'Nombre: ' + val('qName') + '\n\nPregunta:\n' + val('qText')
    };
  });
  mailForm('donateForm', 'dSuccess', function(){
    return {
      subject: 'Quiero donar jeans a Up Style: ' + val('dName'),
      body: 'Nombre: ' + val('dName') + '\nContacto: ' + val('dContact') + '\nCantidad de prendas: ' + document.getElementById('dQty').value
    };
  });

  // ---------- Modales (integrantes y productos) ----------
  var openModal = null;
  var lastTrigger = null;

  function showModal(backdrop, trigger){
    lastTrigger = trigger;
    openModal = backdrop;
    backdrop.classList.add('open');
    document.body.classList.add('modal-open');
    var closeBtn = backdrop.querySelector('.member-modal-close');
    setTimeout(function(){ closeBtn.focus(); }, 50);
  }
  function hideModal(){
    if(!openModal) return;
    openModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    openModal = null;
    if(lastTrigger) lastTrigger.focus();
  }
  document.querySelectorAll('.member-modal-backdrop').forEach(function(backdrop){
    backdrop.addEventListener('click', function(e){ if(e.target === backdrop) hideModal(); });
    backdrop.querySelector('.member-modal-close').addEventListener('click', hideModal);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ hideModal(); setMenu(false); }
  });

  // Integrantes: se abre al hacer clic en su foto
  var memberModal = document.getElementById('memberModalBackdrop');
  var modalPhoto = document.getElementById('memberModalPhoto');
  var modalName = document.getElementById('memberModalName');
  var modalRole = document.getElementById('memberModalRole');
  var modalBio = document.getElementById('memberModalBio');
  var modalSocials = document.getElementById('memberModalSocials');
  var socialIcons = {
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M16 3c.5 3 2.5 5 6 5.5"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10 9 5 3-5 3V9Z"/><rect x="2" y="5" width="20" height="14" rx="3"/></svg>'
  };
  var socialLabels = { ig: 'Instagram', tiktok: 'TikTok', yt: 'YouTube' };

  document.querySelectorAll('.member-card.has-photo').forEach(function(card){
    card.addEventListener('click', function(){
      var img = card.querySelector('img');
      modalPhoto.src = img.src;
      modalPhoto.alt = img.alt;
      modalName.textContent = card.getAttribute('data-name') || '';
      modalRole.textContent = card.getAttribute('data-role') || '';
      modalBio.textContent = card.getAttribute('data-bio') || '';

      modalSocials.innerHTML = '';
      ['ig', 'tiktok', 'yt'].forEach(function(key){
        var value = card.getAttribute('data-' + key);
        if(value){
          var a = document.createElement('a');
          a.href = value;
          a.target = '_blank';
          a.rel = 'noopener';
          a.innerHTML = socialIcons[key] + '<span>' + socialLabels[key] + '</span>';
          modalSocials.appendChild(a);
        }
      });
      if(!modalSocials.children.length){
        modalSocials.innerHTML = '<p class="empty">Aún no se han agregado redes sociales.</p>';
      }
      showModal(memberModal, card);
    });
  });

  // Productos (merch)
  var merchModal = document.getElementById('merchModalBackdrop');
  var merchModalPhoto = document.getElementById('merchModalPhoto');
  var merchModalName = document.getElementById('merchModalName');
  var merchModalPrice = document.getElementById('merchModalPrice');
  var merchModalFeatures = document.getElementById('merchModalFeatures');

  document.querySelectorAll('.merch-card.has-photo').forEach(function(card){
    card.addEventListener('click', function(){
      var img = card.querySelector('img');
      merchModalPhoto.src = img.src;
      merchModalPhoto.alt = img.alt;
      merchModalName.textContent = card.getAttribute('data-name') || '';
      merchModalPrice.textContent = card.getAttribute('data-price') || '';
      merchModalFeatures.textContent = card.getAttribute('data-features') || '';
      showModal(merchModal, card);
    });
  });
})();
