(() => {
  if (window.lucide) window.lucide.createIcons();
  const $ = selector => document.querySelector(selector);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = $('[data-menu]');
  const nav = $('.site-header nav');
  nav.id = 'site-nav';
  menu.setAttribute('aria-controls', nav.id);
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
    // The nav precedes the button in the DOM, so move focus into the opened menu.
    if (open) nav.querySelector('a').focus();
  }
  menu.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => {
    // composedPath() is fixed at dispatch, so it still includes the button after its icon is re-rendered.
    const path = event.composedPath();
    if (nav.classList.contains('is-open') && !path.includes(nav) && !path.includes(menu)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (nav.classList.contains('is-open')) { setMenu(false); menu.focus(); }
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
  const firstSection = sectionTargets[0]?.target;
  const updateTop = () => {
    topButton?.toggleAttribute('hidden', window.scrollY < 420);
    // Above the first section nothing should stay highlighted.
    if (firstSection && firstSection.getBoundingClientRect().top > window.innerHeight * .4) setActiveSection(null);
  };
  window.addEventListener('scroll', updateTop, { passive: true });
  updateTop();
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const slides = [...document.querySelectorAll('[data-feature-slide]')];
  if (slides.length > 1) {
    let active = 0;
    const status = $('[data-feature-status]');
    function showSlide(delta) {
      active = (active + delta + slides.length) % slides.length;
      slides.forEach((slide, index) => { slide.hidden = index !== active; });
      const title = document.createElement('span');
      title.className = 'sr-only';
      title.textContent = ` ${slides[active].querySelector('figcaption a').textContent}`;
      status.replaceChildren(`${active + 1} / ${slides.length}`, title);
    }
    $('[data-feature-prev]').addEventListener('click', () => showSlide(-1));
    $('[data-feature-next]').addEventListener('click', () => showSlide(1));
  }
  const dialog = $('#visual-dialog');
  const visualContent = $('#visual-content');
  const zoomButton = $('[data-zoom]');
  let activeExpand;
  function setZoom(zoomed) {
    visualContent.classList.toggle('is-zoomed', zoomed);
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    const label = zoomed ? '全体を表示' : '原寸で表示';
    zoomButton.setAttribute('aria-label', label);
    zoomButton.title = label;
    zoomButton.innerHTML = `<i data-lucide="${zoomed ? 'zoom-out' : 'zoom-in'}" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
    visualContent.scrollTop = 0;
    visualContent.scrollLeft = 0;
  }
  document.querySelectorAll('[data-expand]').forEach(expand => expand.addEventListener('click', () => {
    const showcase = expand.closest('.project-showcase');
    activeExpand = expand;
    visualContent.replaceChildren(showcase.querySelector('.screenshot-frame').cloneNode(true));
    $('#visual-title').textContent = $('h1').textContent;
    $('#visual-caption').textContent = showcase.querySelector('figcaption').textContent;
    setZoom(false);
    dialog.showModal();
  }));
  // The screenshot itself is also a target for opening the larger view.
  document.querySelectorAll('.project-showcase .screenshot-frame').forEach(frame => frame.addEventListener('click', () => frame.closest('.project-showcase').querySelector('[data-expand]').click()));
  zoomButton.addEventListener('click', () => setZoom(zoomButton.getAttribute('aria-pressed') !== 'true'));
  $('[data-close]').addEventListener('click', () => dialog.close());
  // Only a click on the backdrop closes; clicks in the dialog's own padding also target the dialog.
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => activeExpand?.focus());
})();
