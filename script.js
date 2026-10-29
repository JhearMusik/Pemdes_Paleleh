function showPage(pageId) {
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => { v.style.display = 'none'; v.classList.remove('active-view'); });
  const target = document.getElementById(pageId);
  if (target) { target.style.display = 'block'; target.classList.add('active-view'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
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

function parseYoutubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('youtube.com/watch')) videoId = new URLSearchParams(url.split('?')[1]).get('v');
  else if (url.includes('youtube.com/embed/')) videoId = url.split('youtube.com/embed/')[1].split('?')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function validateFileSize(input) {
  if (input.files && input.files[0]) {
    if (input.files[0].size / 1024 / 1024 > 5) {
      alert('Ukuran berkas terlalu besar! Maksimal 5MB.');
      input.value = '';
    }
  }
}

// LAYANAN SURAT & PENGADUAN
function getPermohonanList() { return JSON.parse(localStorage.getItem('desapaleleh_permohonan_surat') || '[]'); }
function submitPermohonanSurat(event) {
  event.preventDefault();
  const nama = document.getElementById('surat-nama').value.trim();
  const nik = document.getElementById('surat-nik').value.trim();
  const jenis = document.getElementById('surat-jenis').value;
  const keperluan = document.getElementById('surat-keperluan').value.trim();

  let list = getPermohonanList();
  const newId = 'SRT-' + Math.floor(100000 + Math.random() * 900000);
  list.push({ id: newId, nama, nik, jenis, keperluan, status: 'Menunggu Verifikasi Admin' });
  localStorage.setItem('desapaleleh_permohonan_surat', JSON.stringify(list));
  alert(`Permohonan berhasil dikirim! Kode ID: ${newId}`);
  event.target.reset();
  renderAdminNotifikasi();
}

function cekStatusSurat() {
  const nik = document.getElementById('cek-nik-surat').value.trim();
  const list = getPermohonanList();
  const found = list.filter(item => item.nik === nik);
  const hasilEl = document.getElementById('hasil-cek-surat');
  if (found.length === 0) { hasilEl.innerHTML = '<p class="text-muted">Tidak ada permohonan.</p>'; return; }
  hasilEl.innerHTML = found.map(item => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;"><strong>ID: ${item.id}</strong> | ${item.jenis}<br>Status: <span style="color:var(--accent-color);font-weight:700;">${item.status}</span></div>`).join('');
}

function getPengaduanList() { return JSON.parse(localStorage.getItem('desapaleleh_pengaduan_list') || '[]'); }
function submitPengaduan(event) {
  event.preventDefault();
  const nama = document.getElementById('aduan-nama').value.trim();
  const telp = document.getElementById('aduan-telp').value.trim();
  const pesan = document.getElementById('aduan-pesan').value.trim();

  let list = getPengaduanList();
  const newId = 'ADU-' + Math.floor(100000 + Math.random() * 900000);
  list.push({ id: newId, nama, telp, pesan, status: 'Menunggu Ditindaklanjuti' });
  localStorage.setItem('desapaleleh_pengaduan_list', JSON.stringify(list));
  alert(`Pengaduan berhasil dikirim! ID: ${newId}`);
  event.target.reset();
  renderAdminNotifikasi();
}

function cekStatusAduan() {
  const nama = document.getElementById('cek-nama-aduan').value.trim().toLowerCase();
  const list = getPengaduanList();
  const found = list.filter(item => item.nama.toLowerCase().includes(nama));
  const hasilEl = document.getElementById('hasil-cek-aduan');
  if (found.length === 0) { hasilEl.innerHTML = '<p class="text-muted">Tidak ditemukan.</p>'; return; }
  hasilEl.innerHTML = found.map(item => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;"><strong>ID: ${item.id}</strong> - ${item.nama}<br>Status: <span style="color:#059669;font-weight:700;">${item.status}</span></div>`).join('');
}

// JUMLAH PENDUDUK
const defaultPenduduk = { l: 640, p: 610 };
function getPendudukData() { return JSON.parse(localStorage.getItem('desapaleleh_jumlah_penduduk') || JSON.stringify(defaultPenduduk)); }
function renderPendudukData() {
  const dta = getPendudukData();
  if (document.getElementById('display-penduduk-total')) document.getElementById('display-penduduk-total').innerText = Number(dta.l) + Number(dta.p);
  if (document.getElementById('display-penduduk-l')) document.getElementById('display-penduduk-l').innerText = dta.l;
  if (document.getElementById('display-penduduk-p')) document.getElementById('display-penduduk-p').innerText = dta.p;
  if (document.getElementById('input-penduduk-l')) document.getElementById('input-penduduk-l').value = dta.l;
  if (document.getElementById('input-penduduk-p')) document.getElementById('input-penduduk-p').value = dta.p;
}
function saveTotalPenduduk(event) {
  event.preventDefault();
  const l = document.getElementById('input-penduduk-l').value;
  const p = document.getElementById('input-penduduk-p').value;
  localStorage.setItem('desapaleleh_jumlah_penduduk', JSON.stringify({ l, p }));
  renderPendudukData();
  alert('Data penduduk disimpan!');
}

// ADMIN NOTIFIKASI
function renderAdminNotifikasi() {
  const suratList = getPermohonanList();
  const aduanList = getPengaduanList();
  if (document.getElementById('badge-notif-count')) document.getElementById('badge-notif-count').innerText = suratList.length + aduanList.length;

  const suratEl = document.getElementById('admin-list-permohonan-surat');
  if (suratEl) {
    suratEl.innerHTML = suratList.length === 0 ? '<p class="text-muted">Tidak ada surat masuk.</p>' : suratList.map((item, idx) => `
      <div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
        <div><strong>${item.id} - ${item.nama}</strong> (${item.jenis})<br><small>Status: ${item.status}</small></div>
        <button onclick="ubahStatusSurat(${idx})" class="btn-accent" style="padding:4px 10px;font-size:0.8rem;">Selesai</button>
      </div>
    `).join('');
  }

  const aduanEl = document.getElementById('admin-list-pengaduan');
  if (aduanEl) {
    aduanEl.innerHTML = aduanList.length === 0 ? '<p class="text-muted">Tidak ada pengaduan masuk.</p>' : aduanList.map((item, idx) => `
      <div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
        <div><strong>${item.id} - ${item.nama}</strong><br><small>"${item.pesan}" | Status: ${item.status}</small></div>
        <button onclick="ubahStatusAduan(${idx})" class="btn-accent" style="padding:4px 10px;font-size:0.8rem;">Tindak Lanjuti</button>
      </div>
    `).join('');
  }
}

function ubahStatusSurat(i) { let l = getPermohonanList(); l[i].status = 'Selesai / Siap Diambil'; localStorage.setItem('desapaleleh_permohonan_surat', JSON.stringify(l)); renderAdminNotifikasi(); }
function ubahStatusAduan(i) { let l = getPengaduanList(); l[i].status = 'Telah Ditindaklanjuti'; localStorage.setItem('desapaleleh_pengaduan_list', JSON.stringify(l)); renderAdminNotifikasi(); }

// LOGIN / LOGOUT
function checkLoginAndOpenMenu() {
  if (localStorage.getItem('desapaleleh_admin_logged_in') === 'true') { showPage('view-panel-petugas'); renderAdminNotifikasi(); }
  else { showPage('view-login-petugas'); }
}
function handleLogin(event) {
  event.preventDefault();
  if (document.getElementById('login-user').value === 'admin' && document.getElementById('login-pass').value === 'paleleh2026') {
    localStorage.setItem('desapaleleh_admin_logged_in', 'true');
    showPage('view-panel-petugas');
    renderAdminNotifikasi();
  } else { alert('Login Gagal!'); }
}
function handleLogout() { localStorage.removeItem('desapaleleh_admin_logged_in'); showPage('view-beranda'); }
function switchTab(tabId) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('btn-' + tabId);
  if (btn) btn.classList.add('active');
}

// KELOLA DATA & TOMBOL HAPUS
function getAparatList() { return JSON.parse(localStorage.getItem('desapaleleh_content_aparat_list') || '[]'); }
function tambahAparat() {
  const nama = document.getElementById('input-aparat-nama').value.trim();
  const jabatan = document.getElementById('input-aparat-jabatan').value.trim();
  const foto = document.getElementById('input-aparat-foto').value.trim() || 'https://via.placeholder.com/150';
  if(!nama || !jabatan) return alert('Isi data!');
  let l = getAparatList(); l.push({nama, jabatan, foto});
  localStorage.setItem('desapaleleh_content_aparat_list', JSON.stringify(l));
  renderAparatList(); alert('Ditambahkan!');
}
function hapusAparat(i) { if(confirm('Hapus?')) { let l = getAparatList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_aparat_list', JSON.stringify(l)); renderAparatList(); } }
function renderAparatList() {
  const l = getAparatList();
  document.getElementById('admin-aparat-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama} (${item.jabatan})</span><button onclick="hapusAparat(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-aparat-list').innerHTML = l.map(item => `<div class="profile-card"><img src="${item.foto}"><h4>${item.nama}</h4><p>${item.jabatan}</p></div>`).join('');
}

function getPengurusBpdLpmList() { return JSON.parse(localStorage.getItem('desapaleleh_content_pengurus_bpd_lpm') || '[]'); }
function tambahPengurusBpdLpm() {
  const nama = document.getElementById('input-pengurus-nama').value.trim();
  const lembaga = document.getElementById('input-pengurus-lembaga').value;
  const jabatan = document.getElementById('input-pengurus-jabatan').value.trim();
  const foto = document.getElementById('input-pengurus-foto').value.trim() || 'https://via.placeholder.com/150';
  if(!nama || !jabatan) return alert('Isi data!');
  let l = getPengurusBpdLpmList(); l.push({nama, lembaga, jabatan, foto});
  localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(l));
  renderPengurusBpdLpmList(); alert('Ditambahkan!');
}
function hapusPengurusBpdLpm(i) { if(confirm('Hapus?')) { let l = getPengurusBpdLpmList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(l)); renderPengurusBpdLpmList(); } }
function renderPengurusBpdLpmList() {
  const l = getPengurusBpdLpmList();
  document.getElementById('admin-pengurus-bpd-lpm-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>[${item.lembaga}] ${item.nama}</span><button onclick="hapusPengurusBpdLpm(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-pengurus-bpd-lpm-list').innerHTML = l.map(item => `<div class="profile-card"><img src="${item.foto}"><span class="badge-lembaga ${item.lembaga==='BPD'?'badge-bpd':'badge-lpm'}">${item.lembaga}</span><h4>${item.nama}</h4><p>${item.jabatan}</p></div>`).join('');
}

function getSaranaList() { return JSON.parse(localStorage.getItem('desapaleleh_content_sarana_list') || '[]'); }
function tambahSarana() {
  const nama = document.getElementById('input-sarana-nama').value.trim();
  const foto = document.getElementById('input-sarana-foto').value.trim() || 'https://via.placeholder.com/300x200';
  const ket = document.getElementById('input-sarana-ket').value.trim();
  if(!nama || !ket) return alert('Isi data!');
  let l = getSaranaList(); l.push({nama, foto, ket});
  localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(l));
  renderSaranaList(); alert('Ditambahkan!');
}
function hapusSarana(i) { if(confirm('Hapus?')) { let l = getSaranaList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(l)); renderSaranaList(); } }
function renderSaranaList() {
  const l = getSaranaList();
  document.getElementById('admin-sarana-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama}</span><button onclick="hapusSarana(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-sarana-list').innerHTML = l.map(item => `<div class="media-card"><div class="media-card-img"><img src="${item.foto}"></div><div class="media-card-body"><h4>${item.nama}</h4><p>${item.ket}</p></div></div>`).join('');
}

