/* Fondazione C.R.I.S.T.O. — vanilla interactions */
(function () {
  'use strict';
  var doc = document;
  var body = doc.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Year */
  var y = doc.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Preloader */
  var preloader = doc.getElementById('preloader');
  var preImg = doc.getElementById('preloaderImg');
  var finishLoad = function(){ body.classList.add('is-loaded'); };
  if (preloader) {
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ preloader.classList.add('is-in'); });
    });
    if (preImg && !preImg.complete) {
      preImg.addEventListener('load', function(){ preloader.classList.add('is-ready'); }, { once:true });
    } else { preloader.classList.add('is-ready'); }
    setTimeout(finishLoad, 2900);
  } else { setTimeout(finishLoad, 600); }

  /* Header scroll */
  var header = doc.getElementById('siteHeader');
  var onScroll = function(){
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* Mobile menu */
  var toggle = doc.getElementById('menuToggle');
  var menu   = doc.getElementById('mobileMenu');
  var closeMenu = function(){
    if (!menu) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-hidden','true');
    body.style.overflow = '';
  };
  if (toggle && menu) {
    toggle.addEventListener('click', function(){
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
    doc.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeMenu(); });
  }

  /* ══════════════════════════════════════════════════
     CINEMATIC REVEAL SYSTEM
     ══════════════════════════════════════════════════ */

  /* 1. Inner <img> curtain wipe — applied to image wrapper children */
  doc.querySelectorAll('.intro__img, .news-card__media, .vision__portrait-frame').forEach(function(wrapper){
    var img = wrapper.querySelector('img');
    if (img) img.classList.add('img-curtain');
  });

  /* 2. Section labels — blur + letter-spacing */
  doc.querySelectorAll('.section-label').forEach(function(el){
    el.classList.add('reveal--label');
  });

  /* 3. Stats — spring scale pop (NO blur) */
  doc.querySelectorAll('.stat').forEach(function(el){
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    el.classList.add('reveal--stat');
  });

  /* 4. Logo badge — spin pop */
  doc.querySelectorAll('.intro__badge').forEach(function(el){
    el.classList.add('reveal--badge');
  });

  /* 5. News cards — 3D tilt */
  doc.querySelectorAll('.news-card').forEach(function(el){
    el.classList.add('reveal--card');
  });

  /* 6. CTA blocks — stagger 3D tilt */
  doc.querySelectorAll('.cta__block').forEach(function(el){
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    el.classList.add('reveal--cta-block');
  });

  /* 7. Word-wrap .display headings for stagger
        — SKIP headings inside .hero (they use CSS keyframe animation) */
  doc.querySelectorAll('.display').forEach(function(heading){
    if (heading.closest('.hero')) return;       // hero uses its own keyframe
    if (heading.querySelector('.word')) return; // already wrapped
    heading.setAttribute('aria-label', heading.textContent.trim());
    var html = '';
    heading.innerHTML.split(/(<[^>]+>)/).forEach(function(chunk){
      if (chunk.startsWith('<')) { html += chunk; }
      else { html += chunk.replace(/(\S+)/g, '<span class="word">$1</span>'); }
    });
    heading.innerHTML = html;
  });

  /* 8. Collect all .reveal elements */
  var revealEls = doc.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduce) {

    /* Scroll direction tracker */
    var lastY = window.scrollY;
    var dir   = 1; // 1 = down, -1 = up
    window.addEventListener('scroll', function(){
      var cur = window.scrollY;
      dir = cur >= lastY ? 1 : -1;
      lastY = cur;
    }, { passive:true });

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        var el    = en.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);

        if (en.isIntersecting) {
          /* Apply delay */
          el.style.transitionDelay = delay + 'ms';

          /* Word spans stagger on top of element delay */
          el.querySelectorAll('.word').forEach(function(w, i){
            w.style.transitionDelay = (delay + i * 65) + 'ms';
          });

          /* Curtain fires slightly after wrapper slides in */
          var curtain = el.querySelector('.img-curtain');
          if (curtain) curtain.style.transitionDelay = (delay + 90) + 'ms';

          requestAnimationFrame(function(){
            el.classList.remove('is-out','is-exit-up','is-exit-down');
            el.classList.add('is-in');
          });

        } else {
          /* Reset all delays instantly */
          el.style.transitionDelay = '0ms';
          el.querySelectorAll('.word').forEach(function(w){
            w.style.transitionDelay = '0ms';
          });
          var curtain = el.querySelector('.img-curtain');
          if (curtain) curtain.style.transitionDelay = '0ms';

          requestAnimationFrame(function(){
            el.classList.remove('is-in');
            el.classList.add('is-out', dir === 1 ? 'is-exit-up' : 'is-exit-down');
          });
        }
      });
    }, {
      rootMargin: '0px 0px -5% 0px',
      threshold:  [0.06, 0.18]
    });

    revealEls.forEach(function(el){
      el.classList.add('is-out');
      io.observe(el);
    });

  } else {
    /* No IO support — just show everything */
    revealEls.forEach(function(el){ el.classList.add('is-in'); });
  }

  /* Active nav highlight */
  var navLinks = doc.querySelectorAll('.nav__link');
  var sections = ['top','cosa-facciamo','news','contatti']
    .map(function(id){ return doc.getElementById(id); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) {
          var id = en.target.id;
          navLinks.forEach(function(l){
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px' });
    sections.forEach(function(s){ spy.observe(s); });
  }

  /* Parallax on hero image */
  var parallaxEls = doc.querySelectorAll('[data-parallax] img');
  if (parallaxEls.length && !reduce) {
    var ticking = false;
    var update = function(){
      parallaxEls.forEach(function(img){
        var rect = img.parentElement.getBoundingClientRect();
        var vh   = window.innerHeight;
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        var yv = Math.max(-40, Math.min(40, progress * -30));
        img.style.transform = 'translate3d(0,' + yv + 'px,0) scale(1.08)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function(){
      if (!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive:true });
    update();
  }

  /* Cookie banner */
  var banner = doc.getElementById('cookieBanner');
  if (banner) {
    setTimeout(function(){ banner.classList.add('is-visible'); }, 900);
    banner.querySelectorAll('[data-cookie]').forEach(function(btn){
      btn.addEventListener('click', function(){
        banner.classList.remove('is-visible');
        banner.classList.add('is-dismissed');
      });
    });
  }
})();