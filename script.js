// --- 1. NAVIGASI HALAMAN ---
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

// --- FUNGSI PERMOHONAN SURAT MANDIRI DENGAN UPLOAD DATA ---
function submitPermohonanSuratMandiri(event) {
  event.preventDefault();
  const nama = document.getElementById('permohonan-nama').value.trim();
  const nik = document.getElementById('permohonan-nik').value.trim();
  const telp = document.getElementById('permohonan-telp').value.trim();
  const dusun = document.getElementById('permohonan-dusun').value;
  const jenisSurat = document.getElementById('permohonan-jenis-surat').value;
  const keperluan = document.getElementById('permohonan-keperluan').value.trim();
  const fileInput = document.getElementById('permohonan-file-upload');

  if (!nama || !nik || !telp || !keperluan) {
    alert('Semua kolom wajib diisi dengan lengkap!');
    return;
  }

  if (fileInput.files.length === 0) {
    alert('Harap unggah dokumen persyaratan terlebih dahulu!');
    return;
  }

  const fileName = fileInput.files[0].name;

  // Simpan data permohonan ke LocalStorage
  let daftarPermohonan = JSON.parse(localStorage.getItem('desapaleleh_permohonan_surat') || '[]');
  daftarPermohonan.push({
    nama,
    nik,
    telp,
    dusun,
    jenisSurat,
    keperluan,
    berkas: fileName,
    tanggal: new Date().toLocaleDateString('id-ID')
  });
  localStorage.setItem('desapaleleh_permohonan_surat', JSON.stringify(daftarPermohonan));

  alert(`Terima kasih ${nama}, permohonan "${jenisSurat}" Anda telah berhasil dikirim beserta berkas (${fileName}). Perangkat Desa akan segera memproses permohonan Anda.`);
  
  // Reset Form
  event.target.reset();
  showPage('view-beranda');
}

// --- FUNGSI AKSESIBILITAS ---
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

// --- YOUTUBE EMBED ---
function parseYoutubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v');
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1].split('?')[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// --- KELOLA MENU TAUTAN ---
const defaultTautanList = [
  { nama: 'Portal Kab. Buol', url: 'https://buolkab.go.id' },
  { nama: 'Kementerian Desa PDT', url: 'https://kemendesa.go.id' },
  { nama: 'KEMENDAGRI', url: 'https://kemendagri.go.id' },
  { nama: 'Layanan Dukcapil', url: 'https://dukcapil.kemendagri.go.id' }
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
  if (!nama || !url) return alert('Nama dan URL wajib diisi!');

  let list = getTautanList();
  list.push({ nama, url });
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(list));
  namaEl.value = '';
  urlEl.value = '';
  renderTautanList();
  alert('Tautan berhasil ditambahkan!');
}

function hapusTautanItem(index) {
  if (!confirm('Hapus tautan ini?')) return;
  let list = getTautanList();
  list.splice(index, 1);
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(list));
  renderTautanList();
}

