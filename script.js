// --- Inisialisasi Supabase Client (Opsional jika terhubung Cloud DB) ---
const SUPABASE_URL = '[https://haocjvzfurqpnrvatmro.supabase.co](https://haocjvzfurqpnrvatmro.supabase.co)';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
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

// --- FUNGSI YOUTUBE EMBED ---
function parseYoutubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('[youtube.com/watch](https://youtube.com/watch)')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v');
  } else if (url.includes('[youtube.com/embed/](https://youtube.com/embed/)')) {
    videoId = url.split('[youtube.com/embed/](https://youtube.com/embed/)')[1].split('?')[0];
  }
  return videoId ? `[https://www.youtube.com/embed/$](https://www.youtube.com/embed/$){videoId}` : url;
}

// --- KELOLA MENU TAUTAN EKSTERNAL ---
const defaultTautanList = [
  { nama: 'Portal Kab. Buol', url: '[https://buolkab.go.id](https://buolkab.go.id)' },
  { nama: 'Kementerian Desa PDT', url: '[https://kemendesa.go.id](https://kemendesa.go.id)' },
  { nama: 'KEMENDAGRI', url: '[https://kemendagri.go.id](https://kemendagri.go.id)' },
  { nama: 'Layanan Dukcapil', url: '[https://dukcapil.kemendagri.go.id](https://dukcapil.kemendagri.go.id)' }
];

function getTautanList() {
  const data = localStorage.getItem('desapaleleh_content_tautan_list');
  return data ? JSON.parse(data) : defaultTautanList;
}

function tambahTautanItem() {
  const namaEl = document.getElementById('input-tautan-nama');
  const urlEl = document.getElementById('input-tautan-url');
  if (!namaEl || !urlEl) return;
  const nama = namaEl.value.trim();
  const url = urlEl.value.trim();

  if (!nama || !url) {
    alert('Nama Tautan dan URL wajib diisi!');
    return;
  }

  let list = getTautanList();
  list.push({ nama, url });
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(list));
  namaEl.value = '';
  urlEl.value = '';
  renderTautanList();
  alert('Tautan berhasil ditambahkan!');
}

function hapusTautanItem(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus tautan ini?')) return;
  let list = getTautanList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(list));
  renderTautanList();
}

function renderTautanList() {
  const list = getTautanList();
  const adminEl = document.getElementById('admin-tautan-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada tautan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${idx + 1}. ${item.nama}</strong><br><small style="color: var(--text-muted);">${item.url}</small></div>
        <button type="button" onclick="hapusTautanItem(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }

  const navbarEl = document.getElementById('display-navbar-tautan');
  if (navbarEl) {
    navbarEl.innerHTML = list.map(item => `
      <li><a href="${item.url}" target="_blank"><i class="fas fa-external-link-alt"></i> ${item.nama}</a></li>
    `).join('');
  }
}

// --- 2. DATA PENDUDUK ---
const defaultStudentData = {
  '7a': { l: 210, p: 195, wali: 'Kepala Dusun I', foto: '[https://via.placeholder.com/150](https://via.placeholder.com/150)' },
  '7b': { l: 185, p: 190, wali: 'Kepala Dusun II', foto: '[https://via.placeholder.com/150](https://via.placeholder.com/150)' },
  '8a': { l: 220, p: 215, wali: 'Kepala Dusun III', foto: '[https://via.placeholder.com/150](https://via.placeholder.com/150)' },
  '8b': { l: 175, p: 180, wali: 'Kepala Dusun IV', foto: '[https://via.placeholder.com/150](https://via.placeholder.com/150)' },
  '9a': { l: 160, p: 155, wali: 'Kepala Dusun V', foto: '[https://via.placeholder.com/150](https://via.placeholder.com/150)' },
  '9b': { l: 140, p: 145, wali: 'Kepala Dusun VI', foto: '[https://via.placeholder.com/150](https://via.placeholder.com/150)' }
};

function getStudentData() {
  const data = localStorage.getItem('desapaleleh_data_penduduk');
  return data ? JSON.parse(data) : defaultStudentData;
}

function renderStudentData() {
  const data = getStudentData();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];

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
    if (elFoto) elFoto.src = clsduta.foto || '[https://via.placeholder.com/150](https://via.placeholder.com/150)';

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
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];
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
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];
  let clearedData = {};
  classes.forEach(cls => { clearedData[cls] = { l: 0, p: 0, wali: '-', foto: '' }; });
  localStorage.setItem('desapaleleh_data_penduduk', JSON.stringify(clearedData));
  renderStudentData();
  alert('Data kependudukan berhasil dikosongkan!');
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

