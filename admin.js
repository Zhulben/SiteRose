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
const HEIGHT_LABELS = {
  low:    'до 60 см',
  medium: '60–120 см',
  tall:   'от 120 см'
};
const FLOWER_LABELS = {
  once:       'Однократное',
  repeat:     'Повторное',
  continuous: 'Непрерывное'
};

/* === УТИЛИТЫ === */
const $  = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

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
  // Берём из app.js (PRODUCTS глобальная переменная)
  return typeof PRODUCTS !== 'undefined' ? JSON.parse(JSON.stringify(PRODUCTS)) : [];
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
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
    heroSub: '200+ премиум сортов · Быстрая доставка · Гарантия живого растения · Поддержка после покупки',
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
let currentPhoto = null; // base64

/* === ВХОД === */
$('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const pw = $('login-password').value;
  if (pw === getPassword()) {
    $('login-screen').style.display = 'none';
    $('admin-app').style.display = 'grid';
    initApp();
  } else {
    $('login-error').classList.add('visible');
    $('login-password').value = '';
  }
});

$('logout-btn').addEventListener('click', () => {
  $('admin-app').style.display = 'none';
  $('login-screen').style.display = 'flex';
  $('login-password').value = '';
});

/* === ТАБЫ === */
$$('.sidebar__item').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.sidebar__item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $(`tab-${tab}`).classList.add('active');
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
  const search = $('search-input')?.value.toLowerCase() || '';
  const cat    = $('filter-cat')?.value || 'all';
  const stock  = $('filter-stock')?.value || 'all';

  let filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search)) return false;
    if (cat !== 'all' && p.category !== cat) return false;
    if (stock === 'low' && p.stock > 5) return false;
    if (stock === 'out' && p.stock > 0) return false;
    return true;
  });

  $('products-count').textContent = `${filtered.length} из ${products.length} товаров`;

  const tbody = $('products-tbody');

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
    const stockBadge = p.stock === 0
      ? `<span class="badge badge-red">Нет</span>`
      : p.stock <= 5
        ? `<span class="badge badge-orange">${p.stock} шт</span>`
        : `<span class="badge badge-green">${p.stock} шт</span>`;

    const thumb = p.photo
      ? `<div class="product-thumb"><img src="${p.photo}" alt="${p.name}" /></div>`
      : `<div class="product-thumb">${p.emoji || '🌹'}</div>`;

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
            data-stock-id="${p.id}" onchange="updateStock(${p.id}, this.value)" />
        </td>
        <td>
          <button class="toggle ${p.bestseller ? 'on' : ''}" data-toggle="${p.id}"
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
  $('search-input')?.addEventListener('input', renderTable);
  $('filter-cat')?.addEventListener('change', renderTable);
  $('filter-stock')?.addEventListener('change', renderTable);
}

/* === ОБНОВИТЬ ОСТАТОК БЫСТРО === */
window.updateStock = function(id, val) {
  const p = products.find(p => p.id === id);
  if (p) {
    p.stock = Math.max(0, parseInt(val) || 0);
    saveProducts(products);
    toast('✅ Остаток обновлён');
    renderTable();
  }
};

/* === ПЕРЕКЛЮЧИТЬ ХИТ === */
window.toggleBestseller = function(id, btn) {
  const p = products.find(p => p.id === id);
  if (p) {
    p.bestseller = !p.bestseller;
    btn.classList.toggle('on', p.bestseller);
    saveProducts(products);
    toast(p.bestseller ? '⭐ Добавлено в хиты' : 'Убрано из хитов');
  }
};

/* === МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ === */
function initModal() {
  $('add-product-btn').addEventListener('click', () => openEdit(null));
  $('modal-close').addEventListener('click', closeModal);
  $('cancel-btn').addEventListener('click', closeModal);
  $('modal-overlay').addEventListener('click', closeModal);
  $('save-product-btn').addEventListener('click', saveProduct);

  // Загрузка фото
  $('upload-photo-btn').addEventListener('click', () => $('photo-input').click());
  $('photo-preview').addEventListener('click', () => $('photo-input').click());
  $('photo-input').addEventListener('change', handlePhotoUpload);
  $('remove-photo-btn').addEventListener('click', removePhoto);
}

