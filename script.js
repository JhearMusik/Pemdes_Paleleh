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

// VALIDASI UKURAN BERKAS 5MB
function validateFileSize(input) {
  if (input.files && input.files[0]) {
    const fileSize = input.files[0].size / 1024 / 1024; // MB
    if (fileSize > 5) {
      alert('Ukuran berkas terlalu besar! Maksimal 5MB.');
      input.value = '';
    }
  }
}

// --- LAYANAN SURAT & PENGADUAN ---
function getPermohonanList() {
  const data = localStorage.getItem('desapaleleh_permohonan_surat');
  return data ? JSON.parse(data) : [];
}

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

  alert(`Permohonan berhasil dikirim! Kode/ID Permohonan Anda: ${newId}`);
  document.getElementById('surat-nama').value = '';
  document.getElementById('surat-nik').value = '';
  document.getElementById('surat-keperluan').value = '';
  document.getElementById('surat-berkas').value = '';
  renderAdminNotifikasi();
}

function cekStatusSurat() {
  const nik = document.getElementById('cek-nik-surat').value.trim();
  const list = getPermohonanList();
  const found = list.filter(item => item.nik === nik);
  const hasilEl = document.getElementById('hasil-cek-surat');

  if (found.length === 0) {
    hasilEl.innerHTML = '<p class="text-muted">Tidak ada permohonan dengan NIK tersebut.</p>';
    return;
  }

  hasilEl.innerHTML = found.map(item => `
    <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 8px;">
      <strong>ID: ${item.id}</strong> | ${item.jenis}<br>
      Status: <span style="color: var(--accent-color); font-weight: 700;">${item.status}</span>
    </div>
  `).join('');
}

function getPengaduanList() {
  const data = localStorage.getItem('desapaleleh_pengaduan_list');
  return data ? JSON.parse(data) : [];
}

function submitPengaduan(event) {
  event.preventDefault();
  const nama = document.getElementById('aduan-nama').value.trim();
  const telp = document.getElementById('aduan-telp').value.trim();
  const pesan = document.getElementById('aduan-pesan').value.trim();

  let list = getPengaduanList();
  const newId = 'ADU-' + Math.floor(100000 + Math.random() * 900000);
  list.push({ id: newId, nama, telp, pesan, status: 'Menunggu Ditindaklanjuti' });
  localStorage.setItem('desapaleleh_pengaduan_list', JSON.stringify(list));

  alert(`Pengaduan berhasil dikirim! ID Pengaduan: ${newId}`);
  document.getElementById('aduan-nama').value = '';
  document.getElementById('aduan-telp').value = '';
  document.getElementById('aduan-pesan').value = '';
  renderAdminNotifikasi();
}

function cekStatusAduan() {
  const nama = document.getElementById('cek-nama-aduan').value.trim().toLowerCase();
  const list = getPengaduanList();
  const found = list.filter(item => item.nama.toLowerCase().includes(nama));
  const hasilEl = document.getElementById('hasil-cek-aduan');

  if (found.length === 0) {
    hasilEl.innerHTML = '<p class="text-muted">Tidak ditemukan pengaduan dengan nama tersebut.</p>';
    return;
  }

  hasilEl.innerHTML = found.map(item => `
    <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 8px;">
      <strong>ID: ${item.id}</strong> - ${item.nama}<br>
      Pesan: "${item.pesan}"<br>
      Status: <span style="color: #059669; font-weight: 700;">${item.status}</span>
    </div>
  `).join('');
}

// --- JUMLAH PENDUDUK TOTAL ---
const defaultPenduduk = { total: 1250, l: 640, p: 610 };
function getPendudukData() {
  const data = localStorage.getItem('desapaleleh_jumlah_penduduk');
  return data ? JSON.parse(data) : defaultPenduduk;
}

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
  const data = { l, p, total: Number(l) + Number(p) };
  localStorage.setItem('desapaleleh_jumlah_penduduk', JSON.stringify(data));
  renderPendudukData();
  alert('Data jumlah penduduk berhasil diperbarui!');
}

// --- ADMIN NOTIFIKASI ---
function renderAdminNotifikasi() {
  const suratList = getPermohonanList();
  const aduanList = getPengaduanList();
  const totalNotif = suratList.length + aduanList.length;

  const badge = document.getElementById('badge-notif-count');
  if (badge) badge.innerText = totalNotif;

  const suratEl = document.getElementById('admin-list-permohonan-surat');
  if (suratEl) {
    suratEl.innerHTML = suratList.length === 0 ? '<p class="text-muted">Belum ada permohonan surat masuk.</p>' : suratList.map((item, idx) => `
      <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${item.id} - ${item.nama}</strong> (${item.jenis})<br><small>Keperluan: ${item.keperluan} | Status: ${item.status}</small></div>
        <button onclick="ubahStatusSurat(${idx})" class="btn-accent" style="font-size:0.8rem; padding:6px 12px;">Selesaikan</button>
      </div>
    `).join('');
  }

  const aduanEl = document.getElementById('admin-list-pengaduan');
  if (aduanEl) {
    aduanEl.innerHTML = aduanList.length === 0 ? '<p class="text-muted">Belum ada pengaduan masuk.</p>' : aduanList.map((item, idx) => `
      <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${item.id} - ${item.nama}</strong> (${item.telp})<br><small>"${item.pesan}" | Status: ${item.status}</small></div>
        <button onclick="ubahStatusAduan(${idx})" class="btn-accent" style="font-size:0.8rem; padding:6px 12px;">Tandai Selesai</button>
      </div>
    `).join('');
  }
}