// --- 4. VISI & MISI ---
const defaultVisi = "Mewujudkan Desa Paleleh yang Maju, Mandiri, Sejahtera, Berkarakter Budaya, dan Transparan dalam Tata Kelola Pemerintahan";
const defaultMisiList = [
  "Meningkatkan Transparansi dan Akuntabilitas Penyelenggaraan Government Desa Melalui Digitalisasi Layanan Publik",
  "Mengoptimalkan Potensi Ekonomi Sumber Daya Alam dan Pemberdayaan UMKM / BUMDes",
  "Pembangunan Infrastruktur Desa yang Merata, Berkelanjutan, dan Berwawasan Lingkungan",
  "Meningkatkan Kualitas Sumber Daya Manusia Melalui Program Kesehatan, Pendidikan, dan Kesejahteraan Sosial",
  "Memperkuat Nilai-Nilai Keagamaan, Gotong-Royong, dan Pelestarian Adat Istiadat Lokal"
];

function getVisi() { return localStorage.getItem('desapaleleh_content_visi') ?? defaultVisi; }
function getMisiList() {
  const data = localStorage.getItem('desapaleleh_content_misi_list');
  return data ? JSON.parse(data) : defaultMisiList;
}

function saveVisiOnly() {
  const val = document.getElementById('input-content-visi').value.trim();
  localStorage.setItem('desapaleleh_content_visi', val);
  renderVisiMisi();
  alert('Visi berhasil diperbarui!');
}

function hapusVisiOnly() {
  if (!confirm('Apakah Anda yakin ingin menghapus teks visi desa?')) return;
  localStorage.setItem('desapaleleh_content_visi', '');
  renderVisiMisi();
  alert('Teks Visi berhasil dihapus!');
}

function tambahMisiPoin() {
  const inputEl = document.getElementById('input-misi-poin');
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return alert('Poin Misi tidak boleh kosong!');
  let list = getMisiList();
  list.push(text);
  localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(list));
  inputEl.value = '';
  renderVisiMisi();
  alert('Poin Misi berhasil ditambahkan!');
}

function hapusMisiPoin(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus poin misi ini?')) return;
  let list = getMisiList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(list));
  renderVisiMisi();
}

function renderVisiMisi() {
  const visiText = getVisi();
  const misiList = getMisiList();
  const visiEl = document.getElementById('display-visi');
  if (visiEl) visiEl.innerText = visiText || 'Teks visi belum diisi.';
  const inputVisi = document.getElementById('input-content-visi');
  if (inputVisi) inputVisi.value = visiText;

  const adminEl = document.getElementById('admin-misi-list');
  if (adminEl) {
    adminEl.innerHTML = misiList.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada poin misi.</p>' : misiList.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${idx + 1}.</strong> ${item}</div>
        <button type="button" onclick="hapusMisiPoin(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-misi-list');
  if (publicEl) {
    publicEl.innerHTML = misiList.length === 0 ? '<p style="color: var(--text-muted);">Belum ada misi.</p>' : misiList.map((item, idx) => `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="background: var(--primary-color); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 0.95rem;">${idx + 1}</div>
        <div style="color: var(--text-dark); font-weight: 500; font-size: 0.98rem; line-height: 1.5;">${item}</div>
      </div>
    `).join('');
  }
}

// --- 5. TUPOKSI ---
const defaultTupoksiList = [
  { judul: 'Kepala Desa', deskripsi: 'Memimpin penyelenggaraan pemerintahan desa, melaksanakan pembangunan, membina kemasyarakatan, dan memberdayakan masyarakat desa.' },
  { judul: 'Sekretaris Desa', deskripsi: 'Memimpin sekretariat desa dan mengoordinasikan bidang administrasi umum, keuangan, perencanaan, serta pelaporan kinerja desa.' },
  { judul: 'Kaur Keuangan', deskripsi: 'Mengelola urusan penerimaan, penyimpanan, penyetoran, dan pertanggungjawaban penatausahaan APBDesa.' },
  { judul: 'Kasi Pemerintahan', deskripsi: 'Melaksanakan manajemen tata praja pemerintahan, pengelolaan administrasi kependudukan, dan penataan pertanahan.' },
  { judul: 'Kasi Kesejahteraan & Pelayanan', deskripsi: 'Melaksanakan pembangunan sarana prasarana perdesaan, pemberdayaan UMKM, kebudayaan, serta jaminan sosial warga.' }
];

function getTupoksiList() {
  const data = localStorage.getItem('desapaleleh_content_tupoksi_list');
  return data ? JSON.parse(data) : defaultTupoksiList;
}

function tambahTupoksiItem() {
  const judulEl = document.getElementById('input-tupoksi-judul');
  const deskripsiEl = document.getElementById('input-tupoksi-deskripsi');
  if (!judulEl || !deskripsiEl) return;
  const judul = judulEl.value.trim();
  const deskripsi = deskripsiEl.value.trim();
  if (!judul || !deskripsi) return alert('Judul Jabatan dan Rincian Tugas Pokok wajib diisi!');

  let list = getTupoksiList();
  list.push({ judul, deskripsi });
  localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(list));
  judulEl.value = '';
  deskripsiEl.value = '';
  renderTupoksiList();
  alert('Tugas Pokok Perangkat Desa berhasil ditambahkan!');
}

