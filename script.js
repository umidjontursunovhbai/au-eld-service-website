(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...document.querySelectorAll('[data-enter]')];
  const activeAnimations = new Set();
  const targetAnimations = new WeakMap();
  const lastDetailPlay = new WeakMap();
  const revealed = new WeakSet();
  let observer;
  let detailObserver;

  function playMotion(target, frames, options) {
    if (reducedMotion.matches || typeof target.animate !== 'function') return;
    // A quick scroll reversal must not stack a second animation on the same text.
    if (targetAnimations.get(target)?.playState === 'running') return;
    const animation = target.animate(frames, {
      duration: 1000, easing: 'cubic-bezier(.22,.65,.25,1)', fill: 'backwards', ...options
    });
    targetAnimations.set(target, animation);
    activeAnimations.add(animation);
    const release = () => {
      activeAnimations.delete(animation);
      if (targetAnimations.get(target) === animation) targetAnimations.delete(target);
    };
    animation.finished.then(release, release);
  }

  // Preserve headings, real text and whitespace. No duplicate screen-reader copy,
  // character scrambling, fixed-width masks or overflow-hidden text wrappers.
  const motionHeadings = [...document.querySelectorAll('h1 > span, h2, h3')];
  motionHeadings.forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim() && !walker.currentNode.parentElement.closest('svg')) {
        textNodes.push(walker.currentNode);
      }
    }
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part.trim()) fragment.append(document.createTextNode(part));
        else {
          const word = document.createElement('span');
          word.className = 'motion-word';
          word.textContent = part;
          fragment.append(word);
        }
      });
      node.replaceWith(fragment);
    });
    heading.dataset.motionDetail = 'words';
  });
  document.querySelectorAll('.eyebrow, .body-copy, .hero-intro > p, .support-signals p, .service-card li, .promise p, .trial-copy > p:not(.eyebrow), .contact-channels small, .channel strong, .phone-channel strong').forEach(el => {
    el.dataset.motionDetail = el.classList.contains('eyebrow') ? 'label' : 'copy';
  });
  document.querySelectorAll('.intro-strip > div strong, .integrations li, .price, .human-note__mark, .channel-symbol, .photo-link b').forEach(el => { el.dataset.motionDetail = 'spring'; });
  document.querySelectorAll('.button, .service-card, .support-signals article').forEach(el => { el.dataset.motionDetail = 'surface'; });
  const motionDetails = [...document.querySelectorAll('[data-motion-detail]')];

  // Give each text line its own shape without splitting accessible text into letters.
  document.querySelectorAll('.service-icon svg path').forEach(path => path.setAttribute('pathLength', '1'));

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const copyButtons = [...document.querySelectorAll('[data-copy-phone]')];
  const toast = document.querySelector('.copy-toast');
  let toastTimer;
  function legacyCopyPhone() {
    // Fallback for local HTTP previews where the async Clipboard API is unavailable.
    const field = document.createElement('textarea');
    field.value = '+1 (440) 808-6300';
    field.readOnly = true;
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.append(field);
    field.select();
    field.setSelectionRange(0, field.value.length);
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Clipboard unavailable');
  }
  copyButtons.forEach(button => button.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) {
        try { await navigator.clipboard.writeText('+1 (440) 808-6300'); }
        catch { legacyCopyPhone(); }
      } else legacyCopyPhone();
      toast.textContent = 'Phone number copied';
      copyButtons.forEach(item => { item.querySelector('[data-copy-label]').textContent = 'Number copied'; });
    } catch {
      toast.textContent = 'Copy manually: +1 (440) 808-6300';
    }
    button.focus({ preventScroll: true });
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      copyButtons.forEach(item => { item.querySelector('[data-copy-label]').textContent = item.classList.contains('phone-channel') ? 'Click to copy the number' : 'Copy number'; });
    }, 2600);
  }));

  // Content is visible by default. Animations only begin as a whole group enters.
  // There is no delayed card sequence, scroll lock, or transformed photo on scroll.
  function enter(el) {
    if (revealed.has(el)) return;
    revealed.add(el);
    el.classList.add('is-entered');
    if (reducedMotion.matches || typeof el.animate !== 'function') return;
    const type = el.dataset.enter;
    // Let text own its movement. Animating a parent too multiplies its opacity
    // and movement, making a smooth word reveal look like a sudden flash.
    if (type === 'headline' || el.matches('[data-motion-detail]') || el.querySelector('[data-motion-detail]')) return;
    playMotion(el, [
      { opacity: .35, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 1050 });
  }

  function animateDetail(el) {
    el.classList.add('is-motion-active');
    if (reducedMotion.matches) return;
    const previousPlay = lastDetailPlay.get(el);
    if (previousPlay !== undefined && performance.now() - previousPlay < 1600) return;
    lastDetailPlay.set(el, performance.now());
    if (el.dataset.motionDetail === 'words') {
      el.querySelectorAll('.motion-word').forEach((word, index) => {
        playMotion(word, [
          { opacity: .2, transform: 'perspective(900px) translateY(18px) rotateX(-14deg)' },
          { opacity: 1, transform: 'none' }
        ], { duration: 1120, delay: Math.min(index * 65, 195) });
      });
    } else if (el.dataset.motionDetail === 'spring') {
      playMotion(el, [
        { opacity: .4, transform: 'translateY(12px) scale(.98)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 1050 });
    } else if (el.dataset.motionDetail === 'label') {
      playMotion(el, [{ opacity: .3, transform: 'translateX(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 850 });
    } else if (el.dataset.motionDetail === 'copy') {
      playMotion(el, [{ opacity: .3, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 950 });
    }
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        enter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    document.documentElement.classList.add('motion-ready');
    elements.forEach(el => observer.observe(el));
    // Rearm only after a complete exit. Tiny scroll reversals never retrigger text.
    const visibleDetails = new WeakSet();
    detailObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !visibleDetails.has(entry.target)) {
          visibleDetails.add(entry.target);
          animateDetail(entry.target);
        } else if (!entry.isIntersecting && visibleDetails.has(entry.target)) {
          visibleDetails.delete(entry.target);
          entry.target.classList.remove('is-motion-active');
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 12px 0px' });
    motionDetails.forEach(el => detailObserver.observe(el));
  } else elements.forEach(enter);

  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) {
      motionDetails.forEach(el => detailObserver?.observe(el));
      return;
    }
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
    observer?.disconnect();
    detailObserver?.disconnect();
    elements.forEach(el => { revealed.add(el); el.classList.add('is-entered'); });
    motionDetails.forEach(el => el.classList.add('is-motion-active'));
  });

  const progress = document.querySelector('.reading-progress');
  const dock = document.querySelector('.mobile-dock');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('#contact');
  const navLinks = [...document.querySelectorAll('.navigation a')];
  const sections = navLinks.map(link => document.querySelector(link.hash));
  const inkTitles = [...document.querySelectorAll('h2 em')];
  const ticket = document.querySelector('.price-ticket');
  const pricePanel = document.querySelector('.trial-panel');
  const photoCaption = document.querySelector('.photo-caption');
  const heroPhoto = document.querySelector('.hero-photo');
  const clamp = value => Math.max(0, Math.min(1, value));
  let scheduled = false;
  function updateScroll() {
    scheduled = false;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.max(0, Math.min(1, window.scrollY / height)) : 0})`;
    const pastHero = hero.getBoundingClientRect().bottom < 100;
    const atContact = contact.getBoundingClientRect().top < window.innerHeight;
    dock.classList.toggle('is-visible', pastHero && !atContact);
    let current = -1;
    sections.forEach((section, index) => { if (section.getBoundingClientRect().top < 180) current = index; });
    if (contact.getBoundingClientRect().top < 180) current = -1;
    navLinks.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    // Scroll changes foreground accents only: the photograph remains completely stable.
    inkTitles.forEach(title => {
      const position = title.getBoundingClientRect().top / window.innerHeight;
      title.style.setProperty('--ink', `${reducedMotion.matches ? 100 : clamp((.95 - position) / .55) * 100}%`);
    });
    const offerProgress = clamp((window.innerHeight - pricePanel.getBoundingClientRect().top) / window.innerHeight);
    ticket.style.setProperty('--ticket-angle', reducedMotion.matches ? '0deg' : `${-5 + offerProgress * 8}deg`);
    const photoProgress = clamp(-heroPhoto.getBoundingClientRect().top / heroPhoto.offsetHeight);
    photoCaption.style.setProperty('--caption-y', reducedMotion.matches ? '0px' : `${photoProgress * -16}px`);
  }
  function scheduleScroll() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  window.addEventListener('load', scheduleScroll, { once: true });
  reducedMotion.addEventListener('change', scheduleScroll);

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.service-card').forEach(card => {
    let pointerFrame = 0;
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reducedMotion.matches) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width);
        const y = clamp((event.clientY - rect.top) / rect.height);
        card.style.setProperty('--pointer-x', `${x * 100}%`);
        card.style.setProperty('--pointer-y', `${y * 100}%`);
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame);
    });
  });
  updateScroll();
})();
