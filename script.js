function showPage(pageId) {
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => { v.style.display = 'none'; v.classList.remove('active-view'); });
  const target = document.getElementById(pageId);
  if (target) { target.style.display = 'block'; target.classList.add('active-view'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function submitPermohonanSuratMandiri(event) {
  event.preventDefault();
  const nama = document.getElementById('permohonan-nama').value.trim();
  const nik = document.getElementById('permohonan-nik').value.trim();
  const telp = document.getElementById('permohonan-telp').value.trim();
  const jenisSurat = document.getElementById('permohonan-jenis-surat').value;
  const fileInput = document.getElementById('permohonan-file-upload');

  if (!nama || !nik || !telp || fileInput.files.length === 0) {
    alert('Harap isi semua kolom data dan unggah dokumen persyaratan!');
    return;
  }

  alert(`Terima kasih ${nama}, permohonan "${jenisSurat}" Anda berhasil dikirim dan akan segera diproses oleh Perangkat Desa.`);
  event.target.reset();
  showPage('view-beranda');
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

function parseYoutubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('youtube.com/watch')) videoId = new URLSearchParams(url.split('?')[1]).get('v');
  else if (url.includes('youtube.com/embed/')) videoId = url.split('youtube.com/embed/')[1].split('?')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// TAUTAN
const defaultTautanList = [
  { nama: 'Portal Kab. Buol', url: 'https://buolkab.go.id' },
  { nama: 'Kementerian Desa PDT', url: 'https://kemendesa.go.id' }
];
function getTautanList() { const d = localStorage.getItem('desapaleleh_content_tautan_list'); return d ? JSON.parse(d) : defaultTautanList; }
function tambahTautanItem() {
  const n = document.getElementById('input-tautan-nama').value.trim();
  const u = document.getElementById('input-tautan-url').value.trim();
  if (!n || !u) return alert('Isi nama dan URL!');
  let list = getTautanList(); list.push({ nama: n, url: u });
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(list));
  document.getElementById('input-tautan-nama').value = ''; document.getElementById('input-tautan-url').value = '';
  renderTautanList(); alert('Tautan ditambahkan!');
}
function hapusTautanItem(idx) {
  if (!confirm('Hapus tautan?')) return;
  let list = getTautanList(); list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(list));
  renderTautanList();
}
function renderTautanList() {
  const list = getTautanList();
  if (document.getElementById('admin-tautan-list')) {
    document.getElementById('admin-tautan-list').innerHTML = list.map((i, idx) => `
      <div style="background:#f8fafc; padding:8px 12px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <span>${i.nama}</span><button type="button" onclick="hapusTautanItem(${idx})" style="background:#dc2626; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Hapus</button>
      </div>
    `).join('');
  }
  if (document.getElementById('display-navbar-tautan')) {
    document.getElementById('display-navbar-tautan').innerHTML = list.map(i => `<li><a href="${i.url}" target="_blank"><i class="fas fa-external-link-alt"></i> ${i.nama}</a></li>`).join('');
  }
}