function hapusTupoksiItem(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus data tupoksi ini?')) return;
  let list = getTupoksiList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(list));
  renderTupoksiList();
}

function renderTupoksiList() {
  const list = getTupoksiList();
  const adminEl = document.getElementById('admin-tupoksi-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada tugas pokok.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${idx + 1}. ${item.judul}</strong>: <span style="color: var(--text-muted);">${item.deskripsi}</span></div>
        <button type="button" onclick="hapusTupoksiItem(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-tupoksi-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada informasi tupoksi.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; gap: 15px; align-items: flex-start;">
        <div style="background: var(--primary-color); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">${idx + 1}</div>
        <div>
          <h4 style="color: var(--primary-color); margin-bottom: 6px; font-size: 1.05rem;">${item.judul}</h4>
          <p style="color: var(--text-dark); line-height: 1.6; font-size: 0.95rem;">${item.deskripsi}</p>
        </div>
      </div>
    `).join('');
  }
}

// --- 6. SEJARAH, STRUKTUR, KONTAK ---
function savePageContent(event, pageKey) {
  event.preventDefault();
  let contentdata = {};
  if (pageKey === 'sejarah') contentdata.text = document.getElementById('input-content-sejarah').value;
  localStorage.setItem('desapaleleh_content_' + pageKey, JSON.stringify(contentdata));
  alert(`Data ${pageKey} berhasil diperbarui!`);
  renderPageContent();
}

function hapusPageContent(pageKey) {
  if (!confirm(`Apakah Anda yakin ingin menghapus data ${pageKey}?`)) return;
  localStorage.removeItem('desapaleleh_content_' + pageKey);
  alert(`Data ${pageKey} berhasil dihapus!`);
  renderPageContent();
}

function saveStrukturGambar(event) {
  event.preventDefault();
  const imgUrl = document.getElementById('input-struktur-img').value.trim();
  localStorage.setItem('desapaleleh_content_struktur_img', imgUrl);
  renderPageContent();
  alert('Gambar Struktur Organisasi Desa berhasil diperbarui!');
}

function hapusStrukturGambar() {
  if (!confirm('Apakah Anda yakin ingin menghapus gambar struktur organisasi?')) return;
  localStorage.removeItem('desapaleleh_content_struktur_img');
  renderPageContent();
  alert('Gambar Struktur Organisasi berhasil dihapus!');
}

function saveKontakData(event) {
  event.preventDefault();
  const kontakData = {
    alamat: document.getElementById('input-kontak-alamat').value.trim(),
    telp: document.getElementById('input-kontak-telp').value.trim(),
    email: document.getElementById('input-kontak-email').value.trim(),
    maps: document.getElementById('input-kontak-maps').value.trim()
  };
  localStorage.setItem('desapaleleh_content_kontak', JSON.stringify(kontakData));
  renderPageContent();
  alert('Informasi Kontak Desa berhasil diperbarui!');
}

function hapusKontakData() {
  if (!confirm('Apakah Anda yakin ingin menghapus data kontak desa?')) return;
  localStorage.removeItem('desapaleleh_content_kontak');
  renderPageContent();
  alert('Informasi Kontak Desa berhasil dihapus!');
}

function renderPageContent() {
  const sejarahData = JSON.parse(localStorage.getItem('desapaleleh_content_sejarah'));
  const elSejarah = document.getElementById('display-sejarah');
  const inputSejarah = document.getElementById('input-content-sejarah');
  if (sejarahData) {
    if (elSejarah) elSejarah.innerHTML = `<p>${sejarahData.text}</p>`;
    if (inputSejarah) inputSejarah.value = sejarahData.text;
  } else {
    if (elSejarah) elSejarah.innerHTML = `<p style="color: var(--text-muted);">Belum ada data sejarah desa.</p>`;
    if (inputSejarah) inputSejarah.value = '';
  }

  const strukturImg = localStorage.getItem('desapaleleh_content_struktur_img');
  const imgEl = document.getElementById('display-struktur-img');
  const inputStruktur = document.getElementById('input-struktur-img');
  if (strukturImg) {
    if (imgEl) imgEl.src = strukturImg;
    if (inputStruktur) inputStruktur.value = strukturImg;
  } else {
    if (imgEl) imgEl.src = '[https://via.placeholder.com/900x500?text=Struktur+Organisasi+Pemerintah+Desa+Paleleh](https://via.placeholder.com/900x500?text=Struktur+Organisasi+Pemerintah+Desa+Paleleh)';
    if (inputStruktur) inputStruktur.value = '';
  }

  const kontakData = JSON.parse(localStorage.getItem('desapaleleh_content_kontak'));
  if (kontakData) {
    if (document.getElementById('display-kontak-alamat')) document.getElementById('display-kontak-alamat').innerText = kontakData.alamat;
    if (document.getElementById('display-kontak-telp')) document.getElementById('display-kontak-telp').innerText = kontakData.telp;
    if (document.getElementById('display-kontak-email')) document.getElementById('display-kontak-email').innerText = kontakData.email;
    if (document.getElementById('display-kontak-maps')) document.getElementById('display-kontak-maps').src = kontakData.maps;

    if (document.getElementById('input-kontak-alamat')) document.getElementById('input-kontak-alamat').value = kontakData.alamat;
    if (document.getElementById('input-kontak-telp')) document.getElementById('input-kontak-telp').value = kontakData.telp;
    if (document.getElementById('input-kontak-email')) document.getElementById('input-kontak-email').value = kontakData.email;
    if (document.getElementById('input-kontak-maps')) document.getElementById('input-kontak-maps').value = kontakData.maps;
  }
}

// --- 7. BERANDA ---
const defaultBerandaData = {
  sambutan: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Puji dan syukur kita panjatkan ke hadirat Allah SWT, atas limpahan rahmat-Nya portal resmi Pemerintah Desa Paleleh dapat hadir sebagai sarana pelayanan publik dan transparansi informasi bagi seluruh masyarakat...",
  banner: "images/WhatsApp Video 2026-10-13 at 12.31.10.mp4",
  kepsek: "[https://i.postimg.cc/sxPCtknH/Gemini-Generated-Image-tnppjqtnppjqtnpp.jpg](https://i.postimg.cc/sxPCtknH/Gemini-Generated-Image-tnppjqtnppjqtnpp.jpg)"
};

function saveBerandaData(event) {
  event.preventDefault();
  const berandaData = {
    sambutan: document.getElementById('input-beranda-sambutan').value,
    banner: document.getElementById('input-beranda-banner').value,
    kepsek: document.getElementById('input-beranda-kepsek').value
  };
  localStorage.setItem('desapaleleh_content_beranda', JSON.stringify(berandaData));
  renderBerandaData();
  alert('Data Beranda berhasil diperbarui!');
}

function renderBerandaData() {
  const localData = localStorage.getItem('desapaleleh_content_beranda');
  const data = localData ? JSON.parse(localData) : defaultBerandaData;

  if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = data.sambutan;
  const videoBg = document.getElementById('display-beranda-video-bg');
  const videoSrc = document.getElementById('display-beranda-video-src');
  if (videoBg && videoSrc && videoSrc.getAttribute('src') !== data.banner) {
    videoSrc.setAttribute('src', data.banner);
    videoBg.load();
    videoBg.play().catch(() => {});
  }
  if (document.getElementById('display-beranda-kepsek')) document.getElementById('display-beranda-kepsek').src = data.kepsek;
  if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = data.sambutan;
  if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = data.banner;
  if (document.getElementById('input-beranda-kepsek')) document.getElementById('input-beranda-kepsek').value = data.kepsek;
}

// --- 8. ANGGARAN (ADD & DDS) ---
function getAnggaranList() {
  const data = localStorage.getItem('desapaleleh_content_anggaran_list');
  return data ? JSON.parse(data) : [];
}

function tambahAnggaranItem() {
  const namaEl = document.getElementById('input-anggaran-nama');
  const sumberEl = document.getElementById('input-anggaran-sumber');
  const jumlahEl = document.getElementById('input-anggaran-jumlah');
  if (!namaEl || !jumlahEl) return;
  const nama = namaEl.value.trim();
  const sumber = sumberEl.value;
  const jumlah = parseFloat(jumlahEl.value);

  if (!nama || isNaN(jumlah) || jumlah <= 0) return alert('Nama Kegiatan dan Jumlah Anggaran valid wajib diisi!');

  let list = getAnggaranList();
  list.push({ nama, sumber, jumlah });
  localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(list));
  namaEl.value = '';
  jumlahEl.value = '';
  renderAnggaranData();
  alert('Kegiatan Anggaran berhasil ditambahkan!');
}

function hapusAnggaranItem(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus data anggaran ini?')) return;
  let list = getAnggaranList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(list));
  renderAnggaranData();
}

function renderAnggaranData() {
  const list = getAnggaranList();
  let totalADD = 0, totalDDS = 0;
  list.forEach(item => {
    if (item.sumber === 'ADD') totalADD += item.jumlah;
    if (item.sumber === 'DDS') totalDDS += item.jumlah;
  });

  if (document.getElementById('display-total-add')) document.getElementById('display-total-add').innerText = 'Rp ' + totalADD.toLocaleString('id-ID');
  if (document.getElementById('display-total-dds')) document.getElementById('display-total-dds').innerText = 'Rp ' + totalDDS.toLocaleString('id-ID');

  const adminEl = document.getElementById('admin-anggaran-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada data anggaran.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${idx + 1}. ${item.nama}</strong> <span style="background: ${item.sumber === 'ADD' ? '#0284c7' : '#059669'}; color: white; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${item.sumber}</span><br>
          <small style="color: var(--primary-color); font-weight: 700;">Rp ${item.jumlah.toLocaleString('id-ID')}</small>
        </div>
        <button type="button" onclick="hapusAnggaranItem(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-anggaran-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada rincian kegiatan anggaran.</p>' : list.map((item) => `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div>
          <span style="background: ${item.sumber === 'ADD' ? '#0284c7' : '#059669'}; color: white; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;">Sumber: ${item.sumber}</span>
          <h4 style="color: var(--primary-color); margin-top: 6px; font-size: 1.05rem;">${item.nama}</h4>
        </div>
        <div style="text-align: right; font-weight: 800; color: #047857; font-size: 1.15rem;">
          Rp ${item.jumlah.toLocaleString('id-ID')}
        </div>
      </div>
    `).join('');
  }
}

// --- 9. LAYANAN PENGADUAN MASYARAKAT ---
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

  if (!nama || !pesan) return alert('Nama dan isi pengaduan wajib diisi!');

  let list = getPengaduanList();
  list.unshift({ nama, kontak, subjek, pesan, tanggal: new Date().toLocaleDateString('id-ID') });
  localStorage.setItem('desapaleleh_pengaduan_list', JSON.stringify(list));

  alert('Terima kasih! Pengaduan atau aspirasi Anda telah berhasil dikirimkan kepada Pemerintah Desa Paleleh.');
  document.getElementById('pengadu-nama').value = '';
  document.getElementById('pengadu-kontak').value = '';
  document.getElementById('pengadu-subjek').value = '';
  document.getElementById('pengadu-pesan').value = '';
  renderPengaduanAdmin();
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
        <p style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 8px; line-height: 1.5;">${item.pesan}</p>
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          <strong>Pengirim:</strong> ${item.nama} | <strong>Kontak:</strong> ${item.kontak}
        </div>
      </div>
    `).join('');
  }
}