function renderTautanList() {
  const list = getTautanList();
  const adminEl = document.getElementById('admin-tautan-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="color:var(--text-muted);">Belum ada tautan.</p>' : list.map((item, idx) => `
      <div style="background:#f8fafc; padding:10px 15px; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${idx + 1}. ${item.nama}</strong><br><small>${item.url}</small></div>
        <button type="button" onclick="hapusTautanItem(${idx})" style="background:#dc2626; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  const navbarEl = document.getElementById('display-navbar-tautan');
  if (navbarEl) {
    navbarEl.innerHTML = list.map(item => `<li><a href="${item.url}" target="_blank"><i class="fas fa-external-link-alt"></i> ${item.nama}</a></li>`).join('');
  }
}

// --- DATA PENDUDUK ---
const defaultStudentData = {
  '7a': { l: 210, p: 195, wali: 'Kadus I', foto: 'https://via.placeholder.com/150' },
  '7b': { l: 185, p: 190, wali: 'Kadus II', foto: 'https://via.placeholder.com/150' },
  '8a': { l: 220, p: 215, wali: 'Kadus III', foto: 'https://via.placeholder.com/150' },
  '8b': { l: 175, p: 180, wali: 'Kadus IV', foto: 'https://via.placeholder.com/150' },
  '9a': { l: 160, p: 155, wali: 'Kadus V', foto: 'https://via.placeholder.com/150' },
  '9b': { l: 140, p: 145, wali: 'Kadus VI', foto: 'https://via.placeholder.com/150' }
};

function getStudentData() {
  const data = localStorage.getItem('desapaleleh_data_penduduk');
  return data ? JSON.parse(data) : defaultStudentData;
}

function renderStudentData() {
  const data = getStudentData();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];
  classes.forEach(cls => {
    const d = data[cls] || { l: 0, p: 0, wali: '-', foto: '' };
    if (document.getElementById(`display-${cls}-l`)) document.getElementById(`display-${cls}-l`).innerText = d.l;
    if (document.getElementById(`display-${cls}-p`)) document.getElementById(`display-${cls}-p`).innerText = d.p;
    if (document.getElementById(`display-${cls}-total`)) document.getElementById(`display-${cls}-total`).innerText = Number(d.l) + Number(d.p);
    if (document.getElementById(`display-${cls}-wali`)) document.getElementById(`display-${cls}-wali`).innerText = d.wali;
    if (document.getElementById(`display-${cls}-foto`)) document.getElementById(`display-${cls}-foto`).src = d.foto || 'https://via.placeholder.com/150';

    if (document.getElementById(`input-${cls}-l`)) document.getElementById(`input-${cls}-l`).value = d.l;
    if (document.getElementById(`input-${cls}-p`)) document.getElementById(`input-${cls}-p`).value = d.p;
    if (document.getElementById(`input-${cls}-wali`)) document.getElementById(`input-${cls}-wali`).value = d.wali;
    if (document.getElementById(`input-${cls}-foto`)) document.getElementById(`input-${cls}-foto`).value = d.foto;
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
  if (!confirm('Kosongkan seluruh data penduduk?')) return;
  let cleared = {};
  ['7a', '7b', '8a', '8b', '9a', '9b'].forEach(cls => { cleared[cls] = { l: 0, p: 0, wali: '-', foto: '' }; });
  localStorage.setItem('desapaleleh_data_penduduk', JSON.stringify(cleared));
  renderStudentData();
  alert('Data kependudukan dikosongkan!');
}

// --- LOGIN & ADMIN ---
function checkLoginAndOpenMenu() {
  if (localStorage.getItem('desapaleleh_admin_logged_in') === 'true') showPage('view-panel-petugas');
  else showPage('view-login-petugas');
}

function handleLogin(event) {
  event.preventDefault();
  if (document.getElementById('login-user').value === 'admin' && document.getElementById('login-pass').value === 'paleleh2026') {
    localStorage.setItem('desapaleleh_admin_logged_in', 'true');
    alert('Login Berhasil!');
    showPage('view-panel-petugas');
  } else {
    alert('Username atau Password salah!');
  }
}

function handleLogout() {
  localStorage.removeItem('desapaleleh_admin_logged_in');
  showPage('view-beranda');
}

function switchTab(tabId) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';
  document.querySelectorAll('[id^="btn-tab-"]').forEach(b => { b.style.background = '#cbd5e1'; b.style.color = 'var(--text-dark)'; });
  const activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) { activeBtn.style.background = 'var(--primary-color)'; activeBtn.style.color = 'white'; }
}

// --- VISI & MISI ---
const defaultVisi = "Mewujudkan Desa Paleleh yang Maju, Mandiri, Sejahtera, Berkarakter Budaya, dan Transparan dalam Tata Kelola Pemerintahan";
const defaultMisiList = [
  "Meningkatkan Transparansi dan Akuntabilitas Penyelenggaraan Government Desa Melalui Digitalisasi Layanan Publik",
  "Mengoptimalkan Potensi Ekonomi Sumber Daya Alam dan Pemberdayaan UMKM / BUMDes",
  "Pembangunan Infrastruktur Desa yang Merata, Berkelanjutan, dan Berwawasan Lingkungan",
  "Meningkatkan Kualitas Sumber Daya Manusia Melalui Program Kesehatan, Pendidikan, dan Kesejahteraan Sosial",
  "Memperkuat Nilai-Nilai Keagamaan, Gotong-Royong, dan Pelestarian Adat Istiadat Lokal"
];

function getVisi() { return localStorage.getItem('desapaleleh_content_visi') ?? defaultVisi; }
function getMisiList() { const d = localStorage.getItem('desapaleleh_content_misi_list'); return d ? JSON.parse(d) : defaultMisiList; }

function saveVisiOnly() {
  localStorage.setItem('desapaleleh_content_visi', document.getElementById('input-content-visi').value.trim());
  renderVisiMisi();
  alert('Visi diperbarui!');
}
function hapusVisiOnly() {
  if (!confirm('Hapus teks visi?')) return;
  localStorage.setItem('desapaleleh_content_visi', '');
  renderVisiMisi();
}
function tambahMisiPoin() {
  const el = document.getElementById('input-misi-poin');
  const txt = el.value.trim();
  if (!txt) return alert('Poin misi kosong!');
  let list = getMisiList();
  list.push(txt);
  localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(list));
  el.value = '';
  renderVisiMisi();
  alert('Poin misi ditambahkan!');
}
function hapusMisiPoin(idx) {
  if (!confirm('Hapus poin misi ini?')) return;
  let list = getMisiList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(list));
  renderVisiMisi();
}
function renderVisiMisi() {
  const v = getVisi();
  const m = getMisiList();
  if (document.getElementById('display-visi')) document.getElementById('display-visi').innerText = v;
  if (document.getElementById('input-content-visi')) document.getElementById('input-content-visi').value = v;
  
  const adminEl = document.getElementById('admin-misi-list');
  if (adminEl) adminEl.innerHTML = m.length === 0 ? '<p>Belum ada misi.</p>' : m.map((item, idx) => `
    <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
      <span>${idx + 1}. ${item}</span>
      <button type="button" onclick="hapusMisiPoin(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
    </div>
  `).join('');

  const publicEl = document.getElementById('display-misi-list');
  if (publicEl) publicEl.innerHTML = m.map((item, idx) => `
    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px; display:flex; gap:15px; align-items:center;">
      <div style="background:var(--primary-color); color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700;">${idx + 1}</div>
      <div>${item}</div>
    </div>
  `).join('');
}

// --- TUPOKSI ---
const defaultTupoksiList = [
  { judul: 'Kepala Desa', deskripsi: 'Memimpin penyelenggaraan pemerintahan desa dan pembangunan.' },
  { judul: 'Sekretaris Desa', deskripsi: 'Mengoordinasikan administrasi umum, keuangan, dan pelaporan.' },
  { judul: 'Kaur Keuangan', deskripsi: 'Mengelola penatausahaan APBDesa.' },
  { judul: 'Kasi Pemerintahan', deskripsi: 'Mengelola administrasi kependudukan dan pertanahan.' },
  { judul: 'Kasi Kesejahteraan', deskripsi: 'Melaksanakan pembangunan sarana prasarana dan pemberdayaan masyarakat.' }
];
function getTupoksiList() { const d = localStorage.getItem('desapaleleh_content_tupoksi_list'); return d ? JSON.parse(d) : defaultTupoksiList; }
function tambahTupoksiItem() {
  const j = document.getElementById('input-tupoksi-judul').value.trim();
  const d = document.getElementById('input-tupoksi-deskripsi').value.trim();
  if (!j || !d) return alert('Isi lengkap!');
  let list = getTupoksiList();
  list.push({ judul: j, deskripsi: d });
  localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(list));
  document.getElementById('input-tupoksi-judul').value = '';
  document.getElementById('input-tupoksi-deskripsi').value = '';
  renderTupoksiList();
  alert('Tupoksi ditambahkan!');
}
function hapusTupoksiItem(idx) {
  if (!confirm('Hapus tupoksi ini?')) return;
  let list = getTupoksiList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(list));
  renderTupoksiList();
}
function renderTupoksiList() {
  const list = getTupoksiList();
  if (document.getElementById('admin-tupoksi-list')) {
    document.getElementById('admin-tupoksi-list').innerHTML = list.map((item, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${item.judul}</strong>: ${item.deskripsi}</div>
        <button type="button" onclick="hapusTupoksiItem(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-tupoksi-list')) {
    document.getElementById('display-tupoksi-list').innerHTML = list.map((item, idx) => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px; display:flex; gap:15px;">
        <div style="background:var(--primary-color); color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700;">${idx+1}</div>
        <div><h4 style="color:var(--primary-color);">${item.judul}</h4><p>${item.deskripsi}</p></div>
      </div>
    `).join('');
  }
}

