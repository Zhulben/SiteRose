/* =============================================
   РОЗОВЫЙ САД — Логика админ-панели
   ============================================= */

'use strict';

/* === КОНФИГ === */
const ADMIN_PASSWORD_KEY = 'rg_admin_password';
const PRODUCTS_KEY       = 'rg_products';
const SETTINGS_KEY       = 'rg_settings';
const DEFAULT_PASSWORD   = 'admin123';

const COLOR_HEX = {
  red: '#C0392B', pink: '#E8739A', white: '#F5F0EB',
  yellow: '#F1C40F', purple: '#9B59B6', orange: '#E67E22'
};
const CAT_LABELS = {
  'hybrid-tea': 'Чайно-гибридная',
  floribunda:   'Флорибунда',
  climbing:     'Плетистая',
  english:      'Английская роза'
};

/* === УТИЛИТЫ (не конфликтуют с app.js) === */
function gel(id)  { return document.getElementById(id); }
function gels(sel){ return document.querySelectorAll(sel); }

function toast(msg) {
  let el = document.querySelector('.a-toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'a-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2800);
}

function fmtPrice(p) { return p ? Number(p).toLocaleString('ru-RU') + ' ₽' : '—'; }

/* === ПАРОЛЬ === */
function getPassword() {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
}

/* === ДАННЫЕ === */
function getProducts() {
  const saved = localStorage.getItem(PRODUCTS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return typeof PRODUCTS !== 'undefined' ? JSON.parse(JSON.stringify(PRODUCTS)) : [];
}

function saveProducts(prods) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
}

function getSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) { try { return JSON.parse(saved); } catch(e) {} }
  return {
    phone: '+7 (900) 123-45-67',
    email: 'hello@rosegarden.ru',
    whatsapp: '79001234567',
    telegram: 'rosegarden',
    heroTitle: 'Розы, которые превратят ваш сад в сказку',
    heroSub: '200+ премиум сортов · Быстрая доставка · Гарантия живого растения',
    freeDelivery: 3000,
  };
}

function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

/* === STATE === */
let products = [];
let editingId = null;
let deleteId = null;
let currentPhoto = null;

/* === ВХОД === */
gel('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const pw = gel('login-password').value;
  if (pw === getPassword()) {
    gel('login-screen').style.display = 'none';
    gel('admin-app').style.display = 'grid';
    initApp();
  } else {
    gel('login-error').classList.add('visible');
    gel('login-password').value = '';
  }
});

gel('logout-btn').addEventListener('click', () => {
  gel('admin-app').style.display = 'none';
  gel('login-screen').style.display = 'flex';
  gel('login-password').value = '';
});