// --- 10. PEMANGKU JABATAN BPD & LPM ---
function getPengurusBpdLpmList() {
  const data = localStorage.getItem('desapaleleh_content_pengurus_bpd_lpm');
  return data ? JSON.parse(data) : [];
}

function tambahPengurusBpdLpm() {
  const namaEl = document.getElementById('input-pengurus-nama');
  const lembagaEl = document.getElementById('input-pengurus-lembaga');
  const jabatanEl = document.getElementById('input-pengurus-jabatan');
  const fotoEl = document.getElementById('input-pengurus-foto');
  if (!namaEl || !jabatanEl) return;
  const nama = namaEl.value.trim();
  const lembaga = lembagaEl.value;
  const jabatan = jabatanEl.value.trim();
  const foto = fotoEl.value.trim() || '[https://via.placeholder.com/150](https://via.placeholder.com/150)';

  if (!nama || !jabatan) return alert('Nama dan Jabatan Pengurus wajib diisi!');

  let list = getPengurusBpdLpmList();
  list.push({ nama, lembaga, jabatan, foto });
  localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(list));
  namaEl.value = '';
  jabatanEl.value = '';
  fotoEl.value = '';
  renderPengurusBpdLpmList();
  alert('Pemangku jabatan berhasil ditambahkan!');
}

