/* =============================================
   РОЗОВЫЙ САД — Логика приложения
   ============================================= */

'use strict';

/* === ДАННЫЕ О ТОВАРАХ === */
const PRODUCTS = [
  {
    id: 1,
    name: 'Queen Elizabeth',
    category: 'hybrid-tea',
    categoryLabel: 'Чайно-гибридная',
    emoji: '🌹',
    color: 'pink',
    colorHex: '#E8739A',
    height: 'tall',
    heightLabel: '120–140 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 890,
    oldPrice: 1200,
    badge: 'Хит продаж',
    badgeClass: '',
    stock: 4,
    desc: 'Классика английской селекции. Крупные, пышные цветы насыщенно-розового цвета с нежным ароматом. Исключительно устойчива к болезням и морозам.',
    bestseller: true,
  },
  {
    id: 2,
    name: 'Graham Thomas',
    category: 'english',
    categoryLabel: 'Английская роза',
    emoji: '🌼',
    color: 'yellow',
    colorHex: '#F1C40F',
    height: 'tall',
    heightLabel: '130–150 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 1150,
    oldPrice: null,
    badge: 'David Austin',
    badgeClass: 'product-card__badge--green',
    stock: 8,
    desc: 'Роза Дэвида Остина. Насыщенно-золотисто-жёлтые чашевидные цветы с сильным ароматом чайной розы. Одна из самых популярных английских роз в мире.',
    bestseller: true,
  },
  {
    id: 3,
    name: 'New Dawn',
    category: 'climbing',
    categoryLabel: 'Плетистая',
    emoji: '🌸',
    color: 'pink',
    colorHex: '#E8A0B4',
    height: 'tall',
    heightLabel: '300–500 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 980,
    oldPrice: 1300,
    badge: 'Осталось 3 шт',
    badgeClass: 'product-card__badge--orange',
    stock: 3,
    desc: 'Легендарная плетистая роза, способная покрыть стену, забор или перголу за один сезон. Нежно-розовые цветы со свежим яблочным ароматом.',
    bestseller: true,
  },
  {
    id: 4,
    name: 'Iceberg',
    category: 'floribunda',
    categoryLabel: 'Флорибунда',
    emoji: '🤍',
    color: 'white',
    colorHex: '#F5F0EB',
    height: 'medium',
    heightLabel: '80–100 см',
    flowering: 'continuous',
    floweringLabel: 'Непрерывное',
    price: 750,
    oldPrice: null,
    badge: 'Классика',
    badgeClass: 'product-card__badge--green',
    stock: 15,
    desc: 'Одна из самых популярных роз в мире. Чисто-белые цветы в крупных гроздьях с июня по октябрь. Отличная устойчивость к болезням.',
    bestseller: true,
  },
  {
    id: 5,
    name: 'Mr. Lincoln',
    category: 'hybrid-tea',
    categoryLabel: 'Чайно-гибридная',
    emoji: '🌹',
    color: 'red',
    colorHex: '#C0392B',
    height: 'tall',
    heightLabel: '120–130 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 920,
    oldPrice: 1100,
    badge: 'Хит продаж',
    badgeClass: '',
    stock: 6,
    desc: 'Глубокие, бархатисто-малиновые цветы с насыщенным классическим розовым ароматом. Незаменимая красная роза для срезки.',
    bestseller: true,
  },
  {
    id: 6,
    name: 'Ebb Tide',
    category: 'floribunda',
    categoryLabel: 'Флорибунда',
    emoji: '💜',
    color: 'purple',
    colorHex: '#9B59B6',
    height: 'medium',
    heightLabel: '90–110 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 1050,
    oldPrice: null,
    badge: 'Редкий сорт',
    badgeClass: 'product-card__badge--green',
    stock: 5,
    desc: 'Таинственные тёмно-сливово-фиолетовые цветы с пряным гвоздичным ароматом. Драматичный акцент в любом саду.',
    bestseller: true,
  },
  {
    id: 7,
    name: 'Constance Spry',
    category: 'english',
    categoryLabel: 'Английская роза',
    emoji: '🌸',
    color: 'pink',
    colorHex: '#E8739A',
    height: 'tall',
    heightLabel: '150–200 см',
    flowering: 'once',
    floweringLabel: 'Однократное',
    price: 1280,
    oldPrice: 1600,
    badge: 'David Austin',
    badgeClass: 'product-card__badge--green',
    stock: 7,
    desc: 'Первая роза Дэвида Остина, выведенная в 1961 году. Огромные чашевидные цветы тёплого розового с миррным ароматом. Впечатляющее зрелище в период цветения.',
    bestseller: false,
  },
  {
    id: 8,
    name: 'Falstaff',
    category: 'english',
    categoryLabel: 'Английская роза',
    emoji: '🍷',
    color: 'red',
    colorHex: '#8B1A4A',
    height: 'medium',
    heightLabel: '100–120 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 1100,
    oldPrice: null,
    badge: 'David Austin',
    badgeClass: 'product-card__badge--green',
    stock: 9,
    desc: 'Насыщенно-малиновые цветы, которые по мере старения приобретают красивый пурпурный оттенок. Плотные розеткообразные цветки с сильным старинным ароматом.',
    bestseller: false,
  },
  {
    id: 9,
    name: 'Handel',
    category: 'climbing',
    categoryLabel: 'Плетистая',
    emoji: '🌺',
    color: 'pink',
    colorHex: '#E8739A',
    height: 'tall',
    heightLabel: '300–400 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 890,
    oldPrice: 1050,
    badge: null,
    badgeClass: '',
    stock: 11,
    desc: 'Изящные кремовые цветы с характерной розовой каймой. Очень мощный клаймбер с отличной устойчивостью к болезням. Идеальна для арок и колонн.',
    bestseller: false,
  },
  {
    id: 10,
    name: 'Sunsprite',
    category: 'floribunda',
    categoryLabel: 'Флорибунда',
    emoji: '🌻',
    color: 'yellow',
    colorHex: '#F1C40F',
    height: 'medium',
    heightLabel: '70–90 см',
    flowering: 'continuous',
    floweringLabel: 'Непрерывное',
    price: 720,
    oldPrice: null,
    badge: null,
    badgeClass: '',
    stock: 20,
    desc: 'Ярко-золотисто-жёлтые цветы с сильным сладким ароматом. Одна из лучших жёлтых роз по стабильности цветения и устойчивости к болезням.',
    bestseller: false,
  },
  {
    id: 11,
    name: 'Julia Child',
    category: 'floribunda',
    categoryLabel: 'Флорибунда',
    emoji: '🌼',
    color: 'yellow',
    colorHex: '#F1C40F',
    height: 'medium',
    heightLabel: '80–100 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 840,
    oldPrice: 1000,
    badge: null,
    badgeClass: '',
    stock: 13,
    desc: 'Тёплые золотисто-жёлтые округлые цветы с ароматом аниса. Роза тёплая и жизнерадостная — под стать своей знаменитой тёзке.',
    bestseller: false,
  },
  {
    id: 12,
    name: 'Gloire de Dijon',
    category: 'climbing',
    categoryLabel: 'Плетистая',
    emoji: '🧡',
    color: 'orange',
    colorHex: '#E67E22',
    height: 'tall',
    heightLabel: '400–600 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 950,
    oldPrice: 1200,
    badge: 'Старинный сорт',
    badgeClass: 'product-card__badge--green',
    stock: 4,
    desc: 'Старинная плетистая роза 1853 года с абрикосово-кремовыми цветами исключительной красоты. Одна из самых морозостойких плетисток.',
    bestseller: false,
  },
  {
    id: 13,
    name: 'Blue Moon',
    category: 'hybrid-tea',
    categoryLabel: 'Чайно-гибридная',
    emoji: '💜',
    color: 'purple',
    colorHex: '#9B59B6',
    height: 'tall',
    heightLabel: '100–120 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 1020,
    oldPrice: null,
    badge: 'Редкий сорт',
    badgeClass: 'product-card__badge--green',
    stock: 6,
    desc: 'Крупные серебристо-сиреневые цветы с выдающимся лимонно-розовым ароматом. Отмеченный наградами сорт, любимый за необычный цвет.',
    bestseller: false,
  },
  {
    id: 14,
    name: 'Knock Out',
    category: 'floribunda',
    categoryLabel: 'Флорибунда',
    emoji: '🌹',
    color: 'red',
    colorHex: '#C0392B',
    height: 'medium',
    heightLabel: '90–120 см',
    flowering: 'continuous',
    floweringLabel: 'Непрерывное',
    price: 680,
    oldPrice: null,
    badge: null,
    badgeClass: '',
    stock: 25,
    desc: 'Самая устойчивая к болезням роза из когда-либо выведенных. Вишнёво-красные цветы непрерывно с весны до заморозков. Идеальна для сада без лишних забот.',
    bestseller: false,
  },
  {
    id: 15,
    name: 'Sally Holmes',
    category: 'climbing',
    categoryLabel: 'Плетистая',
    emoji: '🤍',
    color: 'white',
    colorHex: '#F5F0EB',
    height: 'tall',
    heightLabel: '250–300 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 860,
    oldPrice: 1000,
    badge: null,
    badgeClass: '',
    stock: 8,
    desc: 'Кремово-белые простые цветы в огромных гроздьях. Эффектная декоративная роза, которая озаряет любую стену или забор светящимся сиянием.',
    bestseller: false,
  },
  {
    id: 16,
    name: 'Lady of Shallot',
    category: 'english',
    categoryLabel: 'Английская роза',
    emoji: '🌺',
    color: 'orange',
    colorHex: '#E67E22',
    height: 'medium',
    heightLabel: '100–130 см',
    flowering: 'repeat',
    floweringLabel: 'Повторное',
    price: 1200,
    oldPrice: 1450,
    badge: 'David Austin',
    badgeClass: 'product-card__badge--green',
    stock: 5,
    desc: 'Чашевидные лососево-оранжевые цветы с тёплым ароматом чайной розы и пряностей. Исключительно здоровый и очень обильно цветущий сорт.',
    bestseller: false,
  },
];