// DATA PENDUDUK
const defaultStudentData = {
  '7a': { l: 210, p: 195, wali: 'Kadus I', foto: 'https://via.placeholder.com/150' },
  '7b': { l: 185, p: 190, wali: 'Kadus II', foto: 'https://via.placeholder.com/150' },
  '8a': { l: 220, p: 215, wali: 'Kadus III', foto: 'https://via.placeholder.com/150' },
  '8b': { l: 175, p: 180, wali: 'Kadus IV', foto: 'https://via.placeholder.com/150' },
  '9a': { l: 160, p: 155, wali: 'Kadus V', foto: 'https://via.placeholder.com/150' },
  '9b': { l: 140, p: 145, wali: 'Kadus VI', foto: 'https://via.placeholder.com/150' }
};
function getStudentData() { const d = localStorage.getItem('desapaleleh_data_penduduk'); return d ? JSON.parse(d) : defaultStudentData; }
function renderStudentData() {
  const data = getStudentData();
  ['7a', '7b', '8a', '8b', '9a', '9b'].forEach(cls => {
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
  let newdata = {};
  ['7a', '7b', '8a', '8b', '9a', '9b'].forEach(cls => {
    newdata[cls] = { l: document.getElementById(`input-${cls}-l`).value, p: document.getElementById(`input-${cls}-p`).value, wali: document.getElementById(`input-${cls}-wali`).value, foto: document.getElementById(`input-${cls}-foto`).value };
  });
  localStorage.setItem('desapaleleh_data_penduduk', JSON.stringify(newdata));
  renderStudentData(); alert('Data kependudukan diperbarui!');
}
function resetStudentData() {
  if (!confirm('Kosongkan data?')) return;
  let cleared = {}; ['7a', '7b', '8a', '8b', '9a', '9b'].forEach(cls => { cleared[cls] = { l: 0, p: 0, wali: '-', foto: '' }; });
  localStorage.setItem('desapaleleh_data_penduduk', JSON.stringify(cleared));
  renderStudentData(); alert('Data dikosongkan!');
}

// LOGIN & ADMIN
function checkLoginAndOpenMenu() {
  if (localStorage.getItem('desapaleleh_admin_logged_in') === 'true') showPage('view-panel-petugas');
  else showPage('view-login-petugas');
}
function handleLogin(event) {
  event.preventDefault();
  if (document.getElementById('login-user').value === 'admin' && document.getElementById('login-pass').value === 'paleleh2026') {
    localStorage.setItem('desapaleleh_admin_logged_in', 'true');
    showPage('view-panel-petugas');
  } else { alert('Login gagal!'); }
}
function handleLogout() { localStorage.removeItem('desapaleleh_admin_logged_in'); showPage('view-beranda'); }
function switchTab(tabId) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';
  document.querySelectorAll('[id^="btn-tab-"]').forEach(b => { b.style.background = '#cbd5e1'; b.style.color = 'var(--text-dark)'; });
  const btn = document.getElementById('btn-' + tabId);
  if (btn) { btn.style.background = 'var(--primary-color)'; btn.style.color = 'white'; }
}

// VISI & MISI
const defaultVisi = "Mewujudkan Desa Paleleh yang Maju, Mandiri, Sejahtera, dan Transparan";
const defaultMisiList = ["Meningkatkan Transparansi Pelayanan Publik", "Mengoptimalkan Potensi Ekonomi Desa"];
function getVisi() { return localStorage.getItem('desapaleleh_content_visi') ?? defaultVisi; }
function getMisiList() { const d = localStorage.getItem('desapaleleh_content_misi_list'); return d ? JSON.parse(d) : defaultMisiList; }
function saveVisiOnly() { localStorage.setItem('desapaleleh_content_visi', document.getElementById('input-content-visi').value.trim()); renderVisiMisi(); alert('Visi disimpan!'); }
function tambahMisiPoin() {
  const el = document.getElementById('input-misi-poin'); if (!el.value.trim()) return;
  let list = getMisiList(); list.push(el.value.trim());
  localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(list));
  el.value = ''; renderVisiMisi(); alert('Misi ditambahkan!');
}
function hapusMisiPoin(idx) {
  let list = getMisiList(); list.splice(idx, 1);
  localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(list));
  renderVisiMisi();
}
function renderVisiMisi() {
  const v = getVisi(); const m = getMisiList();
  if (document.getElementById('display-visi')) document.getElementById('display-visi').innerText = v;
  if (document.getElementById('input-content-visi')) document.getElementById('input-content-visi').value = v;
  if (document.getElementById('admin-misi-list')) document.getElementById('admin-misi-list').innerHTML = m.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i}</span><button type="button" onclick="hapusMisiPoin(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-misi-list')) document.getElementById('display-misi-list').innerHTML = m.map((i, idx) => `<div style="background:#f8fafc; padding:12px; border-radius:8px;">${idx+1}. ${i}</div>`).join('');
}