function hapusPengurusBpdLpm(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengurus ini?')) return;
  let list = getPengurusBpdLpmList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(list));
  renderPengurusBpdLpmList();
}

function renderPengurusBpdLpmList() {
  const list = getPengurusBpdLpmList();
  const adminEl = document.getElementById('admin-pengurus-bpd-lpm-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada data pengurus BPD / LPM.</p>' : list.map((item, idx) => `
      <div style="background: #ffffff; padding: 10px 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>[${item.lembaga}] ${item.nama}</strong> - <small style="color: var(--text-muted);">${item.jabatan}</small></div>
        <button type="button" onclick="hapusPengurusBpdLpm(${idx})" style="background: #dc2626; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-pengurus-bpd-lpm-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada data pemangku jabatan BPD / LPM.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <img src="${item.foto}" alt="${item.nama}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
        <span style="background: ${item.lembaga === 'BPD' ? '#064e3b' : '#0284c7'}; color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px;">${item.lembaga}</span>
        <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1rem;">${item.nama}</h4>
        <p style="color: var(--text-muted); font-size: 0.85rem;">${item.jabatan}</p>
      </div>
    `).join('');
  }
}

// --- 11. KEGIATAN & BERITA ---
const defaultKegiatanList = [
  {
    judul: "Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Paleleh",
    tanggal: "2026-10-15",
    foto: "[https://i.postimg.cc/KjT84p0M/Whats-App-Image-2026-10-10-at-13-30-26.jpg](https://i.postimg.cc/KjT84p0M/Whats-App-Image-2026-10-10-at-13-30-26.jpg)",
    deskripsi: "Pemerintah Desa Paleleh menggelar Musrenbangdes RKPDesa guna menyerap aspirasi pembangunan dari seluruh dusun..."
  }
];