function ubahStatusSurat(index) {
  let list = getPermohonanList();
  list[index].status = 'Selesai / Siap Diambil';
  localStorage.setItem('desapaleleh_permohonan_surat', JSON.stringify(list));
  renderAdminNotifikasi();
}

function ubahStatusAduan(index) {
  let list = getPengaduanList();
  list[index].status = 'Telah Ditindaklanjuti';
  localStorage.setItem('desapaleleh_pengaduan_list', JSON.stringify(list));
  renderAdminNotifikasi();
}

// --- 3. LOGIN & KONTROL ADMIN DESA ---
function checkLoginAndOpenMenu() {
  const isAuth = localStorage.getItem('desapaleleh_admin_logged_in');
  if (isAuth === 'true') { showPage('view-panel-petugas'); renderAdminNotifikasi(); }
  else { showPage('view-login-petugas'); }
}

function handleLogin(event) {
  event.preventDefault();
  if (document.getElementById('login-user').value === 'admin' && document.getElementById('login-pass').value === 'paleleh2026') {
    localStorage.setItem('desapaleleh_admin_logged_in', 'true');
    showPage('view-panel-petugas');
    renderAdminNotifikasi();
  } else { alert('Username atau Password salah!'); }
}

function handleLogout() {
  localStorage.removeItem('desapaleleh_admin_logged_in');
  showPage('view-beranda');
}

function switchTab(tabId) {
  document.querySelectorAll('.admin-tab-content').forEach(tab => tab.style.display = 'none');
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) activeBtn.classList.add('active');
}

