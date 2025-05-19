/**
 * Hero-slider block — Swiper 11 via CDN, vanilla ES 6
 */

/* helper: load a stylesheet exactly once */
const loadCSS = (href) => new Promise((resolve, reject) => {
  if (document.querySelector(`link[href="${href}"]`)) {
    resolve();
    return;
  }
  const link = Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href,
  });
  link.onload = resolve;
  link.onerror = reject;
  document.head.append(link);
});

export default async function decorate(block) {
  /* 1 : lazy-load Swiper’s CSS + ES-module bundle */
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');

  /* eslint-disable import/no-unresolved, import/extensions */
  const {
    default: Swiper,
    Pagination,
    Autoplay,
    A11y,
  } = await import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs');
  /* eslint-enable import/no-unresolved, import/extensions */

  /* 2 : convert author-table rows → Swiper slides */
  const slides = [...block.children].map((row) => {
    const [img, title, body, cta] = row.children;
    return `
      <div class="swiper-slide hero-slide"
          style="background-image:url('${img.textContent.trim()}')">
        <div class="hero-slide__content" role="presentation">
          <h2>${title.innerHTML}</h2>
          <p>${body.innerHTML}</p>
          <a class="shop-link" href="${cta.innerHTML}">Shop Now</a>
        </div>
      </div>`;
  }).join('');

  /* 3 : inject Swiper skeleton */
  block.innerHTML = `
    <div class="swiper hero-slider">
      <div class="swiper-wrapper">${slides}</div>
      <div class="swiper-pagination"></div>
    </div>`;

  /* 4 : initialise Swiper */
  Swiper.use([Pagination, Autoplay, A11y]);
  // eslint-disable-next-line no-new
  new Swiper(block.querySelector('.swiper'), {
    loop: true,
    autoplay: false,
    pagination: { el: '.swiper-pagination', clickable: true },
    a11y: true,
  });
}