// TUPOKSI
const defaultTupoksiList = [{ judul: 'Kepala Desa', deskripsi: 'Memimpin pemerintahan.' }];
function getTupoksiList() { const d = localStorage.getItem('desapaleleh_content_tupoksi_list'); return d ? JSON.parse(d) : defaultTupoksiList; }
function tambahTupoksiItem() {
  const j = document.getElementById('input-tupoksi-judul').value.trim(); const d = document.getElementById('input-tupoksi-deskripsi').value.trim();
  if (!j || !d) return; let list = getTupoksiList(); list.push({ judul: j, deskripsi: d });
  localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(list));
  document.getElementById('input-tupoksi-judul').value = ''; document.getElementById('input-tupoksi-deskripsi').value = '';
  renderTupoksiList(); alert('Tupoksi ditambahkan!');
}
function hapusTupoksiItem(idx) { let list = getTupoksiList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(list)); renderTupoksiList(); }
function renderTupoksiList() {
  const list = getTupoksiList();
  if (document.getElementById('admin-tupoksi-list')) document.getElementById('admin-tupoksi-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.judul}</span><button type="button" onclick="hapusTupoksiItem(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-tupoksi-list')) document.getElementById('display-tupoksi-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:15px; border-radius:8px;"><strong>${i.judul}</strong>: ${i.deskripsi}</div>`).join('');
}

// SEJARAH, STRUKTUR, KONTAK
function savePageContent(event, pageKey) { event.preventDefault(); localStorage.setItem('desapaleleh_content_' + pageKey, JSON.stringify({ text: document.getElementById('input-content-sejarah').value })); renderPageContent(); alert('Disimpan!'); }
function saveStrukturGambar(event) { event.preventDefault(); localStorage.setItem('desapaleleh_content_struktur_img', document.getElementById('input-struktur-img').value.trim()); renderPageContent(); alert('Struktur disimpan!'); }
function saveKontakData(event) {
  event.preventDefault();
  const d = { alamat: document.getElementById('input-kontak-alamat').value, telp: document.getElementById('input-kontak-telp').value, email: document.getElementById('input-kontak-email').value, maps: document.getElementById('input-kontak-maps').value };
  localStorage.setItem('desapaleleh_content_kontak', JSON.stringify(d)); renderPageContent(); alert('Kontak disimpan!');
}
function renderPageContent() {
  const s = JSON.parse(localStorage.getItem('desapaleleh_content_sejarah'));
  if (document.getElementById('display-sejarah')) document.getElementById('display-sejarah').innerHTML = s ? s.text : 'Belum ada sejarah.';
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
  }
}

// BERANDA
function saveBerandaData(event) {
  event.preventDefault();
  const d = { sambutan: document.getElementById('input-beranda-sambutan').value, banner: document.getElementById('input-beranda-banner').value, kepsek: document.getElementById('input-beranda-kepsek').value };
  localStorage.setItem('desapaleleh_content_beranda', JSON.stringify(d)); renderBerandaData(); alert('Beranda disimpan!');
}
function renderBerandaData() {
  const d = JSON.parse(localStorage.getItem('desapaleleh_content_beranda')) || { sambutan: "Selamat datang di website resmi.", banner: "", kepsek: "" };
  if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = d.sambutan;
  if (document.getElementById('display-beranda-kepsek')) document.getElementById('display-beranda-kepsek').src = d.kepsek || 'https://via.placeholder.com/150';
  if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = d.sambutan;
  if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = d.banner;
  if (document.getElementById('input-beranda-kepsek')) document.getElementById('input-beranda-kepsek').value = d.kepsek;
}

// ANGGARAN
function getAnggaranList() { const d = localStorage.getItem('desapaleleh_content_anggaran_list'); return d ? JSON.parse(d) : []; }
function tambahAnggaranItem() {
  const n = document.getElementById('input-anggaran-nama').value.trim(); const s = document.getElementById('input-anggaran-sumber').value; const j = parseFloat(document.getElementById('input-anggaran-jumlah').value);
  if (!n || isNaN(j)) return; let list = getAnggaranList(); list.push({ nama: n, sumber: s, jumlah: j });
  localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(list)); renderAnggaranData(); alert('Anggaran ditambahkan!');
}
function hapusAnggaranItem(idx) { let list = getAnggaranList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(list)); renderAnggaranData(); }
function renderAnggaranData() {
  const list = getAnggaranList(); let tADD = 0, tDDS = 0;
  list.forEach(i => { if (i.sumber === 'ADD') tADD += i.jumlah; if (i.sumber === 'DDS') tDDS += i.jumlah; });
  if (document.getElementById('display-total-add')) document.getElementById('display-total-add').innerText = 'Rp ' + tADD.toLocaleString('id-ID');
  if (document.getElementById('display-total-dds')) document.getElementById('display-total-dds').innerText = 'Rp ' + tDDS.toLocaleString('id-ID');
  if (document.getElementById('admin-anggaran-list')) document.getElementById('admin-anggaran-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.nama} - Rp ${i.jumlah}</span><button type="button" onclick="hapusAnggaranItem(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-anggaran-list')) document.getElementById('display-anggaran-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between;"><span>${i.nama}</span><strong>Rp ${i.jumlah.toLocaleString('id-ID')}</strong></div>`).join('');
}