function getAnggaranList() { return JSON.parse(localStorage.getItem('desapaleleh_content_anggaran_list') || '[]'); }
function tambahAnggaranItem() {
  const nama = document.getElementById('input-anggaran-nama').value.trim();
  const sumber = document.getElementById('input-anggaran-sumber').value;
  const jumlah = parseFloat(document.getElementById('input-anggaran-jumlah').value);
  if(!nama || isNaN(jumlah)) return alert('Isi data!');
  let l = getAnggaranList(); l.push({nama, sumber, jumlah});
  localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(l));
  renderAnggaranData(); alert('Ditambahkan!');
}
function hapusAnggaranItem(i) { if(confirm('Hapus?')) { let l = getAnggaranList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(l)); renderAnggaranData(); } }
function renderAnggaranData() {
  const l = getAnggaranList();
  let totADD = 0, totDDS = 0;
  l.forEach(i => { if(i.sumber==='ADD') totADD+=i.jumlah; if(i.sumber==='DDS') totDDS+=i.jumlah; });
  document.getElementById('display-total-add').innerText = 'Rp ' + totADD.toLocaleString('id-ID');
  document.getElementById('display-total-dds').innerText = 'Rp ' + totDDS.toLocaleString('id-ID');
  document.getElementById('admin-anggaran-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama} (${item.sumber})</span><button onclick="hapusAnggaranItem(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-anggaran-list').innerHTML = l.map(item => `<div class="anggaran-item-card"><div><span>${item.sumber}</span><h4>${item.nama}</h4></div><div>Rp ${item.jumlah.toLocaleString('id-ID')}</div></div>`).join('');
}