function getKegiatanList() {
  const data = localStorage.getItem('desapaleleh_content_kegiatan_list');
  return data ? JSON.parse(data) : defaultKegiatanList;
}

function tambahKegiatan() {
  const judulEl = document.getElementById('input-kegiatan-judul');
  const tanggalEl = document.getElementById('input-kegiatan-tanggal');
  const fotoEl = document.getElementById('input-kegiatan-foto');
  const deskripsiEl = document.getElementById('input-kegiatan-deskripsi');
  if (!judulEl || !deskripsiEl) return;
  const judul = judulEl.value.trim();
  const tanggal = tanggalEl.value.trim();
  const foto = fotoEl ? fotoEl.value.trim() : '';
  const deskripsi = deskripsiEl.value.trim();

  if (!judul || !deskripsi) return alert('Judul dan Deskripsi wajib diisi!');

  let list = getKegiatanList();
  list.push({ judul, tanggal, foto, deskripsi });
  localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(list));
  judulEl.value = '';
  tanggalEl.value = '';
  if (fotoEl) fotoEl.value = '';
  deskripsiEl.value = '';
  renderKegiatanList();
  alert('Kegiatan Desa berhasil ditambahkan!');
}

function hapusKegiatan(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus berita/kegiatan ini?')) return;
  let list = getKegiatanList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(list));
  renderKegiatanList();
}