// --- SEJARAH, STRUKTUR, KONTAK ---
function savePageContent(event, pageKey) {
  event.preventDefault();
  localStorage.setItem('desapaleleh_content_' + pageKey, JSON.stringify({ text: document.getElementById('input-content-sejarah').value }));
  renderPageContent();
  alert('Sejarah disimpan!');
}
function hapusPageContent(pageKey) {
  if (!confirm('Hapus sejarah?')) return;
  localStorage.removeItem('desapaleleh_content_' + pageKey);
  renderPageContent();
}
function saveStrukturGambar(event) {
  event.preventDefault();
  localStorage.setItem('desapaleleh_content_struktur_img', document.getElementById('input-struktur-img').value.trim());
  renderPageContent();
  alert('Struktur disimpan!');
}
function hapusStrukturGambar() {
  if (!confirm('Hapus gambar struktur?')) return;
  localStorage.removeItem('desapaleleh_content_struktur_img');
  renderPageContent();
}
function saveKontakData(event) {
  event.preventDefault();
  const d = {
    alamat: document.getElementById('input-kontak-alamat').value.trim(),
    telp: document.getElementById('input-kontak-telp').value.trim(),
    email: document.getElementById('input-kontak-email').value.trim(),
    maps: document.getElementById('input-kontak-maps').value.trim()
  };
  localStorage.setItem('desapaleleh_content_kontak', JSON.stringify(d));
  renderPageContent();
  alert('Kontak disimpan!');
}
function hapusKontakData() {
  if (!confirm('Hapus kontak?')) return;
  localStorage.removeItem('desapaleleh_content_kontak');
  renderPageContent();
}
function renderPageContent() {
  const s = JSON.parse(localStorage.getItem('desapaleleh_content_sejarah'));
  if (document.getElementById('display-sejarah')) document.getElementById('display-sejarah').innerHTML = s ? `<p>${s.text}</p>` : '<p>Belum ada sejarah.</p>';
  if (document.getElementById('input-content-sejarah')) document.getElementById('input-content-sejarah').value = s ? s.text : '';

  const img = localStorage.getItem('desapaleleh_content_struktur_img');
  if (document.getElementById('display-struktur-img')) document.getElementById('display-struktur-img').src = img || 'https://via.placeholder.com/900x500?text=Struktur';
  if (document.getElementById('input-struktur-img')) document.getElementById('input-struktur-img').value = img || '';

  const k = JSON.parse(localStorage.getItem('desapaleleh_content_kontak'));
  if (k) {
    if (document.getElementById('display-kontak-alamat')) document.getElementById('display-kontak-alamat').innerText = k.alamat;
    if (document.getElementById('display-kontak-telp')) document.getElementById('display-kontak-telp').innerText = k.telp;
    if (document.getElementById('display-kontak-email')) document.getElementById('display-kontak-email').innerText = k.email;
    if (document.getElementById('display-kontak-maps')) document.getElementById('display-kontak-maps').src = k.maps;
    if (document.getElementById('input-kontak-alamat')) document.getElementById('input-kontak-alamat').value = k.alamat;
    if (document.getElementById('input-kontak-telp')) document.getElementById('input-kontak-telp').value = k.telp;
    if (document.getElementById('input-kontak-email')) document.getElementById('input-kontak-email').value = k.email;
    if (document.getElementById('input-kontak-maps')) document.getElementById('input-kontak-maps').value = k.maps;
  }
}