function getVideoList() { return JSON.parse(localStorage.getItem('desapaleleh_content_video_list') || '[]'); }
function tambahVideo() {
  const judul = document.getElementById('input-video-judul').value.trim();
  const url = parseYoutubeEmbedUrl(document.getElementById('input-video-url').value.trim());
  const ket = document.getElementById('input-video-ket').value.trim();
  if(!judul || !url) return alert('Isi data!');
  let l = getVideoList(); l.push({judul, url, ket});
  localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(l));
  renderVideoList(); alert('Ditambahkan!');
}
function hapusVideo(i) { if(confirm('Hapus?')) { let l = getVideoList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(l)); renderVideoList(); } }
function renderVideoList() {
  const l = getVideoList();
  document.getElementById('admin-video-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.judul}</span><button onclick="hapusVideo(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-beranda-video-list').innerHTML = l.map(item => `<div class="media-card"><div class="media-card-player"><iframe src="${item.url}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe></div><div class="media-card-body"><h4>${item.judul}</h4><p>${item.ket}</p></div></div>`).join('');
}

// TAUTAN
const defaultTautan = [{nama:'Portal Kab. Buol', url:'https://buolkab.go.id'}];
function getTautanList() { return JSON.parse(localStorage.getItem('desapaleleh_content_tautan_list') || JSON.stringify(defaultTautan)); }
function tambahTautanItem() {
  const nama = document.getElementById('input-tautan-nama').value.trim();
  const url = document.getElementById('input-tautan-url').value.trim();
  if(!nama || !url) return;
  let l = getTautanList(); l.push({nama, url});
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(l));
  renderTautanList();
}
function hapusTautanItem(i) { let l = getTautanList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(l)); renderTautanList(); }
function renderTautanList() {
  const l = getTautanList();
  document.getElementById('admin-tautan-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama}</span><button onclick="hapusTautanItem(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-navbar-tautan').innerHTML = l.map(item => `<li><a href="${item.url}" target="_blank">${item.nama}</a></li>`).join('');
}