function renderKegiatanList() {
  const list = getKegiatanList();
  const adminListEl = document.getElementById('admin-kegiatan-list');
  if (adminListEl) {
    adminListEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada kegiatan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.foto ? `<img src="${item.foto}" style="width: 50px; height: 40px; border-radius: 4px; object-fit: contain; background: #000;">` : ''}
          <div><strong>${item.judul}</strong> (${item.tanggal || 'Tanpa Tanggal'})</div>
        </div>
        <button type="button" onclick="hapusKegiatan(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }

  const publicListEl = document.getElementById('display-beranda-kegiatan-list');
  if (publicListEl) {
    publicListEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada berita/kegiatan desa terbaru.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        ${item.foto ? `<div style="width: 100%; max-height: 380px; background: #0f172a; display: flex; align-items: center; justify-content: center; overflow: hidden;"><img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: auto; max-height: 380px; object-fit: contain;"></div>` : ''}
        <div style="padding: 20px;">
          <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: 600;">${item.tanggal || 'Kabar Desa'}</span>
          <h4 style="color: var(--primary-color); margin: 10px 0 6px 0;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.deskripsi}</p>
        </div>
      </div>
    `).join('');
  }
}

// --- 12. VIDEO, SARANA, PERANGKAT, PRAMUKA/BPD, SILAT/PKK ---
function getVideoList() { const data = localStorage.getItem('desapaleleh_content_video_list'); return data ? JSON.parse(data) : []; }
function tambahVideo() {
  const judulEl = document.getElementById('input-video-judul');
  const urlEl = document.getElementById('input-video-url');
  const ketEl = document.getElementById('input-video-ket');
  if (!judulEl || !urlEl || !ketEl) return;
  const judul = judulEl.value.trim();
  const rawUrl = urlEl.value.trim();
  const ket = ketEl.value.trim();
  if (!judul || !rawUrl) return alert('Judul dan URL Video wajib diisi!');
  const url = parseYoutubeEmbedUrl(rawUrl);
  let list = getVideoList();
  list.push({ judul, url, ket });
  localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(list));
  judulEl.value = ''; urlEl.value = ''; ketEl.value = '';
  renderVideoList(); alert('Video berhasil ditambahkan!');
}
function hapusVideo(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;
  let list = getVideoList(); list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(list));
  renderVideoList();
}
function renderVideoList() {
  const list = getVideoList();
  const adminEl = document.getElementById('admin-video-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada video.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong></div>
        <button type="button" onclick="hapusVideo(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  const publicEl = document.getElementById('display-beranda-video-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada video publikasi.</p>' : list.map(item => {
      const embedUrl = parseYoutubeEmbedUrl(item.url);
      const isYoutube = embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be');
      let playerHtml = isYoutube ? `<iframe src="${embedUrl}" title="${item.judul}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe>` : `<video src="${embedUrl}" controls preload="metadata" style="width:100%; height:100%; object-fit:contain; background:#000;"></video>`;
      return `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="width: 100%; height: 315px; background: #000; display: flex; align-items: center; justify-content: center;">${playerHtml}</div>
          <div style="padding: 20px;"><h4 style="color: var(--primary-color); margin-bottom: 6px; font-size: 1.05rem;">${item.judul}</h4><p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p></div>
        </div>
      `;
    }).join('');
  }
}

// Sarana
function getSaranaList() { const data = localStorage.getItem('desapaleleh_content_sarana_list'); return data ? JSON.parse(data) : []; }
function tambahSarana() {
  const namaEl = document.getElementById('input-sarana-nama'); const fotoEl = document.getElementById('input-sarana-foto'); const ketEl = document.getElementById('input-sarana-ket');
  if (!namaEl || !ketEl) return;
  const nama = namaEl.value.trim(); const foto = fotoEl.value.trim() || '[https://via.placeholder.com/300x200](https://via.placeholder.com/300x200)'; const ket = ketEl.value.trim();
  if (!nama || !ket) return alert('Nama Fasilitas dan Keterangan wajib diisi!');
  let list = getSaranaList(); list.push({ nama, foto, ket });
  localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(list));
  namaEl.value = ''; fotoEl.value = ''; ketEl.value = '';
  renderSaranaList(); alert('Fasilitas desa berhasil ditambahkan!');
}
function hapusSarana(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus sarana ini?')) return;
  let list = getSaranaList(); list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(list));
  renderSaranaList();
}
function renderSaranaList() {
  const list = getSaranaList();
  const adminEl = document.getElementById('admin-sarana-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada fasilitas desa.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.nama}</strong></div>
        <button type="button" onclick="hapusSarana(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  const publicEl = document.getElementById('display-sarana-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada data fasilitas dan sarana desa.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 100%; height: 200px; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${item.foto}" alt="${item.nama}" style="width: 100%; height: 100%; object-fit: contain;"></div>
        <div style="padding: 20px;"><h4 style="color: var(--primary-color); margin-bottom: 8px;">${item.nama}</h4><p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p></div>
      </div>
    `).join('');
  }
}

// Perangkat Desa
function getGuruList() { const data = localStorage.getItem('desapaleleh_content_guru_list'); return data ? JSON.parse(data) : []; }
function tambahGuru() {
  const namaEl = document.getElementById('input-guru-nama'); const mapelEl = document.getElementById('input-guru-mapel'); const fotoEl = document.getElementById('input-guru-foto');
  if (!namaEl || !mapelEl) return;
  const nama = namaEl.value.trim(); const mapel = mapelEl.value.trim(); const foto = fotoEl.value.trim() || '[https://via.placeholder.com/150](https://via.placeholder.com/150)';
  if (!nama || !mapel) return alert('Nama dan Jabatan wajib diisi!');
  let list = getGuruList(); list.push({ nama, mapel, foto });
  localStorage.setItem('desapaleleh_content_guru_list', JSON.stringify(list));
  namaEl.value = ''; mapelEl.value = ''; fotoEl.value = '';
  renderGuruList(); alert('Perangkat desa berhasil ditambahkan!');
}
function hapusGuru(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus perangkat desa ini?')) return;
  let list = getGuruList(); list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_guru_list', JSON.stringify(list));
  renderGuruList();
}
function renderGuruList() {
  const list = getGuruList();
  const adminEl = document.getElementById('admin-guru-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada perangkat desa.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.nama}</strong> (${item.mapel})</div>
        <button type="button" onclick="hapusGuru(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  const publicEl = document.getElementById('display-guru-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada daftar perangkat desa.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <img src="${item.foto}" alt="${item.nama}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 12px;">
        <h4 style="color: var(--primary-color); margin-bottom: 5px;">${item.nama}</h4>
        <p style="color: var(--text-muted); font-size: 0.85rem;">${item.mapel}</p>
      </div>
    `).join('');
  }
}