// KEGIATAN BERANDA
function getKegiatanList() { const d = localStorage.getItem('desapaleleh_content_kegiatan_list'); return d ? JSON.parse(d) : []; }
function tambahKegiatan() {
  const j = document.getElementById('input-kegiatan-judul').value.trim(); const desc = document.getElementById('input-kegiatan-deskripsi').value.trim();
  if (!j || !desc) return; let list = getKegiatanList(); list.push({ judul: j, deskripsi: desc, foto: document.getElementById('input-kegiatan-foto').value });
  localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(list)); renderKegiatanList(); alert('Kegiatan ditambahkan!');
}
function hapusKegiatan(idx) { let list = getKegiatanList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(list)); renderKegiatanList(); }
function renderKegiatanList() {
  const list = getKegiatanList();
  if (document.getElementById('admin-kegiatan-list')) document.getElementById('admin-kegiatan-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.judul}</span><button type="button" onclick="hapusKegiatan(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-beranda-kegiatan-list')) document.getElementById('display-beranda-kegiatan-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:15px; border-radius:8px;"><h4>${i.judul}</h4><p>${i.deskripsi}</p></div>`).join('');
}

// VIDEO, SARANA, PERANGKAT, BPD, PKK
function getVideoList() { return JSON.parse(localStorage.getItem('desapaleleh_content_video_list') || '[]'); }
function tambahVideo() {
  let list = getVideoList(); list.push({ judul: document.getElementById('input-video-judul').value, url: parseYoutubeEmbedUrl(document.getElementById('input-video-url').value) });
  localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(list)); renderVideoList(); alert('Video ditambah!');
}
function hapusVideo(idx) { let list = getVideoList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(list)); renderVideoList(); }
function renderVideoList() {
  const list = getVideoList();
  if (document.getElementById('admin-video-list')) document.getElementById('admin-video-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.judul}</span><button type="button" onclick="hapusVideo(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-beranda-video-list')) document.getElementById('display-beranda-video-list').innerHTML = list.map(i => `<div style="height:200px;"><iframe src="${i.url}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe></div>`).join('');
}

function getSaranaList() { return JSON.parse(localStorage.getItem('desapaleleh_content_sarana_list') || '[]'); }
function tambahSarana() {
  let list = getSaranaList(); list.push({ nama: document.getElementById('input-sarana-nama').value, ket: document.getElementById('input-sarana-ket').value });
  localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(list)); renderSaranaList(); alert('Sarana ditambah!');
}
function hapusSarana(idx) { let list = getSaranaList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(list)); renderSaranaList(); }
function renderSaranaList() {
  const list = getSaranaList();
  if (document.getElementById('admin-sarana-list')) document.getElementById('admin-sarana-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.nama}</span><button type="button" onclick="hapusSarana(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-sarana-list')) document.getElementById('display-sarana-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:12px; border-radius:8px;"><h4>${i.nama}</h4><p>${i.ket}</p></div>`).join('');
}