// --- FUNGSI KELOLA DATA & TOMBOL HAPUS (APARAT, BPD, SARANA, ANGGARAN, VIDEO) ---
function getAparatList() { return JSON.parse(localStorage.getItem('desapaleleh_content_aparat_list') || '[]'); }
function tambahAparat() {
  const nama = document.getElementById('input-aparat-nama').value.trim();
  const jabatan = document.getElementById('input-aparat-jabatan').value.trim();
  const foto = document.getElementById('input-aparat-foto').value.trim() || 'https://via.placeholder.com/150';
  if (!nama || !jabatan) return alert('Nama dan Jabatan wajib diisi!');
  let list = getAparatList(); list.push({ nama, jabatan, foto });
  localStorage.setItem('desapaleleh_content_aparat_list', JSON.stringify(list));
  renderAparatList(); alert('Aparat ditambahkan!');
}
function hapusAparat(i) { if(confirm('Hapus aparat ini?')) { let l = getAparatList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_aparat_list', JSON.stringify(l)); renderAparatList(); } }
function renderAparatList() {
  const list = getAparatList();
  document.getElementById('admin-aparat-list').innerHTML = list.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama} (${item.jabatan})</span><button onclick="hapusAparat(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-aparat-list').innerHTML = list.map(item => `<div class="profile-card"><img src="${item.foto}"><h4>${item.nama}</h4><p>${item.jabatan}</p></div>`).join('');
}

function getPengurusBpdLpmList() { return JSON.parse(localStorage.getItem('desapaleleh_content_pengurus_bpd_lpm') || '[]'); }
function tambahPengurusBpdLpm() {
  const nama = document.getElementById('input-pengurus-nama').value.trim();
  const lembaga = document.getElementById('input-pengurus-lembaga').value;
  const jabatan = document.getElementById('input-pengurus-jabatan').value.trim();
  const foto = document.getElementById('input-pengurus-foto').value.trim() || 'https://via.placeholder.com/150';
  if (!nama || !jabatan) return alert('Isi data lengkap!');
  let list = getPengurusBpdLpmList(); list.push({ nama, lembaga, jabatan, foto });
  localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(list));
  renderPengurusBpdLpmList(); alert('Pengurus BPD/LPM ditambahkan!');
}
function hapusPengurusBpdLpm(i) { if(confirm('Hapus pengurus ini?')) { let l = getPengurusBpdLpmList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_pengurus_bpd_lpm', JSON.stringify(l)); renderPengurusBpdLpmList(); } }
function renderPengurusBpdLpmList() {
  const list = getPengurusBpdLpmList();
  document.getElementById('admin-pengurus-bpd-lpm-list').innerHTML = list.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>[${item.lembaga}] ${item.nama} - ${item.jabatan}</span><button onclick="hapusPengurusBpdLpm(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-pengurus-bpd-lpm-list').innerHTML = list.map(item => `<div class="profile-card"><img src="${item.foto}"><span class="badge-lembaga ${item.lembaga==='BPD'?'badge-bpd':'badge-lpm'}">${item.lembaga}</span><h4>${item.nama}</h4><p>${item.jabatan}</p></div>`).join('');
}

function getSaranaList() { return JSON.parse(localStorage.getItem('desapaleleh_content_sarana_list') || '[]'); }
function tambahSarana() {
  const nama = document.getElementById('input-sarana-nama').value.trim();
  const foto = document.getElementById('input-sarana-foto').value.trim() || 'https://via.placeholder.com/300x200';
  const ket = document.getElementById('input-sarana-ket').value.trim();
  if(!nama || !ket) return alert('Isi data lengkap!');
  let list = getSaranaList(); list.push({nama, foto, ket});
  localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(list));
  renderSaranaList(); alert('Fasilitas ditambahkan!');
}
function hapusSarana(i) { if(confirm('Hapus fasilitas ini?')) { let l = getSaranaList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_sarana_list', JSON.stringify(l)); renderSaranaList(); } }
function renderSaranaList() {
  const list = getSaranaList();
  document.getElementById('admin-sarana-list').innerHTML = list.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama}</span><button onclick="hapusSarana(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-sarana-list').innerHTML = list.map(item => `<div class="media-card"><div class="media-card-img"><img src="${item.foto}"></div><div class="media-card-body"><h4>${item.nama}</h4><p>${item.ket}</p></div></div>`).join('');
}

function getAnggaranList() { return JSON.parse(localStorage.getItem('desapaleleh_content_anggaran_list') || '[]'); }
function tambahAnggaranItem() {
  const nama = document.getElementById('input-anggaran-nama').value.trim();
  const sumber = document.getElementById('input-anggaran-sumber').value;
  const jumlah = parseFloat(document.getElementById('input-anggaran-jumlah').value);
  if(!nama || isNaN(jumlah)) return alert('Isi data valid!');
  let list = getAnggaranList(); list.push({nama, sumber, jumlah});
  localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(list));
  renderAnggaranData(); alert('Anggaran ditambahkan!');
}
function hapusAnggaranItem(i) { if(confirm('Hapus anggaran ini?')) { let l = getAnggaranList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_anggaran_list', JSON.stringify(l)); renderAnggaranData(); } }
function renderAnggaranData() {
  const list = getAnggaranList();
  let totADD = 0, totDDS = 0;
  list.forEach(i => { if(i.sumber==='ADD') totADD+=i.jumlah; if(i.sumber==='DDS') totDDS+=i.jumlah; });
  document.getElementById('display-total-add').innerText = 'Rp ' + totADD.toLocaleString('id-ID');
  document.getElementById('display-total-dds').innerText = 'Rp ' + totDDS.toLocaleString('id-ID');
  document.getElementById('admin-anggaran-list').innerHTML = list.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama} (${item.sumber}: Rp ${item.jumlah.toLocaleString('id-ID')})</span><button onclick="hapusAnggaranItem(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-anggaran-list').innerHTML = list.map(item => `<div class="anggaran-item-card"><div><span style="background:${item.sumber==='ADD'?'#0284c7':'#059669'};color:white;padding:2px 6px;border-radius:4px;font-size:0.75rem;">${item.sumber}</span><h4 style="color:var(--primary-color);margin-top:4px;">${item.nama}</h4></div><div style="font-weight:800;color:#047857;">Rp ${item.jumlah.toLocaleString('id-ID')}</div></div>`).join('');
}

function getVideoList() { return JSON.parse(localStorage.getItem('desapaleleh_content_video_list') || '[]'); }
function tambahVideo() {
  const judul = document.getElementById('input-video-judul').value.trim();
  const url = parseYoutubeEmbedUrl(document.getElementById('input-video-url').value.trim());
  const ket = document.getElementById('input-video-ket').value.trim();
  if(!judul || !url) return alert('Isi data lengkap!');
  let list = getVideoList(); list.push({judul, url, ket});
  localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(list));
  renderVideoList(); alert('Video ditambahkan!');
}
function hapusVideo(i) { if(confirm('Hapus video ini?')) { let l = getVideoList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_video_list', JSON.stringify(l)); renderVideoList(); } }
function renderVideoList() {
  const list = getVideoList();
  document.getElementById('admin-video-list').innerHTML = list.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.judul}</span><button onclick="hapusVideo(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  document.getElementById('display-beranda-video-list').innerHTML = list.map(item => `<div class="media-card"><div class="media-card-player"><iframe src="${item.url}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe></div><div class="media-card-body"><h4>${item.judul}</h4><p>${item.ket}</p></div></div>`).join('');
}

// Inisialisasi awal
window.addEventListener('DOMContentLoaded', () => {
  renderPendudukData();
  renderAparatList();
  renderPengurusBpdLpmList();
  renderSaranaList();
  renderAnggaranData();
  renderVideoList();
  renderAdminNotifikasi();
});