// BPD & LPM Kegiatan
function getPramukaList() { const data = localStorage.getItem('desapaleleh_content_pramuka_list'); return data ? JSON.parse(data) : []; }
function tambahPramuka() {
  const judulEl = document.getElementById('input-pramuka-judul'); const fotoEl = document.getElementById('input-pramuka-foto'); const ketEl = document.getElementById('input-pramuka-ket');
  if (!judulEl || !ketEl) return;
  const judul = judulEl.value.trim(); const foto = fotoEl.value.trim() || '[https://via.placeholder.com/300x200](https://via.placeholder.com/300x200)'; const ket = ketEl.value.trim();
  if (!judul || !ket) return alert('Judul dan Keterangan wajib diisi!');
  let list = getPramukaList(); list.push({ judul, foto, ket });
  localStorage.setItem('desapaleleh_content_pramuka_list', JSON.stringify(list));
  judulEl.value = ''; fotoEl.value = ''; ketEl.value = '';
  renderPramukaList(); alert('Kegiatan BPD/LPM berhasil ditambahkan!');
}
function hapusPramuka(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus dokumentasi kegiatan ini?')) return;
  let list = getPramukaList(); list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_pramuka_list', JSON.stringify(list));
  renderPramukaList();
}
function renderPramukaList() {
  const list = getPramukaList();
  const adminEl = document.getElementById('admin-pramuka-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada dokumentasi kegiatan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong></div>
        <button type="button" onclick="hapusPramuka(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  const publicEl = document.getElementById('display-pramuka-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada dokumentasi BPD & LPM.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 100%; height: 200px; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: 100%; object-fit: contain;"></div>
        <div style="padding: 20px;"><h4 style="color: var(--primary-color); margin-bottom: 8px;">${item.judul}</h4><p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p></div>
      </div>
    `).join('');
  }
}

// Karang Taruna / PKK
function getSilatList() { const data = localStorage.getItem('desapaleleh_content_silat_list'); return data ? JSON.parse(data) : []; }
function tambahSilat() {
  const judulEl = document.getElementById('input-silat-judul'); const fotoEl = document.getElementById('input-silat-foto'); const ketEl = document.getElementById('input-silat-ket');
  if (!judulEl || !ketEl) return;
  const judul = judulEl.value.trim(); const foto = fotoEl.value.trim() || '[https://via.placeholder.com/300x200](https://via.placeholder.com/300x200)'; const ket = ketEl.value.trim();
  if (!judul || !ket) return alert('Judul dan Keterangan wajib diisi!');
  let list = getSilatList(); list.push({ judul, foto, ket });
  localStorage.setItem('desapaleleh_content_silat_list', JSON.stringify(list));
  judulEl.value = ''; fotoEl.value = ''; ketEl.value = '';
  renderSilatList(); alert('Kegiatan Karang Taruna / PKK berhasil ditambahkan!');
}
function hapusSilat(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;
  let list = getSilatList(); list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_silat_list', JSON.stringify(list));
  renderSilatList();
}
function renderSilatList() {
  const list = getSilatList();
  const adminEl = document.getElementById('admin-silat-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada dokumentasi.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong></div>
        <button type="button" onclick="hapusSilat(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  const publicEl = document.getElementById('display-pencaksilat-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada dokumentasi Karang Taruna / PKK.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 100%; height: 200px; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: 100%; object-fit: contain;"></div>
        <div style="padding: 20px;"><h4 style="color: var(--primary-color); margin-bottom: 8px;">${item.judul}</h4><p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p></div>
      </div>
    `).join('');
  }
}

// --- INITIAL LOAD ---
window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
  renderPageContent();
  renderBerandaData();
  renderKegiatanList();
  renderVideoList();
  renderSaranaList();
  renderGuruList();
  renderPramukaList();
  renderSilatList();
  renderTupoksiList();
  renderVisiMisi();
  renderTautanList();
  renderAnggaranData();
  renderPengurusBpdLpmList();
  renderPengaduanAdmin();
});