/* === ЗАГРУЗКА ТОВАРОВ ИЗ АДМИНКИ (если есть) === */
(function() {
  const saved = localStorage.getItem('rg_products');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        PRODUCTS.length = 0;
        parsed.forEach(p => PRODUCTS.push(p));
      }
    } catch(e) {}
  }
})();

/* === СОСТОЯНИЕ === */
const state = {
  cart: [],
  filters: { cat: 'all', color: 'all', height: 'all', flowering: 'all' },
  visibleCount: 8,
};

/* === УТИЛИТЫ === */
const $ = (id) => document.getElementById(id);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function formatPrice(p) {
  return p.toLocaleString('ru-RU') + ' ₽';
}

/* === РЕНДЕР КАРТОЧКИ ТОВАРА === */
function renderCard(product, ctx = 'catalog') {
  const inCart = state.cart.find(i => i.id === product.id);
  const lowStock = product.stock <= 5;

  return `
    <div class="product-card reveal" data-id="${product.id}">
      <div class="product-card__img">
        <div class="product-card__placeholder">${product.emoji}</div>
        ${product.badge ? `<span class="product-card__badge ${product.badgeClass}">${product.badge}</span>` : ''}
        <button class="product-card__wishlist" data-wishlist="${product.id}" aria-label="В избранное">♡</button>
        <button class="product-card__quick-view" data-quickview="${product.id}">Быстрый просмотр</button>
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${product.categoryLabel}</div>
        <div class="product-card__name">${product.name}</div>
        <div class="product-card__meta">
          <div class="product-card__color-dot" style="background:${product.colorHex}"></div>
          <span class="product-card__detail">${product.heightLabel}</span>
          <span class="product-card__detail">${product.floweringLabel}</span>
        </div>
        ${lowStock ? `<div class="product-card__stock">⚡ Осталось ${product.stock} шт.</div>` : ''}
        <div class="product-card__footer">
          <div class="product-card__price">
            <span class="product-card__price-current">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="product-card__price-old">${formatPrice(product.oldPrice)}</span>` : ''}
          </div>
          <button class="product-card__add ${inCart ? 'added' : ''}" data-add="${product.id}">
            ${inCart ? '✓ Добавлено' : 'Купить'}
          </button>
        </div>
      </div>
    </div>
  `;
}

/* === РЕНДЕР ХИТОВ ПРОДАЖ === */
function renderBestsellers() {
  const grid = $('bestsellers-grid');
  if (!grid) return;
  const best = PRODUCTS.filter(p => p.bestseller);
  grid.innerHTML = best.map(p => renderCard(p, 'best')).join('');
  observeReveal();
}

/* === РЕНДЕР КАТАЛОГА === */
function getFilteredProducts() {
  const { cat, color, height, flowering } = state.filters;
  return PRODUCTS.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (color !== 'all' && p.color !== color) return false;
    if (height !== 'all' && p.height !== height) return false;
    if (flowering !== 'all' && p.flowering !== flowering) return false;
    return true;
  });
}

function renderCatalog() {
  const grid = $('catalog-grid');
  const countEl = $('catalog-count');
  const loadBtn = $('load-more');
  if (!grid) return;

  const filtered = getFilteredProducts();
  const visible = filtered.slice(0, state.visibleCount);

  grid.innerHTML = visible.map(p => renderCard(p, 'catalog')).join('');

  if (countEl) {
    countEl.textContent = `Показано ${visible.length} из ${filtered.length} сортов`;
  }
  if (loadBtn) {
    loadBtn.style.display = state.visibleCount >= filtered.length ? 'none' : '';
  }

  observeReveal();
}

/* === КОРЗИНА === */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`🌹 ${product.name} добавлена в корзину!`);

  // Обновляем все кнопки для этого товара
  $$(`[data-add="${id}"]`).forEach(btn => {
    btn.classList.add('added');
    btn.textContent = '✓ Добавлено';
  });
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  updateCartUI();
  renderCartDrawer();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCartUI();
  renderCartDrawer();
}

function updateCartUI() {
  const total = state.cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Значок плавающей корзины
  const countEl = $('float-cart-count');
  if (countEl) {
    countEl.textContent = total;
    countEl.classList.toggle('visible', total > 0);
  }

  // Значок корзины в шапке
  const headerCount = $('header-cart-count');
  if (headerCount) {
    headerCount.textContent = total;
    headerCount.classList.toggle('visible', total > 0);
  }

  // Шапка дравера
  const drawerCount = $('cart-count-drawer');
  if (drawerCount) drawerCount.textContent = total;

  const totalEl = $('cart-total');
  if (totalEl) totalEl.textContent = formatPrice(totalPrice);

  renderCartDrawer();
}

function renderCartDrawer() {
  const itemsEl = $('cart-items');
  const footerEl = $('cart-footer');
  const emptyEl = $('cart-empty');
  if (!itemsEl) return;

  const isEmpty = state.cart.length === 0;
  itemsEl.style.display = isEmpty ? 'none' : '';
  if (footerEl) footerEl.style.display = isEmpty ? 'none' : '';
  if (emptyEl) {
    emptyEl.classList.toggle('visible', isEmpty);
  }

  itemsEl.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__emoji">${item.emoji}</div>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">${formatPrice(item.price * item.qty)}</div>
      </div>
      <div class="cart-item__qty">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, +1)">+</button>
      </div>
    </div>
  `).join('');
}

