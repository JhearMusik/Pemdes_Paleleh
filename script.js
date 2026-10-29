function showPage(pageId) {
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => {
    v.style.display = 'none';
    v.classList.remove('active-view');
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const defaultNavStructure = [
  { nama: 'Beranda', tipe: 'single', target: 'view-beranda', icon: 'fas fa-home' },
  { 
    nama: 'Profil Desa', tipe: 'dropdown', icon: 'fas fa-info-circle',
    submenu: [
      { nama: 'Sejarah Desa', target: 'view-sejarah' },
      { nama: 'Visi & Misi', target: 'view-visimisi' },
      { nama: 'Tupoksi Pemerintah', target: 'view-tupoksi' },
      { nama: 'Struktur Organisasi', target: 'view-struktur' }
    ]
  },
  { 
    nama: 'Pemerintahan', tipe: 'dropdown', icon: 'fas fa-users',
    submenu: [
      { nama: 'Perangkat Desa', target: 'view-guru' },
      { nama: 'BPD & LPM', target: 'view-pramuka' },
      { nama: 'Karang Taruna & PKK', target: 'view-pencaksilat' }
    ]
  },
  { 
    nama: 'Layanan Desa', tipe: 'dropdown', icon: 'fas fa-concierge-bell',
    submenu: [
      { nama: 'Data Kependudukan', target: 'view-siswa' },
      { nama: 'Permohonan Surat', target: 'view-permohonan-surat' },
      { nama: 'Pengaduan Masyarakat', target: 'view-pengaduan' },
      { nama: 'Transparansi Anggaran', target: 'view-anggaran' }
    ]
  },
  { 
    nama: 'Informasi', tipe: 'dropdown', icon: 'fas fa-folder-open',
    submenu: [
      { nama: 'Sarana & Prasarana', target: 'view-sarana' },
      { nama: 'Galeri & Video', target: 'view-video' }
    ]
  },
  { nama: 'Kontak', tipe: 'single', target: 'view-kontak', icon: 'fas fa-address-book' }
];

function getNavStructure() {
  const data = localStorage.getItem('desapaleleh_nav_structure');
  return data ? JSON.parse(data) : defaultNavStructure;
}

function renderNavbar() {
  const navList = getNavStructure();
  const navbarEl = document.getElementById('dynamic-navbar-menu');
  if (!navbarEl) return;

  navbarEl.innerHTML = navList.map((item) => {
    if (item.tipe === 'single') {
      return `<li><a class="nav-link" onclick="showPage('${item.target}')"><i class="${item.icon || 'fas fa-link'}"></i> ${item.nama}</a></li>`;
    } else {
      const subHtml = (item.submenu || []).map(sub => `<li><a onclick="showPage('${sub.target}')">${sub.nama}</a></li>`).join('');
      return `
        <li class="dropdown">
            <a class="nav-link"><i class="${item.icon || 'fas fa-folder'}"></i> ${item.nama} <i class="fas fa-chevron-down" style="font-size:0.7rem;"></i></a>
            <ul class="dropdown-menu">${subHtml}</ul>
        </li>
      `;
    }
  }).join('') + `<li><a class="nav-link" onclick="checkLoginAndOpenMenu()" style="background: var(--primary-color); color: white;"><i class="fas fa-lock"></i> Admin</a></li>`;

  renderAdminMenuList();
}

function toggleSubMenuInput(val) {
  const parentWrapper = document.getElementById('wrapper-parent-menu');
  if (val === 'submenu') {
    parentWrapper.style.display = 'block';
    populateParentDropdown();
  } else {
    parentWrapper.style.display = 'none';
  }
}

function populateParentDropdown() {
  const selectEl = document.getElementById('input-menu-parent');
  const list = getNavStructure().filter(i => i.tipe === 'dropdown');
  selectEl.innerHTML = list.map((item, idx) => `<option value="${idx}">${item.nama}</option>`).join('');
}

function tambahMenuItem() {
  const nama = document.getElementById('input-menu-nama').value.trim();
  const tipe = document.getElementById('input-menu-tipe').value;
  const target = document.getElementById('input-menu-target').value.trim();

  if (!nama) return alert('Nama Menu wajib diisi!');
  let list = getNavStructure();

  if (tipe === 'single') {
    if (!target) return alert('Target Halaman wajib diisi!');
    list.push({ nama, tipe: 'single', target, icon: 'fas fa-link' });
  } else if (tipe === 'dropdown') {
    list.push({ nama, tipe: 'dropdown', icon: 'fas fa-folder', submenu: [] });
  } else if (tipe === 'submenu') {
    const parentIdx = document.getElementById('input-menu-parent').value;
    if (!target) return alert('Target Halaman wajib diisi!');
    if (list[parentIdx]) {
      if (!list[parentIdx].submenu) list[parentIdx].submenu = [];
      list[parentIdx].submenu.push({ nama, target });
    }
  }

  localStorage.setItem('desapaleleh_nav_structure', JSON.stringify(list));
  document.getElementById('input-menu-nama').value = '';
  document.getElementById('input-menu-target').value = '';
  renderNavbar();
  alert('Menu berhasil ditambahkan!');
}

function hapusMenuUtama(index) {
  if (!confirm('Hapus menu ini beserta sub-menu di dalamnya?')) return;
  let list = getNavStructure();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_nav_structure', JSON.stringify(list));
  renderNavbar();
}

function hapusSubMenu(parentIdx, subIdx) {
  if (!confirm('Hapus sub-menu ini?')) return;
  let list = getNavStructure();
  if (list[parentIdx] && list[parentIdx].submenu) {
    list[parentIdx].submenu.splice(subIdx, 1);
    localStorage.setItem('desapaleleh_nav_structure', JSON.stringify(list));
    renderNavbar();
  }
}

function resetDefaultMenu() {
  if (!confirm('Reset menu ke default?')) return;
  localStorage.removeItem('desapaleleh_nav_structure');
  renderNavbar();
  alert('Menu berhasil direset!');
}

function renderAdminMenuList() {
  const list = getNavStructure();
  const adminEl = document.getElementById('admin-menu-list');
  if (!adminEl) return;

  adminEl.innerHTML = list.map((item, pIdx) => {
    let subListHtml = '';
    if (item.tipe === 'dropdown' && item.submenu) {
      subListHtml = item.submenu.map((sub, sIdx) => `
        <div style="background: #ffffff; padding: 8px 12px; margin-top: 6px; border-radius: 6px; border: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center; margin-left: 20px;">
          <small>↳ <strong>${sub.nama}</strong> (Target: <code>${sub.target}</code>)</small>
          <button type="button" onclick="hapusSubMenu(${pIdx}, ${sIdx})" style="background: #dc2626; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;"><i class="fas fa-trash-alt"></i> Hapus</button>
        </div>
      `).join('');
    }

    return `
      <div style="background: #f8fafc; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div><strong>${item.nama}</strong> <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${item.tipe.toUpperCase()}</span></div>
          <button type="button" onclick="hapusMenuUtama(${pIdx})" style="background: #dc2626; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-trash-alt"></i> Hapus Menu</button>
        </div>
        ${subListHtml}
      </div>
    `;
  }).join('');
}

function toggleAccessibilityModal() {
  const modal = document.getElementById('accessibilityModal');
  if (modal) modal.classList.toggle('active');
}

let currentFontScale = 1;
function changeFontSize(amount) {
  currentFontScale += amount / 100;
  if (currentFontScale < 0.8) currentFontScale = 0.8;
  if (currentFontScale > 1.6) currentFontScale = 1.6;
  document.documentElement.style.setProperty('--font-scale', currentFontScale);
  const display = document.getElementById('fontSizeDisplay');
  if (display) display.innerText = Math.round(currentFontScale * 100) + '%';
}

function toggleBodyClass(className, enable) {
  if (enable) document.body.classList.add(className);
  else document.body.classList.remove(className);
}

function checkLoginAndOpenMenu() {
  const isAuth = localStorage.getItem('desapaleleh_admin_logged_in');
  if (isAuth === 'true') showPage('view-panel-petugas');
  else showPage('view-login-petugas');
}

function handleLogin(event) {
  event.preventDefault();
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  if (user === 'admin' && pass === 'paleleh2026') {
    localStorage.setItem('desapaleleh_admin_logged_in', 'true');
    alert('Login Berhasil!');
    showPage('view-panel-petugas');
  } else {
    alert('Username atau Password salah!');
  }
}

function handleLogout() {
  localStorage.removeItem('desapaleleh_admin_logged_in');
  alert('Anda telah keluar.');
  showPage('view-beranda');
}

function switchTab(tabId) {
  const tabs = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';

  const buttons = document.querySelectorAll('[id^="btn-tab-"]');
  buttons.forEach(btn => {
    btn.style.background = '#cbd5e1';
    btn.style.color = 'var(--text-dark)';
  });
  const activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) {
    activeBtn.style.background = 'var(--primary-color)';
    activeBtn.style.color = 'white';
  }
}

const defaultBerandaData = {
  sambutan: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Puji dan syukur kita panjatkan ke hadirat Allah SWT...",
  logo: "https://i.postimg.cc/PJyqnvJX/Gemini-Generated-Image-tqris4tqris4tqri.jpg"
};

function saveBerandaData(event) {
  event.preventDefault();
  const berandaData = {
    sambutan: document.getElementById('input-beranda-sambutan').value,
    logo: document.getElementById('input-desa-logo').value.trim()
  };
  localStorage.setItem('desapaleleh_content_beranda', JSON.stringify(berandaData));
  renderBerandaData();
  alert('Beranda & Logo berhasil diperbarui!');
}

function renderBerandaData() {
  const localData = localStorage.getItem('desapaleleh_content_beranda');
  const data = localData ? JSON.parse(localData) : defaultBerandaData;

  if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = data.sambutan;
  if (document.getElementById('display-desa-logo')) document.getElementById('display-desa-logo').src = data.logo || defaultBerandaData.logo;
  if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = data.sambutan;
  if (document.getElementById('input-desa-logo')) document.getElementById('input-desa-logo').value = data.logo || defaultBerandaData.logo;
}

window.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderBerandaData();
});