/* === ТАБЫ === */
gels('.sidebar__item').forEach(btn => {
  btn.addEventListener('click', () => {
    gels('.sidebar__item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    gels('.tab-content').forEach(t => t.classList.remove('active'));
    gel(`tab-${tab}`).classList.add('active');
    if (tab === 'settings') loadSettingsForm();
  });
});

/* === ИНИЦИАЛИЗАЦИЯ === */
function initApp() {
  products = getProducts();
  renderTable();
  initFilters();
  initModal();
  initConfirm();
  initExport();
  initSettings();
}

/* === ТАБЛИЦА === */
function renderTable() {
  const search = gel('search-input')?.value.toLowerCase() || '';
  const cat    = gel('filter-cat')?.value || 'all';
  const stock  = gel('filter-stock')?.value || 'all';

  let filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search)) return false;
    if (cat !== 'all' && p.category !== cat) return false;
    if (stock === 'low' && p.stock > 5) return false;
    if (stock === 'out' && p.stock > 0) return false;
    return true;
  });

  gel('products-count').textContent = `${filtered.length} из ${products.length} товаров`;

  const tbody = gel('products-tbody');

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="8">
        <div class="empty-state">
          <div class="empty-state__icon">🌹</div>
          <p>Товары не найдены. Попробуйте изменить фильтры.</p>
        </div>
      </td></tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const thumb = p.photo
      ? `<div class="product-thumb"><img src="${p.photo}" alt="${p.name}" /></div>`
      : `<div class="product-thumb">${p.emoji || '🌹'}</div>`;

    const stockBadge = p.stock === 0
      ? `<span class="badge badge-red">Нет</span>`
      : p.stock <= 5
        ? `<span class="badge badge-orange">${p.stock} шт</span>`
        : `<span class="badge badge-green">${p.stock} шт</span>`;

    return `
      <tr>
        <td>${thumb}</td>
        <td>
          <div class="product-name">${p.name}</div>
          <div class="product-cat">${CAT_LABELS[p.category] || p.category}</div>
        </td>
        <td>${CAT_LABELS[p.category] || '—'}</td>
        <td><strong>${fmtPrice(p.price)}</strong></td>
        <td style="color:#AAA">${p.oldPrice ? fmtPrice(p.oldPrice) : '—'}</td>
        <td>
          <input class="stock-input" type="number" min="0" value="${p.stock}"
            onchange="updateStock(${p.id}, this.value)" />
        </td>
        <td>
          <button class="toggle ${p.bestseller ? 'on' : ''}"
            onclick="toggleBestseller(${p.id}, this)"></button>
        </td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick="openEdit(${p.id})" title="Редактировать">✏️</button>
            <button class="btn-icon danger" onclick="openDelete(${p.id})" title="Удалить">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function initFilters() {
  gel('search-input')?.addEventListener('input', renderTable);
  gel('filter-cat')?.addEventListener('change', renderTable);
  gel('filter-stock')?.addEventListener('change', renderTable);
}

/* === ОСТАТОК === */
window.updateStock = function(id, val) {
  const p = products.find(p => p.id === id);
  if (p) {
    p.stock = Math.max(0, parseInt(val) || 0);
    saveProducts(products);
    toast('✅ Остаток обновлён');
  }
};

/* === ХИТ ПРОДАЖ === */
window.toggleBestseller = function(id, btn) {
  const p = products.find(p => p.id === id);
  if (p) {
    p.bestseller = !p.bestseller;
    btn.classList.toggle('on', p.bestseller);
    saveProducts(products);
    toast(p.bestseller ? '⭐ Добавлено в хиты' : 'Убрано из хитов');
  }
};

/* === МОДАЛЬНОЕ ОКНО === */
function initModal() {
  gel('add-product-btn').addEventListener('click', () => openEdit(null));
  gel('modal-close').addEventListener('click', closeModal);
  gel('cancel-btn').addEventListener('click', closeModal);
  gel('modal-overlay').addEventListener('click', closeModal);
  gel('save-product-btn').addEventListener('click', saveProduct);

  gel('upload-photo-btn').addEventListener('click', () => gel('photo-input').click());
  gel('photo-preview').addEventListener('click', () => gel('photo-input').click());
  gel('photo-input').addEventListener('change', handlePhotoUpload);
  gel('remove-photo-btn').addEventListener('click', removePhoto);
}

window.openEdit = function(id) {
  editingId = id;
  currentPhoto = null;
  gel('modal-title').textContent = id ? 'Редактировать розу' : 'Добавить розу';

  if (id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    gel('field-name').value           = p.name || '';
    gel('field-category').value       = p.category || 'hybrid-tea';
    gel('field-color').value          = p.color || 'pink';
    gel('field-height').value         = p.height || 'medium';
    gel('field-flowering').value      = p.flowering || 'repeat';
    gel('field-stock').value          = p.stock ?? 10;
    gel('field-price').value          = p.price || '';
    gel('field-old-price').value      = p.oldPrice || '';
    gel('field-badge').value          = p.badge || '';
    gel('field-desc').value           = p.desc || '';
    gel('field-emoji').value          = p.emoji || '🌹';
    gel('field-bestseller').checked   = !!p.bestseller;
    gel('emoji-preview').textContent  = p.emoji || '🌹';

    if (p.photo) { setPhoto(p.photo); currentPhoto = p.photo; }
    else removePhoto();
  } else {
    ['field-name','field-badge','field-desc','field-old-price'].forEach(i => gel(i).value = '');
    gel('field-category').value   = 'hybrid-tea';
    gel('field-color').value      = 'pink';
    gel('field-height').value     = 'medium';
    gel('field-flowering').value  = 'repeat';
    gel('field-stock').value      = 10;
    gel('field-price').value      = '';
    gel('field-emoji').value      = '🌹';
    gel('emoji-preview').textContent = '🌹';
    gel('field-bestseller').checked = false;
    removePhoto();
  }

  gel('modal-overlay').classList.add('active');
  gel('edit-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function closeModal() {
  gel('modal-overlay').classList.remove('active');
  gel('edit-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) { toast('⚠️ Максимум 3 МБ'); return; }
  const reader = new FileReader();
  reader.onload = ev => { currentPhoto = ev.target.result; setPhoto(currentPhoto); };
  reader.readAsDataURL(file);
}

function setPhoto(src) {
  gel('photo-placeholder').style.display = 'none';
  gel('photo-img').src = src;
  gel('photo-img').style.display = 'block';
  gel('remove-photo-btn').style.display = '';
}

function removePhoto() {
  currentPhoto = null;
  gel('photo-placeholder').style.display = '';
  gel('photo-img').style.display = 'none';
  gel('photo-img').src = '';
  gel('remove-photo-btn').style.display = 'none';
  gel('photo-input').value = '';
}

function saveProduct() {
  const name  = gel('field-name').value.trim();
  const price = parseFloat(gel('field-price').value);

  gel('field-name').classList.toggle('error', !name);
  gel('field-price').classList.toggle('error', !price);
  if (!name || !price) { toast('⚠️ Заполните название и цену'); return; }

  const cat       = gel('field-category').value;
  const color     = gel('field-color').value;
  const height    = gel('field-height').value;
  const flowering = gel('field-flowering').value;

  const data = {
    name,
    category:       cat,
    categoryLabel:  CAT_LABELS[cat],
    emoji:          gel('field-emoji').value || '🌹',
    photo:          currentPhoto || null,
    color,
    colorHex:       COLOR_HEX[color] || '#E8739A',
    height,
    heightLabel:    { low:'до 60 см', medium:'60–120 см', tall:'от 120 см' }[height],
    flowering,
    floweringLabel: { once:'Однократное', repeat:'Повторное', continuous:'Непрерывное' }[flowering],
    price,
    oldPrice:       parseFloat(gel('field-old-price').value) || null,
    badge:          gel('field-badge').value.trim() || null,
    badgeClass:     '',
    stock:          parseInt(gel('field-stock').value) || 0,
    desc:           gel('field-desc').value.trim(),
    bestseller:     gel('field-bestseller').checked,
  };

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx !== -1) products[idx] = { ...products[idx], ...data };
    toast('✅ Товар обновлён');
  } else {
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, ...data });
    toast('✅ Роза добавлена');
  }

  saveProducts(products);
  renderTable();
  closeModal();
}

/* === УДАЛЕНИЕ === */
function initConfirm() {
  gel('confirm-cancel').addEventListener('click', closeConfirm);
  gel('confirm-overlay').addEventListener('click', closeConfirm);
  gel('confirm-ok').addEventListener('click', () => {
    if (deleteId !== null) {
      products = products.filter(p => p.id !== deleteId);
      saveProducts(products);
      renderTable();
      toast('🗑️ Товар удалён');
    }
    closeConfirm();
  });
}

window.openDelete = function(id) {
  deleteId = id;
  const p = products.find(p => p.id === id);
  gel('confirm-text').textContent = `Удалить «${p?.name || 'этот товар'}»? Это нельзя отменить.`;
  gel('confirm-overlay').classList.add('active');
  gel('confirm-box').classList.add('open');
};

function closeConfirm() {
  deleteId = null;
  gel('confirm-overlay').classList.remove('active');
  gel('confirm-box').classList.remove('open');
}

/* === НАСТРОЙКИ === */
function loadSettingsForm() {
  const s = getSettings();
  gel('s-phone').value         = s.phone || '';
  gel('s-email').value         = s.email || '';
  gel('s-whatsapp').value      = s.whatsapp || '';
  gel('s-telegram').value      = s.telegram || '';
  gel('s-hero-title').value    = s.heroTitle || '';
  gel('s-hero-sub').value      = s.heroSub || '';
  gel('s-free-delivery').value = s.freeDelivery || 3000;
}

function initSettings() {
  gel('save-settings-btn').addEventListener('click', () => {
    saveSettings({
      phone:        gel('s-phone').value.trim(),
      email:        gel('s-email').value.trim(),
      whatsapp:     gel('s-whatsapp').value.trim(),
      telegram:     gel('s-telegram').value.trim(),
      heroTitle:    gel('s-hero-title').value.trim(),
      heroSub:      gel('s-hero-sub').value.trim(),
      freeDelivery: parseInt(gel('s-free-delivery').value) || 3000,
    });
    toast('✅ Настройки сохранены');
  });

  gel('change-password-btn').addEventListener('click', () => {
    const np = gel('s-new-password').value;
    const cp = gel('s-confirm-password').value;
    if (!np) { toast('⚠️ Введите новый пароль'); return; }
    if (np !== cp) { toast('⚠️ Пароли не совпадают'); return; }
    if (np.length < 4) { toast('⚠️ Пароль слишком короткий'); return; }
    localStorage.setItem(ADMIN_PASSWORD_KEY, np);
    gel('s-new-password').value = '';
    gel('s-confirm-password').value = '';
    toast('✅ Пароль изменён');
  });
}

/* === ЭКСПОРТ === */
function initExport() {
  gel('download-appjs').addEventListener('click', downloadAppJs);
  gel('reset-data-btn').addEventListener('click', () => {
    if (confirm('Сбросить все изменения товаров?')) {
      localStorage.removeItem(PRODUCTS_KEY);
      products = getProducts();
      renderTable();
      toast('🔄 Данные сброшены');
    }
  });
}

function downloadAppJs() {
  const prods = products.map(({ photo, ...rest }) => rest);
  const prodStr = JSON.stringify(prods, null, 2).replace(/"([^"]+)":/g, '$1:');

  fetch('app.js')
    .then(r => r.text())
    .then(src => {
      const updated = src.replace(
        /const PRODUCTS = \[[\s\S]*?\];/,
        `const PRODUCTS = ${prodStr};`
      );
      const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(new Blob([updated], { type: 'text/javascript' })),
        download: 'app.js'
      });
      a.click();
      toast('📥 app.js скачан — загрузите на GitHub');
    })
    .catch(() => toast('⚠️ Не удалось скачать файл'));
}

/* === ЭМОДЗИ ПРЕВЬЮ === */
document.addEventListener('input', e => {
  if (e.target.id === 'field-emoji') {
    gel('emoji-preview').textContent = e.target.value || '🌹';
  }
});