function openEdit(id) {
  editingId = id;
  currentPhoto = null;
  $('modal-title').textContent = id ? 'Редактировать розу' : 'Добавить розу';

  if (id) {
    const p = products.find(p => p.id === id);
    if (!p) return;

    $('field-name').value        = p.name || '';
    $('field-category').value    = p.category || 'hybrid-tea';
    $('field-color').value       = p.color || 'pink';
    $('field-height').value      = p.height || 'medium';
    $('field-flowering').value   = p.flowering || 'repeat';
    $('field-stock').value       = p.stock ?? 10;
    $('field-price').value       = p.price || '';
    $('field-old-price').value   = p.oldPrice || '';
    $('field-badge').value       = p.badge || '';
    $('field-desc').value        = p.desc || '';
    $('field-emoji').value       = p.emoji || '🌹';
    $('field-bestseller').checked = !!p.bestseller;

    // Фото
    if (p.photo) {
      setPhoto(p.photo);
      currentPhoto = p.photo;
    } else {
      removePhoto();
      $('emoji-preview').textContent = p.emoji || '🌹';
    }
  } else {
    // Новый товар — очищаем
    ['field-name','field-badge','field-desc','field-old-price'].forEach(id => $(id).value = '');
    $('field-category').value   = 'hybrid-tea';
    $('field-color').value      = 'pink';
    $('field-height').value     = 'medium';
    $('field-flowering').value  = 'repeat';
    $('field-stock').value      = 10;
    $('field-price').value      = '';
    $('field-emoji').value      = '🌹';
    $('field-bestseller').checked = false;
    removePhoto();
  }

  $('modal-overlay').classList.add('active');
  $('edit-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('modal-overlay').classList.remove('active');
  $('edit-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) {
    toast('⚠️ Файл слишком большой. Максимум 3 МБ');
    return;
  }
  const reader = new FileReader();
  reader.onload = ev => {
    currentPhoto = ev.target.result;
    setPhoto(currentPhoto);
  };
  reader.readAsDataURL(file);
}

function setPhoto(src) {
  $('photo-placeholder').style.display = 'none';
  $('photo-img').src = src;
  $('photo-img').style.display = 'block';
  $('remove-photo-btn').style.display = '';
}

function removePhoto() {
  currentPhoto = null;
  $('photo-placeholder').style.display = '';
  $('photo-img').style.display = 'none';
  $('photo-img').src = '';
  $('remove-photo-btn').style.display = 'none';
  $('photo-input').value = '';
}

function saveProduct() {
  const name  = $('field-name').value.trim();
  const price = parseFloat($('field-price').value);

  // Валидация
  $('field-name').classList.toggle('error', !name);
  $('field-price').classList.toggle('error', !price);
  if (!name || !price) { toast('⚠️ Заполните название и цену'); return; }

  const cat = $('field-category').value;
  const color = $('field-color').value;
  const height = $('field-height').value;
  const flowering = $('field-flowering').value;

  const heightLabel = { low:'до 60 см', medium:'60–120 см', tall:'от 120 см' }[height];
  const flowerLabel = { once:'Однократное', repeat:'Повторное', continuous:'Непрерывное' }[flowering];

  const data = {
    name,
    category:       cat,
    categoryLabel:  CAT_LABELS[cat],
    emoji:          $('field-emoji').value || '🌹',
    photo:          currentPhoto || null,
    color,
    colorHex:       COLOR_HEX[color] || '#E8739A',
    height,
    heightLabel,
    flowering,
    floweringLabel: flowerLabel,
    price,
    oldPrice:       parseFloat($('field-old-price').value) || null,
    badge:          $('field-badge').value.trim() || null,
    badgeClass:     '',
    stock:          parseInt($('field-stock').value) || 0,
    desc:           $('field-desc').value.trim(),
    bestseller:     $('field-bestseller').checked,
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
  $('confirm-cancel').addEventListener('click', closeConfirm);
  $('confirm-overlay').addEventListener('click', closeConfirm);
  $('confirm-ok').addEventListener('click', () => {
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
  $('confirm-text').textContent = `Удалить «${p?.name || 'этот товар'}»? Это действие нельзя отменить.`;
  $('confirm-overlay').classList.add('active');
  $('confirm-box').classList.add('open');
};

function closeConfirm() {
  deleteId = null;
  $('confirm-overlay').classList.remove('active');
  $('confirm-box').classList.remove('open');
}

/* === НАСТРОЙКИ === */
function loadSettingsForm() {
  const s = getSettings();
  $('s-phone').value        = s.phone || '';
  $('s-email').value        = s.email || '';
  $('s-whatsapp').value     = s.whatsapp || '';
  $('s-telegram').value     = s.telegram || '';
  $('s-hero-title').value   = s.heroTitle || '';
  $('s-hero-sub').value     = s.heroSub || '';
  $('s-free-delivery').value = s.freeDelivery || 3000;
}

function initSettings() {
  $('save-settings-btn').addEventListener('click', () => {
    const s = {
      phone:        $('s-phone').value.trim(),
      email:        $('s-email').value.trim(),
      whatsapp:     $('s-whatsapp').value.trim(),
      telegram:     $('s-telegram').value.trim(),
      heroTitle:    $('s-hero-title').value.trim(),
      heroSub:      $('s-hero-sub').value.trim(),
      freeDelivery: parseInt($('s-free-delivery').value) || 3000,
    };
    saveSettings(s);
    toast('✅ Настройки сохранены');
  });

  $('change-password-btn').addEventListener('click', () => {
    const np = $('s-new-password').value;
    const cp = $('s-confirm-password').value;
    if (!np) { toast('⚠️ Введите новый пароль'); return; }
    if (np !== cp) { toast('⚠️ Пароли не совпадают'); return; }
    if (np.length < 4) { toast('⚠️ Пароль слишком короткий'); return; }
    localStorage.setItem(ADMIN_PASSWORD_KEY, np);
    $('s-new-password').value = '';
    $('s-confirm-password').value = '';
    toast('✅ Пароль изменён');
  });
}

/* === ЭКСПОРТ === */
function initExport() {
  $('download-appjs').addEventListener('click', downloadAppJs);
  $('reset-data-btn').addEventListener('click', () => {
    if (confirm('Сбросить все изменения товаров? Это нельзя отменить.')) {
      localStorage.removeItem(PRODUCTS_KEY);
      products = getProducts();
      renderTable();
      toast('🔄 Данные сброшены');
    }
  });
}

function downloadAppJs() {
  // Читаем оригинальный app.js и заменяем массив PRODUCTS
  const prods = products.map(p => {
    // Убираем base64 фото из экспорта (слишком большие)
    const { photo, ...rest } = p;
    return rest;
  });

  const prodStr = JSON.stringify(prods, null, 2)
    .replace(/"([^"]+)":/g, '$1:');

  fetch('app.js')
    .then(r => r.text())
    .then(src => {
      // Заменяем массив PRODUCTS в исходном файле
      const updated = src.replace(
        /const PRODUCTS = \[[\s\S]*?\];/,
        `const PRODUCTS = ${prodStr};`
      );
      const blob = new Blob([updated], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'app.js';
      a.click();
      URL.revokeObjectURL(url);
      toast('📥 app.js скачан — загрузите его на GitHub');
    })
    .catch(() => toast('⚠️ Не удалось скачать файл'));
}

/* === ЭМОДЗИ ПРЕВЬЮ === */
document.addEventListener('input', e => {
  if (e.target.id === 'field-emoji') {
    $('emoji-preview').textContent = e.target.value || '🌹';
  }
});

/* === ЭКСПОЗИЦИЯ ГЛОБАЛЬНЫХ ФУНКЦИЙ === */
window.openEdit   = openEdit;
window.openDelete = openDelete;