function getGuruList() { return JSON.parse(localStorage.getItem('desapaleleh_content_guru_list') || '[]'); }
function tambahGuru() {
  let list = getGuruList(); list.push({ nama: document.getElementById('input-guru-nama').value, mapel: document.getElementById('input-guru-mapel').value, foto: document.getElementById('input-guru-foto').value });
  localStorage.setItem('desapaleleh_content_guru_list', JSON.stringify(list)); renderGuruList(); alert('Perangkat ditambah!');
}
function hapusGuru(idx) { let list = getGuruList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_guru_list', JSON.stringify(list)); renderGuruList(); }
function renderGuruList() {
  const list = getGuruList();
  if (document.getElementById('admin-guru-list')) document.getElementById('admin-guru-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.nama}</span><button type="button" onclick="hapusGuru(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-guru-list')) document.getElementById('display-guru-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:15px; text-align:center; border-radius:8px;"><img src="${i.foto||'https://via.placeholder.com/150'}" style="width:70px; height:70px; border-radius:50%; object-fit:cover;"><h4>${i.nama}</h4><p>${i.mapel}</p></div>`).join('');
}

function getPengurusBpdLpmList() { return JSON.parse(localStorage.getItem('desapaleleh_content_pengurus_bpd_lpm') || '[]'); }
function tambahPengurusBpdLpm() {
  let list = getPengurusBpdLpmList(); list.push({ nama: document.getElementById('input-pengurus-nama').value, lembaga: document.getElementById('input-pengurus-lembaga').value, jabatan: document.getElementById('input-pengurus-jabatan').value });
  localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(list)); renderPengurusBpdLpmList(); alert('Pengurus ditambah!');
}
function hapusPengurusBpdLpm(idx) { let list = getPengurusBpdLpmList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(list)); renderPengurusBpdLpmList(); }
function renderPengurusBpdLpmList() {
  const list = getPengurusBpdLpmList();
  if (document.getElementById('admin-pengurus-bpd-lpm-list')) document.getElementById('admin-pengurus-bpd-lpm-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:4px; background:#fff;"><span>[${i.lembaga}] ${i.nama}</span><button type="button" onclick="hapusPengurusBpdLpm(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-pengurus-bpd-lpm-list')) document.getElementById('display-pengurus-bpd-lpm-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:15px; border-radius:8px;"><strong>[${i.lembaga}] ${i.nama}</strong><br>${i.jabatan}</div>`).join('');
}

function getPramukaList() { return JSON.parse(localStorage.getItem('desapaleleh_content_pramuka_list') || '[]'); }
function tambahPramuka() {
  let list = getPramukaList(); list.push({ judul: document.getElementById('input-pramuka-judul').value, ket: document.getElementById('input-pramuka-ket').value });
  localStorage.setItem('desapaleleh_content_pramuka_list', JSON.stringify(list)); renderPramukaList(); alert('Ditambah!');
}
function hapusPramuka(idx) { let list = getPramukaList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_pramuka_list', JSON.stringify(list)); renderPramukaList(); }
function renderPramukaList() {
  const list = getPramukaList();
  if (document.getElementById('admin-pramuka-list')) document.getElementById('admin-pramuka-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.judul}</span><button type="button" onclick="hapusPramuka(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-pramuka-list')) document.getElementById('display-pramuka-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:12px; border-radius:8px;"><h4>${i.judul}</h4><p>${i.ket}</p></div>`).join('');
}

function getSilatList() { return JSON.parse(localStorage.getItem('desapaleleh_content_silat_list') || '[]'); }
function tambahSilat() {
  let list = getSilatList(); list.push({ judul: document.getElementById('input-silat-judul').value, ket: document.getElementById('input-silat-ket').value });
  localStorage.setItem('desapaleleh_content_silat_list', JSON.stringify(list)); renderSilatList(); alert('Ditambah!');
}
function hapusSilat(idx) { let list = getSilatList(); list.splice(idx, 1); localStorage.setItem('desapaleleh_content_silat_list', JSON.stringify(list)); renderSilatList(); }
function renderSilatList() {
  const list = getSilatList();
  if (document.getElementById('admin-silat-list')) document.getElementById('admin-silat-list').innerHTML = list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:5px; background:#f8fafc;"><span>${i.judul}</span><button type="button" onclick="hapusSilat(${idx})" style="background:#dc2626; color:white; border:none; padding:2px 6px; cursor:pointer;">Hapus</button></div>`).join('');
  if (document.getElementById('display-pencaksilat-list')) document.getElementById('display-pencaksilat-list').innerHTML = list.map(i => `<div style="background:#f8fafc; padding:12px; border-radius:8px;"><h4>${i.judul}</h4><p>${i.ket}</p></div>`).join('');
}

window.addEventListener('DOMContentLoaded', () => {
  renderStudentData(); renderPageContent(); renderBerandaData(); renderKegiatanList();
  renderVideoList(); renderSaranaList(); renderGuruList(); renderPramukaList();
  renderSilatList(); renderTupoksiList(); renderVisiMisi(); renderTautanList();
  renderAnggaranData(); renderPengurusBpdLpmList();
});