// --- BERANDA ---
const defaultBerandaData = {
  sambutan: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Pemerintah Desa Paleleh...",
  banner: "images/WhatsApp Video 2026-10-13 at 12.31.10.mp4",
  kepsek: "https://i.postimg.cc/sxPCtknH/Gemini-Generated-Image-tnppjqtnppjqtnpp.jpg"
};
function saveBerandaData(event) {
  event.preventDefault();
  const d = {
    sambutan: document.getElementById('input-beranda-sambutan').value,
    banner: document.getElementById('input-beranda-banner').value,
    kepsek: document.getElementById('input-beranda-kepsek').value
  };
  localStorage.setItem('desapaleleh_content_beranda', JSON.stringify(d));
  renderBerandaData();
  alert('Beranda diperbarui!');
}
function renderBerandaData() {
  const d = JSON.parse(localStorage.getItem('desapaleleh_content_beranda')) || defaultBerandaData;
  if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = d.sambutan;
  if (document.getElementById('display-beranda-kepsek')) document.getElementById('display-beranda-kepsek').src = d.kepsek;
  if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = d.sambutan;
  if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = d.banner;
  if (document.getElementById('input-beranda-kepsek')) document.getElementById('input-beranda-kepsek').value = d.kepsek;
}

// --- ANGGARAN ---
function getAnggaranList() { const d = localStorage.getItem('desapaleleh_content_anggaran_list'); return d ? JSON.parse(d) : []; }
function tambahAnggaranItem() {
  const n = document.getElementById('input-anggaran-nama').value.trim();
  const s = document.getElementById('input-anggaran-sumber').value;
  const j = parseFloat(document.getElementById('input-anggaran-jumlah').value);
  if (!n || isNaN(j) || j <= 0) return alert('Isi data anggaran dengan benar!');
  let list = getAnggaranList();
  list.push({ nama: n, sumber: s, jumlah: j });
  localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(list));
  document.getElementById('input-anggaran-nama').value = '';
  document.getElementById('input-anggaran-jumlah').value = '';
  renderAnggaranData();
  alert('Anggaran ditambahkan!');
}
function hapusAnggaranItem(idx) {
  if (!confirm('Hapus anggaran ini?')) return;
  let list = getAnggaranList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(list));
  renderAnggaranData();
}
function renderAnggaranData() {
  const list = getAnggaranList();
  let tADD = 0, tDDS = 0;
  list.forEach(i => { if (i.sumber === 'ADD') tADD += i.jumlah; if (i.sumber === 'DDS') tDDS += i.jumlah; });
  if (document.getElementById('display-total-add')) document.getElementById('display-total-add').innerText = 'Rp ' + tADD.toLocaleString('id-ID');
  if (document.getElementById('display-total-dds')) document.getElementById('display-total-dds').innerText = 'Rp ' + tDDS.toLocaleString('id-ID');

  if (document.getElementById('admin-anggaran-list')) {
    document.getElementById('admin-anggaran-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${i.nama}</strong> (${i.sumber}): Rp ${i.jumlah.toLocaleString('id-ID')}</div>
        <button type="button" onclick="hapusAnggaranItem(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-anggaran-list')) {
    document.getElementById('display-anggaran-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center;">
        <div><span style="background:${i.sumber==='ADD'?'#0284c7':'#059669'}; color:white; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${i.sumber}</span><h4 style="color:var(--primary-color); margin-top:5px;">${i.nama}</h4></div>
        <div style="font-weight:800; color:#047857;">Rp ${i.jumlah.toLocaleString('id-ID')}</div>
      </div>
    `).join('');
  }
}

// --- PENGURUS BPD/LPM ---
function getPengurusBpdLpmList() { const d = localStorage.getItem('desapaleleh_content_pengurus_bpd_lpm'); return d ? JSON.parse(d) : []; }
function tambahPengurusBpdLpm() {
  const n = document.getElementById('input-pengurus-nama').value.trim();
  const l = document.getElementById('input-pengurus-lembaga').value;
  const j = document.getElementById('input-pengurus-jabatan').value.trim();
  const f = document.getElementById('input-pengurus-foto').value.trim() || 'https://via.placeholder.com/150';
  if (!n || !j) return alert('Nama dan jabatan wajib diisi!');
  let list = getPengurusBpdLpmList();
  list.push({ nama: n, lembaga: l, jabatan: j, foto: f });
  localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(list));
  document.getElementById('input-pengurus-nama').value = '';
  document.getElementById('input-pengurus-jabatan').value = '';
  document.getElementById('input-pengurus-foto').value = '';
  renderPengurusBpdLpmList();
  alert('Pengurus ditambahkan!');
}
function hapusPengurusBpdLpm(idx) {
  if (!confirm('Hapus pengurus ini?')) return;
  let list = getPengurusBpdLpmList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(list));
  renderPengurusBpdLpmList();
}
function renderPengurusBpdLpmList() {
  const list = getPengurusBpdLpmList();
  if (document.getElementById('admin-pengurus-bpd-lpm-list')) {
    document.getElementById('admin-pengurus-bpd-lpm-list').innerHTML = list.map((i, idx) => `
      <div style="background:#fff; padding:8px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div>[${i.lembaga}] <strong>${i.nama}</strong> (${i.jabatan})</div>
        <button type="button" onclick="hapusPengurusBpdLpm(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-pengurus-bpd-lpm-list')) {
    document.getElementById('display-pengurus-bpd-lpm-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; text-align:center;">
        <img src="${i.foto}" style="width:90px; height:90px; border-radius:50%; object-fit:cover; margin-bottom:10px;">
        <span style="background:${i.lembaga==='BPD'?'#064e3b':'#0284c7'}; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${i.lembaga}</span>
        <h4 style="color:var(--primary-color); margin-top:5px;">${i.nama}</h4>
        <p style="font-size:0.85rem; color:var(--text-muted);">${i.jabatan}</p>
      </div>
    `).join('');
  }
}

// --- KEGIATAN BERANDA ---
const defaultKegiatanList = [
  { judul: "Musrenbangdes Paleleh", tanggal: "2026-10-15", foto: "https://i.postimg.cc/KjT84p0M/Whats-App-Image-2026-10-10-at-13-30-26.jpg", deskripsi: "Pemerintah Desa Paleleh menggelar Musrenbangdes..." }
];
function getKegiatanList() { const d = localStorage.getItem('desapaleleh_content_kegiatan_list'); return d ? JSON.parse(d) : defaultKegiatanList; }
function tambahKegiatan() {
  const j = document.getElementById('input-kegiatan-judul').value.trim();
  const t = document.getElementById('input-kegiatan-tanggal').value;
  const f = document.getElementById('input-kegiatan-foto').value.trim();
  const desc = document.getElementById('input-kegiatan-deskripsi').value.trim();
  if (!j || !desc) return alert('Judul dan deskripsi wajib diisi!');
  let list = getKegiatanList();
  list.push({ judul: j, tanggal: t, foto: f, deskripsi: desc });
  localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(list));
  document.getElementById('input-kegiatan-judul').value = '';
  document.getElementById('input-kegiatan-deskripsi').value = '';
  renderKegiatanList();
  alert('Kegiatan ditambahkan!');
}
function hapusKegiatan(idx) {
  if (!confirm('Hapus kegiatan ini?')) return;
  let list = getKegiatanList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(list));
  renderKegiatanList();
}
function renderKegiatanList() {
  const list = getKegiatanList();
  if (document.getElementById('admin-kegiatan-list')) {
    document.getElementById('admin-kegiatan-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${i.judul}</strong></div>
        <button type="button" onclick="hapusKegiatan(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-beranda-kegiatan-list')) {
    document.getElementById('display-beranda-kegiatan-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
        ${i.foto ? `<img src="${i.foto}" style="width:100%; height:200px; object-fit:cover;">` : ''}
        <div style="padding:15px;"><span style="font-size:0.75rem; color:#0369a1;">${i.tanggal || ''}</span><h4 style="color:var(--primary-color); margin:5px 0;">${i.judul}</h4><p style="font-size:0.9rem;">${i.deskripsi}</p></div>
      </div>
    `).join('');
  }
}

// --- VIDEO ---
function getVideoList() { const d = localStorage.getItem('desapaleleh_content_video_list'); return d ? JSON.parse(d) : []; }
function tambahVideo() {
  const j = document.getElementById('input-video-judul').value.trim();
  const u = document.getElementById('input-video-url').value.trim();
  const k = document.getElementById('input-video-ket').value.trim();
  if (!j || !u) return alert('Isi judul dan URL video!');
  let list = getVideoList();
  list.push({ judul: j, url: parseYoutubeEmbedUrl(u), ket: k });
  localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(list));
  document.getElementById('input-video-judul').value = '';
  document.getElementById('input-video-url').value = '';
  document.getElementById('input-video-ket').value = '';
  renderVideoList();
  alert('Video ditambahkan!');
}
function hapusVideo(idx) {
  if (!confirm('Hapus video ini?')) return;
  let list = getVideoList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(list));
  renderVideoList();
}
function renderVideoList() {
  const list = getVideoList();
  if (document.getElementById('admin-video-list')) {
    document.getElementById('admin-video-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${i.judul}</strong></div>
        <button type="button" onclick="hapusVideo(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-beranda-video-list')) {
    document.getElementById('display-beranda-video-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
        <div style="width:100%; height:250px; background:#000;"><iframe src="${i.url}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe></div>
        <div style="padding:15px;"><h4 style="color:var(--primary-color);">${i.judul}</h4><p style="font-size:0.9rem;">${i.ket}</p></div>
      </div>
    `).join('');
  }
}

// --- SARANA ---
function getSaranaList() { const d = localStorage.getItem('desapaleleh_content_sarana_list'); return d ? JSON.parse(d) : []; }
function tambahSarana() {
  const n = document.getElementById('input-sarana-nama').value.trim();
  const f = document.getElementById('input-sarana-foto').value.trim() || 'https://via.placeholder.com/300x200';
  const k = document.getElementById('input-sarana-ket').value.trim();
  if (!n || !k) return alert('Isi nama dan keterangan!');
  let list = getSaranaList();
  list.push({ nama: n, foto: f, ket: k });
  localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(list));
  document.getElementById('input-sarana-nama').value = '';
  document.getElementById('input-sarana-foto').value = '';
  document.getElementById('input-sarana-ket').value = '';
  renderSaranaList();
  alert('Sarana ditambahkan!');
}
function hapusSarana(idx) {
  if (!confirm('Hapus sarana ini?')) return;
  let list = getSaranaList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(list));
  renderSaranaList();
}
function renderSaranaList() {
  const list = getSaranaList();
  if (document.getElementById('admin-sarana-list')) {
    document.getElementById('admin-sarana-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${i.nama}</strong></div>
        <button type="button" onclick="hapusSarana(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-sarana-list')) {
    document.getElementById('display-sarana-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
        <img src="${i.foto}" style="width:100%; height:180px; object-fit:cover;">
        <div style="padding:15px;"><h4 style="color:var(--primary-color);">${i.nama}</h4><p style="font-size:0.9rem;">${i.ket}</p></div>
      </div>
    `).join('');
  }
}

// --- PERANGKAT DESA ---
function getGuruList() { const d = localStorage.getItem('desapaleleh_content_guru_list'); return d ? JSON.parse(d) : []; }
function tambahGuru() {
  const n = document.getElementById('input-guru-nama').value.trim();
  const m = document.getElementById('input-guru-mapel').value.trim();
  const f = document.getElementById('input-guru-foto').value.trim() || 'https://via.placeholder.com/150';
  if (!n || !m) return alert('Nama dan jabatan wajib diisi!');
  let list = getGuruList();
  list.push({ nama: n, mapel: m, foto: f });
  localStorage.setItem('desapaleleh_content_guru_list', JSON.stringify(list));
  document.getElementById('input-guru-nama').value = '';
  document.getElementById('input-guru-mapel').value = '';
  document.getElementById('input-guru-foto').value = '';
  renderGuruList();
  alert('Perangkat ditambahkan!');
}
function hapusGuru(idx) {
  if (!confirm('Hapus perangkat ini?')) return;
  let list = getGuruList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_guru_list', JSON.stringify(list));
  renderGuruList();
}
function renderGuruList() {
  const list = getGuruList();
  if (document.getElementById('admin-guru-list')) {
    document.getElementById('admin-guru-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${i.nama}</strong> (${i.mapel})</div>
        <button type="button" onclick="hapusGuru(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-guru-list')) {
    document.getElementById('display-guru-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; text-align:center;">
        <img src="${i.foto}" style="width:90px; height:90px; border-radius:50%; object-fit:cover; margin-bottom:10px;">
        <h4 style="color:var(--primary-color);">${i.nama}</h4>
        <p style="font-size:0.85rem; color:var(--text-muted);">${i.mapel}</p>
      </div>
    `).join('');
  }
}

// --- PRAMUKA / KEGIATAN BPD & LPM ---
function getPramukaList() { const d = localStorage.getItem('desapaleleh_content_pramuka_list'); return d ? JSON.parse(d) : []; }
function tambahPramuka() {
  const j = document.getElementById('input-pramuka-judul').value.trim();
  const f = document.getElementById('input-pramuka-foto').value.trim() || 'https://via.placeholder.com/300x200';
  const k = document.getElementById('input-pramuka-ket').value.trim();
  if (!j || !k) return alert('Isi judul dan keterangan!');
  let list = getPramukaList();
  list.push({ judul: j, foto: f, ket: k });
  localStorage.setItem('desapaleleh_content_pramuka_list', JSON.stringify(list));
  document.getElementById('input-pramuka-judul').value = '';
  document.getElementById('input-pramuka-foto').value = '';
  document.getElementById('input-pramuka-ket').value = '';
  renderPramukaList();
  alert('Kegiatan BPD/LPM ditambahkan!');
}
function hapusPramuka(idx) {
  if (!confirm('Hapus kegiatan ini?')) return;
  let list = getPramukaList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_pramuka_list', JSON.stringify(list));
  renderPramukaList();
}
function renderPramukaList() {
  const list = getPramukaList();
  if (document.getElementById('admin-pramuka-list')) {
    document.getElementById('admin-pramuka-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${i.judul}</strong></div>
        <button type="button" onclick="hapusPramuka(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-pramuka-list')) {
    document.getElementById('display-pramuka-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
        <img src="${i.foto}" style="width:100%; height:180px; object-fit:cover;">
        <div style="padding:15px;"><h4 style="color:var(--primary-color);">${i.judul}</h4><p style="font-size:0.9rem;">${i.ket}</p></div>
      </div>
    `).join('');
  }
}

// --- PKK & KARANG TARUNA ---
function getSilatList() { const d = localStorage.getItem('desapaleleh_content_silat_list'); return d ? JSON.parse(d) : []; }
function tambahSilat() {
  const j = document.getElementById('input-silat-judul').value.trim();
  const f = document.getElementById('input-silat-foto').value.trim() || 'https://via.placeholder.com/300x200';
  const k = document.getElementById('input-silat-ket').value.trim();
  if (!j || !k) return alert('Isi judul dan keterangan!');
  let list = getSilatList();
  list.push({ judul: j, foto: f, ket: k });
  localStorage.setItem('desapaleleh_content_silat_list', JSON.stringify(list));
  document.getElementById('input-silat-judul').value = '';
  document.getElementById('input-silat-foto').value = '';
  document.getElementById('input-silat-ket').value = '';
  renderSilatList();
  alert('Kegiatan ditambahkan!');
}
function hapusSilat(idx) {
  if (!confirm('Hapus kegiatan ini?')) return;
  let list = getSilatList();
  list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_silat_list', JSON.stringify(list));
  renderSilatList();
}
function renderSilatList() {
  const list = getSilatList();
  if (document.getElementById('admin-silat-list')) {
    document.getElementById('admin-silat-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${i.judul}</strong></div>
        <button type="button" onclick="hapusSilat(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-pencaksilat-list')) {
    document.getElementById('display-pencaksilat-list').innerHTML = list.map(i => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
        <img src="${i.foto}" style="width:100%; height:180px; object-fit:cover;">
        <div style="padding:15px;"><h4 style="color:var(--primary-color);">${i.judul}</h4><p style="font-size:0.9rem;">${i.ket}</p></div>
      </div>
    `).join('');
  }
}

// --- INITIALIZE ON LOAD ---
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
});
