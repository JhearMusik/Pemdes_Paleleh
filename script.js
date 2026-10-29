// --- Inisialisasi Supabase Client ---
const SUPABASE_URL = 'https://haocjvzfurqpnrvatmro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhb2NqdnpmdXJxcG5ydmF0bXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMjUwNzEsImV4cCI6MjEwODgwMTA3MX0.hwKpscT3XHjmflFVSQJPK82gWpqBv5awZImVj3STx9c';
const supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// --- 1. NAVIGASI HALAMAN (SHOW PAGE) ---
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

// --- FUNGSI AKSESIBILITAS SIDEBAR & UKURAN FONT ---
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

// --- 2. KELOLA DINAMIS MENU & DROPDOWN NAVIGASI ---
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
    if (!target) return alert('Target Halaman wajib diisi untuk menu tunggal!');
    list.push({ nama, tipe: 'single', target, icon: 'fas fa-link' });
  } else if (tipe === 'dropdown') {
    list.push({ nama, tipe: 'dropdown', icon: 'fas fa-folder', submenu: [] });
  } else if (tipe === 'submenu') {
    const parentIdx = document.getElementById('input-menu-parent').value;
    if (!target) return alert('Target Halaman wajib diisi untuk sub-menu!');
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
  if (!confirm('Apakah Anda yakin ingin menghapus menu ini beserta sub-menu di dalamnya?')) return;
  let list = getNavStructure();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_nav_structure', JSON.stringify(list));
  renderNavbar();
}

function hapusSubMenu(parentIdx, subIdx) {
  if (!confirm('Apakah Anda yakin ingin menghapus sub-menu ini?')) return;
  let list = getNavStructure();
  if (list[parentIdx] && list[parentIdx].submenu) {
    list[parentIdx].submenu.splice(subIdx, 1);
    localStorage.setItem('desapaleleh_nav_structure', JSON.stringify(list));
    renderNavbar();
  }
}

function resetDefaultMenu() {
  if (!confirm('Kembalikan susunan menu ke pengaturan default?')) return;
  localStorage.removeItem('desapaleleh_nav_structure');
  renderNavbar();
  alert('Menu berhasil direset ke default!');
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

// --- 3. LOGIN & KONTROL ADMIN ---
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
    alert('Login Berhasil! Selamat datang di Panel Admin Desa Paleleh.');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    showPage('view-panel-petugas');
  } else {
    alert('Username atau Password salah!');
  }
}

