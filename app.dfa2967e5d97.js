(() => {
  if (window.lucide) window.lucide.createIcons();
  const $ = selector => document.querySelector(selector);
  const settings = $('[data-settings]');
  const panel = $('#appearance');
  function closeSettings() { panel.hidden = true; settings.setAttribute('aria-expanded', 'false'); }
  settings.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    settings.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) $('#accent').focus();
  });
  document.addEventListener('click', event => {
    if (!panel.hidden && !panel.contains(event.target) && !settings.contains(event.target)) closeSettings();
  });
  try {
    const accent = localStorage.getItem('pei-accent');
    if (['blue', 'azure'].includes(accent)) { document.body.dataset.accent = accent; $('#accent').value = accent; }
    $('#compact').checked = localStorage.getItem('pei-compact') === 'true';
    document.body.classList.toggle('compact', $('#compact').checked);
  } catch { /* File previews can disallow local storage. */ }
  $('#accent').addEventListener('change', event => {
    document.body.dataset.accent = event.target.value;
    try { localStorage.setItem('pei-accent', event.target.value); } catch {}
  });
  $('#compact').addEventListener('change', event => {
    document.body.classList.toggle('compact', event.target.checked);
    try { localStorage.setItem('pei-compact', String(event.target.checked)); } catch {}
  });
  const menu = $('[data-menu]');
  const nav = $('.site-header nav');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!panel.hidden) { closeSettings(); settings.focus(); }
    if (nav.classList.contains('is-open')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.focus(); }
  });
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
  const toast = $('[data-toast]');
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };
  const share = $('[data-share]');
  share?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('ページのリンクをコピーしました');
    } catch {
      showToast('リンクをコピーできませんでした');
    }
  });
  const quickRail = $('[data-quick-nav]');
  const quickLinks = [...document.querySelectorAll('[data-quick-link]')];
  const sectionTargets = quickLinks.map(link => ({ link, target: document.getElementById(link.dataset.quickLink) })).filter(item => item.target);
  const setActiveSection = id => quickLinks.forEach(link => {
    const active = link.dataset.quickLink === id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (sectionTargets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .2, .6] });
    sectionTargets.forEach(({ target }) => observer.observe(target));
  } else if (sectionTargets.length) setActiveSection(sectionTargets[0].target.id);
  const topButton = $('[data-top]');
  const updateTop = () => topButton?.toggleAttribute('hidden', window.scrollY < 420);
  window.addEventListener('scroll', updateTop, { passive: true });
  updateTop();
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const slides = [...document.querySelectorAll('[data-feature-slide]')];
  if (slides.length > 1) {
    let active = 0;
    const status = $('[data-feature-status]');
    function showSlide(delta) {
      active = (active + delta + slides.length) % slides.length;
      slides.forEach((slide, index) => { slide.hidden = index !== active; });
      status.textContent = `${active + 1} / ${slides.length}`;
      status.setAttribute('aria-label', slides[active].querySelector('figcaption a').textContent);
    }
    $('[data-feature-prev]').addEventListener('click', () => showSlide(-1));
    $('[data-feature-next]').addEventListener('click', () => showSlide(1));
  }
  const dialog = $('#visual-dialog');
  const expand = $('[data-expand]');
  if (expand) expand.addEventListener('click', () => {
    const original = $('.project-showcase .screenshot-frame');
    $('#visual-content').replaceChildren(original.cloneNode(true));
    $('#visual-title').textContent = $('h1').textContent;
    $('#visual-caption').textContent = $('.project-showcase figcaption').textContent;
    dialog.showModal();
  });
  $('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => expand?.focus());
})();