function openCart() {
  $('cart-drawer')?.classList.add('open');
  $('cart-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('cart-drawer')?.classList.remove('open');
  $('cart-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* === БЫСТРЫЙ ПРОСМОТР === */
function openQuickView(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const modal = $('quick-modal');
  const overlay = $('modal-overlay');
  const content = $('modal-content');

  const colorNames = {
    red: 'Красный', pink: 'Розовый', white: 'Белый',
    yellow: 'Жёлтый', purple: 'Фиолетовый', orange: 'Оранжевый'
  };

  content.innerHTML = `
    <div class="modal-product">
      <div class="modal-product__placeholder">${product.emoji}</div>
      <div class="modal-product__info">
        <div class="modal-product__category">${product.categoryLabel}</div>
        <div class="modal-product__name">${product.name}</div>
        <p class="modal-product__desc">${product.desc}</p>
        <div class="modal-product__details">
          <div class="modal-product__detail-row">
            <span>Цвет</span><span>${colorNames[product.color] || product.color}</span>
          </div>
          <div class="modal-product__detail-row">
            <span>Высота</span><span>${product.heightLabel}</span>
          </div>
          <div class="modal-product__detail-row">
            <span>Цветение</span><span>${product.floweringLabel}</span>
          </div>
          <div class="modal-product__detail-row">
            <span>Наличие</span><span>${product.stock <= 5 ? '⚡ Осталось ' + product.stock + ' шт.' : 'В наличии'}</span>
          </div>
        </div>
        <div class="modal-product__price">${formatPrice(product.price)}</div>
        <div class="modal-product__actions">
          <button class="btn btn--primary btn--lg" onclick="addToCart(${product.id}); closeModal()">
            В корзину
          </button>
          <button class="btn btn--ghost btn--lg" onclick="closeModal()">Закрыть</button>
        </div>
      </div>
    </div>
  `;

  modal?.classList.add('open');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('quick-modal')?.classList.remove('open');
  $('modal-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* === FAQ АККОРДЕОН === */
function initFAQ() {
  $$('.faq__item').forEach(item => {
    const btn = item.querySelector('.faq__q');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq__item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* === СКРОЛЛ ХЕДЕРА === */
function initHeader() {
  const header = $('header') || document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* === МОБИЛЬНОЕ МЕНЮ === */
function initMobileMenu() {
  const burger = $('burger');
  const nav = $('nav') || document.querySelector('.nav');

  burger?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      burger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* === АНИМАЦИЯ ПОЯВЛЕНИЯ === */
let revealObserver;

function observeReveal() {
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.reveal');
        if (children.length) {
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 80);
          });
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach(el => revealObserver.observe(el));
}

/* === ФИЛЬТРЫ И ВКЛАДКИ === */
function initFilters() {
  // Вкладки категорий
  $$('.catalog__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.catalog__tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.filters.cat = tab.dataset.cat;
      state.visibleCount = 8;
      renderCatalog();
    });
  });

  // Кнопки цвета
  $$('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.color = btn.dataset.color;
      state.visibleCount = 8;
      renderCatalog();
    });
  });

  // Выпадающие фильтры
  $('filter-height')?.addEventListener('change', (e) => {
    state.filters.height = e.target.value;
    state.visibleCount = 8;
    renderCatalog();
  });

  $('filter-flowering')?.addEventListener('change', (e) => {
    state.filters.flowering = e.target.value;
    state.visibleCount = 8;
    renderCatalog();
  });

  // Сброс
  $('reset-filters')?.addEventListener('click', () => {
    state.filters = { cat: 'all', color: 'all', height: 'all', flowering: 'all' };
    $$('.catalog__tab').forEach(t => t.classList.toggle('active', t.dataset.cat === 'all'));
    $$('.color-btn').forEach(b => b.classList.toggle('active', b.dataset.color === 'all'));
    if ($('filter-height')) $('filter-height').value = 'all';
    if ($('filter-flowering')) $('filter-flowering').value = 'all';
    state.visibleCount = 8;
    renderCatalog();
  });

  // Загрузить ещё
  $('load-more')?.addEventListener('click', () => {
    state.visibleCount += 8;
    renderCatalog();
    observeReveal();
  });
}

/* === СОБЫТИЯ КАРТОЧЕК === */
function initCardEvents() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      addToCart(Number(addBtn.dataset.add));
      return;
    }

    const quickBtn = e.target.closest('[data-quickview]');
    if (quickBtn) {
      openQuickView(Number(quickBtn.dataset.quickview));
      return;
    }

    const wishBtn = e.target.closest('[data-wishlist]');
    if (wishBtn) {
      wishBtn.textContent = wishBtn.textContent === '♡' ? '♥' : '♡';
      showToast('Добавлено в избранное ♥');
      return;
    }
  });
}