function handleLogout() {
  localStorage.removeItem('desapaleleh_admin_logged_in');
  alert('Anda telah keluar dari sistem admin.');
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

// --- 4. DATA KEPENDUDUKAN ---
const defaultStudentData = {
  '7a': { l: 210, p: 195, wali: 'Kepala Dusun I', foto: 'https://via.placeholder.com/150' },
  '7b': { l: 185, p: 190, wali: 'Kepala Dusun II', foto: 'https://via.placeholder.com/150' }
};

function getStudentData() {
  const data = localStorage.getItem('desapaleleh_data_penduduk');
  return data ? JSON.parse(data) : defaultStudentData;
}

function renderStudentData() {
  const data = getStudentData();
  const classes = ['7a', '7b'];

  classes.forEach(cls => {
    const clsduta = data[cls] || { l: 0, p: 0, wali: '-', foto: '' };
    const elL = document.getElementById(`display-${cls}-l`);
    const elP = document.getElementById(`display-${cls}-p`);
    const elTot = document.getElementById(`display-${cls}-total`);
    const elWali = document.getElementById(`display-${cls}-wali`);
    const elFoto = document.getElementById(`display-${cls}-foto`);

    if (elL) elL.innerText = clsduta.l;
    if (elP) elP.innerText = clsduta.p;
    if (elTot) elTot.innerText = Number(clsduta.l) + Number(clsduta.p);
    if (elWali) elWali.innerText = clsduta.wali;
    if (elFoto) elFoto.src = clsduta.foto || 'https://via.placeholder.com/150';

    const inputL = document.getElementById(`input-${cls}-l`);
    const inputP = document.getElementById(`input-${cls}-p`);
    const inputWali = document.getElementById(`input-${cls}-wali`);
    const inputFoto = document.getElementById(`input-${cls}-foto`);

    if (inputL) inputL.value = clsduta.l;
    if (inputP) inputP.value = clsduta.p;
    if (inputWali) inputWali.value = clsduta.wali;
    if (inputFoto) inputFoto.value = clsduta.foto;
  });
}

function saveStudentData(event) {
  event.preventDefault();
  const classes = ['7a', '7b'];
  let newdata = {};

  classes.forEach(cls => {
    newdata[cls] = {
      l: document.getElementById(`input-${cls}-l`).value,
      p: document.getElementById(`input-${cls}-p`).value,
      wali: document.getElementById(`input-${cls}-wali`).value,
      foto: document.getElementById(`input-${cls}-foto`).value
    };
  });

  localStorage.setItem('desapaleleh_data_penduduk', JSON.stringify(newdata));
  renderStudentData();
  alert('Data kependudukan berhasil diperbarui!');
}

function resetStudentData() {
  if (!confirm('Apakah Anda yakin ingin mengosongkan/menghapus seluruh data kependudukan?')) return;
  const classes = ['7a', '7b'];
  let clearedData = {};
  classes.forEach(cls => { clearedData[cls] = { l: 0, p: 0, wali: '-', foto: '' }; });
  localStorage.setItem('desapaleleh_data_penduduk', JSON.stringify(clearedData));
  renderStudentData();
  alert('Data kependudukan berhasil dikosongkan!');
}

// --- 5. PERMOHONAN SURAT & PENGADUAN ---
function ajukanPermohonanSurat(event) {
  event.preventDefault();
  const nama = document.getElementById('surat-nama').value.trim();
  const nik = document.getElementById('surat-nik').value.trim();
  const kontak = document.getElementById('surat-kontak').value.trim();
  const jenis = document.getElementById('surat-jenis').value;
  const keperluan = document.getElementById('surat-keperluan').value.trim();

  alert(`Terima kasih ${nama}. Permohonan (${jenis}) Anda telah terkirim dan sedang diproses oleh Kantor Desa Paleleh.`);
  document.getElementById('surat-nama').value = '';
  document.getElementById('surat-nik').value = '';
  document.getElementById('surat-kontak').value = '';
  document.getElementById('surat-keperluan').value = '';
}

function getPengaduanList() {
  const data = localStorage.getItem('desapaleleh_pengaduan_list');
  return data ? JSON.parse(data) : [];
}

function kirimPengaduan(event) {
  event.preventDefault();
  const nama = document.getElementById('pengadu-nama').value.trim();
  const kontak = document.getElementById('pengadu-kontak').value.trim();
  const subjek = document.getElementById('pengadu-subjek').value.trim();
  const pesan = document.getElementById('pengadu-pesan').value.trim();

  let list = getPengaduanList();
  list.unshift({ nama, kontak, subjek, pesan, tanggal: new Date().toLocaleDateString('id-ID') });
  localStorage.setItem('desapaleleh_pengaduan_list', JSON.stringify(list));

  alert('Pengaduan/Aspirasi Anda berhasil terkirim!');
  document.getElementById('pengadu-nama').value = '';
  document.getElementById('pengadu-kontak').value = '';
  document.getElementById('pengadu-subjek').value = '';
  document.getElementById('pengadu-pesan').value = '';
  renderPengaduanAdmin();
}

function renderPengaduanAdmin() {
  const list = getPengaduanList();
  const adminEl = document.getElementById('admin-pengaduan-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada pengaduan dari warga.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">${item.tanggal}</span>
            <h4 style="color: var(--primary-color); margin-top: 4px;">${item.subjek}</h4>
          </div>
          <button type="button" onclick="hapusPengaduanItem(${idx})" style="background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-trash-alt"></i> Hapus</button>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 8px;">${item.pesan}</p>
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          <strong>Pengirim:</strong> ${item.nama} | <strong>Kontak:</strong> ${item.kontak}
        </div>
      </div>
    `).join('');
  }
}

function hapusPengaduanItem(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus laporan pengaduan ini?')) return;
  let list = getPengaduanList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_pengaduan_list', JSON.stringify(list));
  renderPengaduanAdmin();
}

function hapusSemuaPengaduan() {
  if (!confirm('Apakah Anda yakin ingin membersihkan SELURUH daftar pengaduan?')) return;
  localStorage.removeItem('desapaleleh_pengaduan_list');
  renderPengaduanAdmin();
}

// --- INITIAL LOAD ---
window.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderStudentData();
  renderPengaduanAdmin();
});