// MISI
function getMisiList() { return JSON.parse(localStorage.getItem('desapaleleh_content_misi_list') || '[]'); }
function renderVisiMisi() {
  document.getElementById('display-visi').innerText = localStorage.getItem('desapaleleh_content_visi') || 'Visi belum diatur';
  const m = getMisiList();
  document.getElementById('display-misi-list').innerHTML = m.map((item, idx) => `<div class="misi-item-card"><strong>${idx+1}</strong> ${item}</div>`).join('');
}
function saveVisiOnly() { localStorage.setItem('desapaleleh_content_visi', document.getElementById('input-content-visi').value); renderVisiMisi(); alert('Visi disimpan!'); }

// TUPOKSI
function getTupoksiList() { return JSON.parse(localStorage.getItem('desapaleleh_content_tupoksi_list') || '[]'); }
function tambahTupoksiItem() {
  const judul = document.getElementById('input-tupoksi-judul').value;
  const deskripsi = document.getElementById('input-tupoksi-deskripsi').value;
  let l = getTupoksiList(); l.push({judul, deskripsi});
  localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(l));
  renderTupoksiList();
}
function renderTupoksiList() {
  const l = getTupoksiList();
  document.getElementById('admin-tupoksi-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.judul}</span><button onclick="hapusTupoksi(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-tupoksi-list').innerHTML = l.map((item, idx) => `<div class="tupoksi-card"><div><strong>${idx+1}</strong></div><div><h4>${item.judul}</h4><p>${item.deskripsi}</p></div></div>`).join('');
}
function hapusTupoksi(i) { let l = getTupoksiList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(l)); renderTupoksiList(); }

window.addEventListener('DOMContentLoaded', () => {
  renderPendudukData();
  renderAparatList();
  renderPengurusBpdLpmList();
  renderSaranaList();
  renderAnggaranData();
  renderVideoList();
  renderTautanList();
  renderVisiMisi();
  renderTupoksiList();
  renderAdminNotifikasi();
});