/* === ОФОРМЛЕНИЕ ЗАКАЗА === */
function openCheckout() {
  if (state.cart.length === 0) {
    showToast('Корзина пуста — добавьте розы!');
    return;
  }

  // Заполняем список товаров
  const itemsList = $('checkout-items-list');
  const totalDisplay = $('checkout-total-display');
  if (itemsList) {
    itemsList.innerHTML = state.cart.map(item => `
      <div class="checkout-item">
        <span class="checkout-item__name">${item.emoji} ${item.name} × ${item.qty}</span>
        <span class="checkout-item__price">${formatPrice(item.price * item.qty)}</span>
      </div>
    `).join('');
  }
  const totalPrice = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (totalDisplay) totalDisplay.textContent = formatPrice(totalPrice);

  closeCart();
  $('checkout-modal')?.classList.add('open');
  $('checkout-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  $('checkout-modal')?.classList.remove('open');
  $('checkout-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

function buildOrderMessage() {
  const name = $('checkout-name')?.value.trim();
  const phone = $('checkout-phone')?.value.trim();
  const city = $('checkout-city')?.value.trim();
  const comment = $('checkout-comment')?.value.trim();
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = `🌹 *Новый заказ — Розовый Сад*\n\n`;
  msg += `👤 Имя: ${name}\n`;
  msg += `📞 Телефон: ${phone}\n`;
  if (city) msg += `📍 Город: ${city}\n`;
  msg += `\n*Состав заказа:*\n`;
  state.cart.forEach(item => {
    msg += `• ${item.name} × ${item.qty} = ${formatPrice(item.price * item.qty)}\n`;
  });
  msg += `\n💰 *Итого: ${formatPrice(total)}*`;
  if (comment) msg += `\n\n💬 Комментарий: ${comment}`;

  return msg;
}

function validateCheckoutForm() {
  let valid = true;
  const name = $('checkout-name');
  const phone = $('checkout-phone');

  [name, phone].forEach(el => el?.classList.remove('error'));

  if (!name?.value.trim()) {
    name?.classList.add('error');
    valid = false;
  }
  if (!phone?.value.trim() || phone.value.trim().length < 7) {
    phone?.classList.add('error');
    valid = false;
  }
  if (!valid) showToast('Заполните имя и телефон');
  return valid;
}

function initCheckout() {
  // Кнопка "Оформить заказ" в корзине (делегирование — кнопка рендерится динамически)
  document.addEventListener('click', (e) => {
    if (e.target.closest('#cart-footer .btn--primary')) {
      openCheckout();
    }
  });

  $('checkout-close')?.addEventListener('click', closeCheckout);
  $('checkout-overlay')?.addEventListener('click', closeCheckout);

  // WhatsApp
  $('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateCheckoutForm()) return;
    const msg = buildOrderMessage();
    const url = `https://wa.me/79001234567?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    closeCheckout();
    state.cart = [];
    updateCartUI();
    showToast('🌹 Заказ отправлен! Ждите звонка.');
  });

  // Telegram
  $('checkout-tg')?.addEventListener('click', () => {
    if (!validateCheckoutForm()) return;
    const msg = buildOrderMessage();
    const url = `https://t.me/rosegarden?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    closeCheckout();
    state.cart = [];
    updateCartUI();
    showToast('🌹 Заказ отправлен в Telegram!');
  });
}

/* === СОБЫТИЯ КОРЗИНЫ === */
function initCartEvents() {
  $('float-cart')?.addEventListener('click', openCart);
  $('header-cart')?.addEventListener('click', openCart);
  $('cart-close')?.addEventListener('click', closeCart);
  $('cart-overlay')?.addEventListener('click', closeCart);
  $('modal-overlay')?.addEventListener('click', closeModal);
  $('modal-close')?.addEventListener('click', closeModal);
}

/* === СЧЁТЧИК СРОЧНОСТИ === */
function initUrgency() {
  const el = $('urgency-text');
  if (!el) return;

  const messages = [
    '🌸 Осталось только <strong>7 заказов</strong> по текущим ценам. Весенний запас разбирают быстро!',
    '🔥 <strong>12 человек</strong> прямо сейчас смотрят каталог',
    '📦 <strong>Марина из Москвы</strong> только что заказала Queen Elizabeth',
    '⚡ <strong>Ограниченный запас</strong> — цены могут вырасти после этой недели',
    '🌹 <strong>Елена из Петербурга</strong> только что заказала Graham Thomas',
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % messages.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.innerHTML = messages[idx];
      el.style.opacity = '1';
    }, 400);
  }, 5000);

  el.style.transition = 'opacity 0.4s ease';
}

/* === ПЛАВНАЯ ПРОКРУТКА === */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* === ПАРАЛЛАКС ГЕРОЯ === */
function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) return;
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
}

/* === ИНИЦИАЛИЗАЦИЯ === */
document.addEventListener('DOMContentLoaded', () => {
  renderBestsellers();
  renderCatalog();
  initFAQ();
  initHeader();
  initMobileMenu();
  initFilters();
  initCardEvents();
  initCartEvents();
  initCheckout();
  initUrgency();
  initSmoothScroll();
  initParallax();

  setTimeout(observeReveal, 100);

  updateCartUI();
  renderCartDrawer();
});

// Глобальные функции для inline-обработчиков
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.closeModal = closeModal;
window.openQuickView = openQuickView;
