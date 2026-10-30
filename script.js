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

// LOGO & BERANDA
function getBerandaData() {
  const defaultData = {
    logo: 'https://i.postimg.cc/PJyqnvJX/Gemini-Generated-Image-tqris4tqris4tqri.jpg',
    banner: 'https://raw.githubusercontent.com/JhearMusik/Pemdes_Paleleh/main/Paleleh-Village-SnapYT.App.mp4',
    sambutan: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Pemerintah Desa Paleleh...",
    kades: 'https://i.postimg.cc/sxPCtknH/Gemini-Generated-Image-tnppjqtnppjqtnpp.jpg'
  };
  const data = localStorage.getItem('desapaleleh_beranda_data');
  return data ? JSON.parse(data) : defaultData;
}
function renderBerandaData() {
  const d = getBerandaData();
  if (document.getElementById('display-navbar-logo')) document.getElementById('display-navbar-logo').src = d.logo;

  const videoBg = document.getElementById('display-beranda-video-bg');
  const videoSrc = document.getElementById('display-beranda-video-src');
  if (videoSrc && d.banner) {
    videoSrc.src = d.banner;
    if (videoBg) { videoBg.load(); videoBg.play().catch(e => console.log(e)); }
  }

  if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = d.sambutan;
  if (document.getElementById('display-beranda-kepala-desa')) document.getElementById('display-beranda-kepala-desa').src = d.kades;
  if (document.getElementById('input-beranda-logo')) document.getElementById('input-beranda-logo').value = d.logo;
  if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = d.banner;
  if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = d.sambutan;
  if (document.getElementById('input-beranda-kepala-desa')) document.getElementById('input-beranda-kepala-desa').value = d.kades;
}
function saveBerandaData(event) {
  event.preventDefault();
  const logo = document.getElementById('input-beranda-logo').value.trim();
  const banner = document.getElementById('input-beranda-banner').value.trim();
  const sambutan = document.getElementById('input-beranda-sambutan').value.trim();
  const kades = document.getElementById('input-beranda-kepala-desa').value.trim();
  localStorage.setItem('desapaleleh_beranda_data', JSON.stringify({ logo, banner, sambutan, kades }));
  renderBerandaData();
  alert('Beranda & Logo berhasil disimpan!');
}

// KEGIATAN BERANDA
function getKegiatanList() { return JSON.parse(localStorage.getItem('desapaleleh_content_kegiatan_list') || '[]'); }
function tambahKegiatanItem() {
  const judul = document.getElementById('input-kegiatan-judul').value.trim();
  const foto = document.getElementById('input-kegiatan-foto').value.trim() || 'https://via.placeholder.com/300x200';
  const ket = document.getElementById('input-kegiatan-ket').value.trim();
  if(!judul || !ket) return alert('Isi data lengkap!');
  let l = getKegiatanList(); l.push({judul, foto, ket});
  localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(l));
  renderKegiatanList(); alert('Kegiatan ditambahkan!');
}
function hapusKegiatanItem(i) { if(confirm('Hapus kegiatan ini?')) { let l = getKegiatanList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_kegiatan_list', JSON.stringify(l)); renderKegiatanList(); } }
function renderKegiatanList() {
  const l = getKegiatanList();
  if(document.getElementById('admin-kegiatan-list')) {
    document.getElementById('admin-kegiatan-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.judul}</span><button onclick="hapusKegiatanItem(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  }
  if(document.getElementById('display-beranda-kegiatan-list')) {
    document.getElementById('display-beranda-kegiatan-list').innerHTML = l.length === 0 ? '<p class="text-muted">Belum ada informasi kegiatan.</p>' : l.map(item => `<div class="media-card"><div class="media-card-img"><img src="${item.foto}"></div><div class="media-card-body"><h4>${item.judul}</h4><p>${item.ket}</p></div></div>`).join('');
  }
}

// LAYANAN SURAT & PENGADUAN (DENGAN WHATSAPP)
function getPermohonanList() { return JSON.parse(localStorage.getItem('desapaleleh_permohonan_surat') || '[]'); }
function submitPermohonanSurat(event) {
  event.preventDefault();
  const nama = document.getElementById('surat-nama').value.trim();
  const nik = document.getElementById('surat-nik').value.trim();
  const whatsapp = document.getElementById('surat-whatsapp').value.trim();
  const jenis = document.getElementById('surat-jenis').value;
  const keperluan = document.getElementById('surat-keperluan').value.trim();
  const berkasInput = document.getElementById('surat-berkas');

  let namaBerkas = 'Tidak ada berkas';
  let dataUrlBerkas = '#';
  if (berkasInput.files && berkasInput.files[0]) {
    namaBerkas = berkasInput.files[0].name;
    const reader = new FileReader();
    reader.onload = function(e) {
      dataUrlBerkas = e.target.result;
      simpanDataPermohonan(nama, nik, whatsapp, jenis, keperluan, namaBerkas, dataUrlBerkas);
    };
    reader.readAsDataURL(berkasInput.files[0]);
    return;
  }
  simpanDataPermohonan(nama, nik, whatsapp, jenis, keperluan, namaBerkas, dataUrlBerkas);
}

function simpanDataPermohonan(nama, nik, whatsapp, jenis, keperluan, namaBerkas, dataUrlBerkas) {
  let list = getPermohonanList();
  const newId = 'SRT-' + Math.floor(100000 + Math.random() * 900000);
  list.push({ id: newId, nama, nik, whatsapp, jenis, keperluan, namaBerkas, dataUrlBerkas, status: 'Menunggu Verifikasi Admin' });
  localStorage.setItem('desapaleleh_permohonan_surat', JSON.stringify(list));
  alert(`Permohonan berhasil dikirim! Kode / ID Surat Anda: ${newId}\n(Simpan NIK atau ID ini untuk cek status).`);
  document.getElementById('surat-nama').value = '';
  document.getElementById('surat-nik').value = '';
  document.getElementById('surat-whatsapp').value = '';
  document.getElementById('surat-keperluan').value = '';
  document.getElementById('surat-berkas').value = '';
  renderAdminNotifikasi();
}

function cekStatusSurat() {
  const keyword = document.getElementById('cek-nik-surat').value.trim().toLowerCase();
  const list = getPermohonanList();
  const found = list.filter(item => item.nik.toLowerCase() === keyword || item.id.toLowerCase() === keyword);
  const hasilEl = document.getElementById('hasil-cek-surat');

  if (keyword === '') {
    hasilEl.innerHTML = '<p class="text-muted">Masukkan NIK atau No ID Surat terlebih dahulu.</p>';
    return;
  }

  if (found.length === 0) {
    hasilEl.innerHTML = '<p class="text-muted">Tidak ada permohonan dengan NIK atau ID tersebut.</p>';
    return;
  }

  hasilEl.innerHTML = found.map(item => `
    <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:10px;">
      <strong>ID: ${item.id}</strong> | ${item.jenis} (${item.nama})<br>
      <p style="margin: 5px 0;">Keperluan: ${item.keperluan}</p>
      Status: <span style="color: var(--accent-color); font-weight: 700;">${item.status}</span>
    </div>
  `).join('');
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
  alert(`Pengaduan berhasil dikirim! ID Pengaduan: ${newId}`);
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

// ADMIN NOTIFIKASI (DENGAN FITUR WHATSAPP OTOMATIS)
function renderAdminNotifikasi() {
  const suratList = getPermohonanList();
  const aduanList = getPengaduanList();
  if (document.getElementById('badge-notif-count')) document.getElementById('badge-notif-count').innerText = suratList.length + aduanList.length;

  const suratEl = document.getElementById('admin-list-permohonan-surat');
  if (suratEl) {
    suratEl.innerHTML = suratList.length === 0 ? '<p class="text-muted">Tidak ada surat masuk.</p>' : suratList.map((item, idx) => {
      let waNumber = item.whatsapp || '';
      // Format nomor HP agar diawali dengan 62 jika diawali angka 0
      if (waNumber.startsWith('0')) {
        waNumber = '62' + waNumber.slice(1);
      }
      const pesanSelesai = encodeURIComponent(`Halo ${item.nama}, permohonan ${item.jenis} Anda dengan ID ${item.id} telah SELESAI / SIAP. Silakan ambil atau unduh dokumen PDF dari Kantor Desa Paleleh. Terima kasih.`);
      const pesanKurang = encodeURIComponent(`Halo ${item.nama}, mohon maaf permohonan ${item.jenis} Anda dengan ID ${item.id} BELUM DAPAT DIPROSES karena berkas kurang / tidak lengkap. Mohon lengkapi persyaratan.`);

      return `
        <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
            <div>
              <strong>${item.id} - ${item.nama}</strong> (NIK: ${item.nik})<br>
              <span style="color:var(--primary-color); font-weight:600;">${item.jenis}</span> | <i class="fab fa-whatsapp" style="color:#22c55e;"></i> <strong>${item.whatsapp || 'Tidak ada'}</strong><br>
              <small>Keperluan: ${item.keperluan}</small><br>
              <small>Berkas: ${item.dataUrlBerkas && item.dataUrlBerkas !== '#' ? `<a href="${item.dataUrlBerkas}" target="_blank" download="${item.namaBerkas}" style="color:var(--accent-color); font-weight:700;"><i class="fas fa-download"></i> Download / Lihat (${item.namaBerkas})</a>` : 'Tidak ada berkas'}</small><br>
              <small>Status Saat Ini: <strong style="color:#0284c7;">${item.status}</strong></small>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px; min-width:210px;">
              <button onclick="ubahStatusSuratCustom(${idx}, 'Selesai / Siap Diambil')" class="btn-accent" style="padding:6px 12px; font-size:0.8rem;"><i class="fas fa-check"></i> Selesai / Siap</button>
              <button onclick="ubahStatusSuratCustom(${idx}, 'Berkas Tidak Lengkap / Kurang Syarat')" style="background:#dc2626; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:0.8rem; cursor:pointer; font-weight:600;"><i class="fas fa-exclamation-triangle"></i> Berkas Kurang</button>
              ${waNumber ? `<a href="https://wa.me/${waNumber}?text=${item.status.includes('Selesai') ? pesanSelesai : pesanKurang}" target="_blank" style="background:#22c55e; color:white; text-decoration:none; padding:6px 12px; border-radius:6px; font-size:0.8rem; text-align:center; font-weight:600;"><i class="fab fa-whatsapp"></i> Kirim Info WA</a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const aduanEl = document.getElementById('admin-list-pengaduan');
  if (aduanEl) {
    aduanEl.innerHTML = aduanList.length === 0 ? '<p class="text-muted">Tidak ada pengaduan masuk.</p>' : aduanList.map((item, idx) => `
      <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #cbd5e1;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
        <div><strong>${item.id} - ${item.nama}</strong> (WA: ${item.telp})<br><small>"${item.pesan}" | Status: ${item.status}</small></div>
        <button onclick="ubahStatusAduan(${idx})" class="btn-accent" style="padding:6px 12px;font-size:0.8rem;">Tindak Lanjuti</button>
      </div>
    `).join('');
  }
}

function ubahStatusSuratCustom(i, statusTujuan) {
  let l = getPermohonanList();
  if (statusTujuan.includes('Kurang')) {
    const catatan = prompt('Masukkan catatan kekurangan berkas untuk pemohon:', 'KTP / KK kurang jelas atau belum dilampirkan.');
    if (catatan === null) return;
    l[i].status = `Ditolak / Berkas Kurang: ${catatan}`;
  } else {
    l[i].status = statusTujuan;
  }
  localStorage.setItem('desapaleleh_permohonan_surat', JSON.stringify(l));
  renderAdminNotifikasi();
  alert('Status permohonan berhasil diperbarui!');
}

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

// APARAT
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
  if(document.getElementById('admin-aparat-list')) document.getElementById('admin-aparat-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama} (${item.jabatan})</span><button onclick="hapusAparat(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-aparat-list')) document.getElementById('display-aparat-list').innerHTML = l.map(item => `<div class="profile-card"><img src="${item.foto}"><h4>${item.nama}</h4><p>${item.jabatan}</p></div>`).join('');
}

// BPD & LPM
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
  if(document.getElementById('admin-pengurus-bpd-lpm-list')) document.getElementById('admin-pengurus-bpd-lpm-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>[${item.lembaga}] ${item.nama}</span><button onclick="hapusPengurusBpdLpm(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-pengurus-bpd-lpm-list')) document.getElementById('display-pengurus-bpd-lpm-list').innerHTML = l.map(item => `<div class="profile-card"><img src="${item.foto}"><span class="badge-lembaga ${item.lembaga==='BPD'?'badge-bpd':'badge-lpm'}">${item.lembaga}</span><h4>${item.nama}</h4><p>${item.jabatan}</p></div>`).join('');
}

// SARANA
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
  if(document.getElementById('admin-sarana-list')) document.getElementById('admin-sarana-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama}</span><button onclick="hapusSarana(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-sarana-list')) document.getElementById('display-sarana-list').innerHTML = l.map(item => `<div class="media-card"><div class="media-card-img"><img src="${item.foto}"></div><div class="media-card-body"><h4>${item.nama}</h4><p>${item.ket}</p></div></div>`).join('');
}

// ANGGARAN
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
  if(document.getElementById('display-total-add')) document.getElementById('display-total-add').innerText = 'Rp ' + totADD.toLocaleString('id-ID');
  if(document.getElementById('display-total-dds')) document.getElementById('display-total-dds').innerText = 'Rp ' + totDDS.toLocaleString('id-ID');
  if(document.getElementById('admin-anggaran-list')) document.getElementById('admin-anggaran-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama} (${item.sumber})</span><button onclick="hapusAnggaranItem(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-anggaran-list')) document.getElementById('display-anggaran-list').innerHTML = l.map(item => `<div class="anggaran-item-card"><div><span>${item.sumber}</span><h4>${item.nama}</h4></div><div>Rp ${item.jumlah.toLocaleString('id-ID')}</div></div>`).join('');
}

// VIDEO
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
  if(document.getElementById('admin-video-list')) document.getElementById('admin-video-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.judul}</span><button onclick="hapusVideo(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-beranda-video-list')) document.getElementById('display-beranda-video-list').innerHTML = l.map(item => `<div class="media-card"><div class="media-card-player"><iframe src="${item.url}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe></div><div class="media-card-body"><h4>${item.judul}</h4><p>${item.ket}</p></div></div>`).join('');
}

// TAUTAN
const defaultTautan = [{nama:'Portal Kab. Buol', url:'https://buolkab.go.id'}];
function getTautanList() { return JSON.parse(localStorage.getItem('desapaleleh_content_tautan_list') || JSON.stringify(defaultTautan)); }
function tambahTautanItem() {
  const nama = document.getElementById('input-tautan-nama').value.trim();
  const url = document.getElementById('input-tautan-url').value.trim();
  if(!nama || !url) return alert('Isi data!');
  let l = getTautanList(); l.push({nama, url});
  localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(l));
  renderTautanList(); alert('Tautan ditambahkan!');
}
function hapusTautanItem(i) { if(confirm('Hapus tautan ini?')) { let l = getTautanList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_tautan_list', JSON.stringify(l)); renderTautanList(); } }
function renderTautanList() {
  const l = getTautanList();
  if(document.getElementById('admin-tautan-list')) document.getElementById('admin-tautan-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.nama}</span><button onclick="hapusTautanItem(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-navbar-tautan')) document.getElementById('display-navbar-tautan').innerHTML = l.map(item => `<li><a href="${item.url}" target="_blank">${item.nama}</a></li>`).join('');
}

// SEJARAH
function renderSejarah() {
  const text = localStorage.getItem('desapaleleh_content_sejarah') || 'Sejarah Desa Paleleh belum diatur.';
  if(document.getElementById('display-sejarah')) document.getElementById('display-sejarah').innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
  if(document.getElementById('input-content-sejarah')) document.getElementById('input-content-sejarah').value = text;
}
function savePageContent(e, type) {
  e.preventDefault();
  if(type === 'sejarah') {
    const val = document.getElementById('input-content-sejarah').value;
    localStorage.setItem('desapaleleh_content_sejarah', val);
    renderSejarah();
    alert('Sejarah disimpan!');
  }
}

// VISI & MISI
function getMisiList() { return JSON.parse(localStorage.getItem('desapaleleh_content_misi_list') || '["Meningkatkan tata kelola pemerintahan desa yang transparan.", "Mengoptimalkan pelayanan publik berbasis digital."] '); }
function tambahMisiItem() {
  const val = document.getElementById('input-content-misi').value.trim();
  if(!val) return alert('Isi misi!');
  let l = getMisiList(); l.push(val);
  localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(l));
  document.getElementById('input-content-misi').value = '';
  renderVisiMisi(); alert('Misi ditambahkan!');
}
function hapusMisiItem(i) { if(confirm('Hapus misi ini?')) { let l = getMisiList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_misi_list', JSON.stringify(l)); renderVisiMisi(); } }
function renderVisiMisi() {
  const visi = localStorage.getItem('desapaleleh_content_visi') || 'Terwujudnya Desa Paleleh yang Maju, Mandiri, dan Sejahtera.';
  if(document.getElementById('display-visi')) document.getElementById('display-visi').innerText = visi;
  if(document.getElementById('input-content-visi')) document.getElementById('input-content-visi').value = visi;
  
  const m = getMisiList();
  if(document.getElementById('display-misi-list')) document.getElementById('display-misi-list').innerHTML = m.map((item, idx) => `<div class="misi-item-card"><strong>${idx+1}.</strong> ${item}</div>`).join('');
  if(document.getElementById('admin-misi-list')) document.getElementById('admin-misi-list').innerHTML = m.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${idx+1}. ${item}</span><button onclick="hapusMisiItem(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
}
function saveVisiOnly() {
  localStorage.setItem('desapaleleh_content_visi', document.getElementById('input-content-visi').value);
  renderVisiMisi();
  alert('Visi disimpan!');
}

// TUPOKSI
function getTupoksiList() { return JSON.parse(localStorage.getItem('desapaleleh_content_tupoksi_list') || '[]'); }
function tambahTupoksiItem() {
  const judul = document.getElementById('input-tupoksi-judul').value.trim();
  const deskripsi = document.getElementById('input-tupoksi-deskripsi').value.trim();
  if(!judul || !deskripsi) return alert('Isi data!');
  let l = getTupoksiList(); l.push({judul, deskripsi});
  localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(l));
  renderTupoksiList(); alert('Tupoksi ditambahkan!');
}
function hapusTupoksi(i) { if(confirm('Hapus tupoksi ini?')) { let l = getTupoksiList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_tupoksi_list', JSON.stringify(l)); renderTupoksiList(); } }
function renderTupoksiList() {
  const l = getTupoksiList();
  if(document.getElementById('admin-tupoksi-list')) document.getElementById('admin-tupoksi-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.judul}</span><button onclick="hapusTupoksi(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-tupoksi-list')) document.getElementById('display-tupoksi-list').innerHTML = l.map((item, idx) => `<div class="tupoksi-card"><div><strong>${idx+1}</strong></div><div><h4>${item.judul}</h4><p>${item.deskripsi}</p></div></div>`).join('');
}

// STRUKTUR
function renderStruktur() {
  const img = localStorage.getItem('desapaleleh_content_struktur_img') || 'https://via.placeholder.com/900x500?text=Struktur+Organisasi';
  if(document.getElementById('display-struktur-img')) document.getElementById('display-struktur-img').src = img;
  if(document.getElementById('input-struktur-img')) document.getElementById('input-struktur-img').value = img;
}
function saveStrukturGambar(e) {
  e.preventDefault();
  const val = document.getElementById('input-struktur-img').value.trim();
  localStorage.setItem('desapaleleh_content_struktur_img', val);
  renderStruktur();
  alert('Struktur disimpan!');
}

// PKK & KARANG TARUNA
function getKtPkkList() { return JSON.parse(localStorage.getItem('desapaleleh_content_ktpkk_list') || '[]'); }
function tambahKegiatanKtPkk() {
  const judul = document.getElementById('input-ktpkk-judul').value.trim();
  const foto = document.getElementById('input-ktpkk-foto').value.trim() || 'https://via.placeholder.com/300x200';
  const ket = document.getElementById('input-ktpkk-ket').value.trim();
  if(!judul || !ket) return alert('Isi data lengkap!');
  let l = getKtPkkList(); l.push({judul, foto, ket});
  localStorage.setItem('desapaleleh_content_ktpkk_list', JSON.stringify(l));
  renderKtPkkList(); alert('Kegiatan ditambahkan!');
}
function hapusKtPkk(i) { if(confirm('Hapus kegiatan ini?')) { let l = getKtPkkList(); l.splice(i,1); localStorage.setItem('desapaleleh_content_ktpkk_list', JSON.stringify(l)); renderKtPkkList(); } }
function renderKtPkkList() {
  const l = getKtPkkList();
  if(document.getElementById('admin-ktpkk-list')) document.getElementById('admin-ktpkk-list').innerHTML = l.map((item, idx) => `<div style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>${item.judul}</span><button onclick="hapusKtPkk(${idx})" class="btn-danger-sm">Hapus</button></div>`).join('');
  if(document.getElementById('display-karangtaruna-pkk-list')) document.getElementById('display-karangtaruna-pkk-list').innerHTML = l.length === 0 ? '<p class="text-muted">Belum ada kegiatan.</p>' : l.map(item => `<div class="media-card"><div class="media-card-img"><img src="${item.foto}"></div><div class="media-card-body"><h4>${item.judul}</h4><p>${item.ket}</p></div></div>`).join('');
}

// KONTAK LENGKAP
function getKontakData() {
  const def = {
    alamat: 'Jln. Trans Sulawesi, Desa Paleleh, Kabupaten Buol',
    telp: '+62 822-0000-0000',
    email: 'desapaleleh@buolkab.go.id',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.814!2d121.3!3d0.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDgnNDguMCJOIDEyMcKwMTgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid'
  };
  const data = localStorage.getItem('desapaleleh_kontak_data');
  return data ? JSON.parse(data) : def;
}
function renderKontakData() {
  const k = getKontakData();
  if(document.getElementById('display-kontak-alamat')) document.getElementById('display-kontak-alamat').innerText = k.alamat;
  if(document.getElementById('display-kontak-telp')) document.getElementById('display-kontak-telp').innerText = k.telp;
  if(document.getElementById('display-kontak-email')) document.getElementById('display-kontak-email').innerText = k.email;
  if(document.getElementById('display-kontak-maps')) document.getElementById('display-kontak-maps').src = k.maps;

  if(document.getElementById('input-kontak-alamat')) document.getElementById('input-kontak-alamat').value = k.alamat;
  if(document.getElementById('input-kontak-telp')) document.getElementById('input-kontak-telp').value = k.telp;
  if(document.getElementById('input-kontak-email')) document.getElementById('input-kontak-email').value = k.email;
  if(document.getElementById('input-kontak-maps')) document.getElementById('input-kontak-maps').value = k.maps;
}
function saveKontakData(e) {
  e.preventDefault();
  const alamat = document.getElementById('input-kontak-alamat').value.trim();
  const telp = document.getElementById('input-kontak-telp').value.trim();
  const email = document.getElementById('input-kontak-email').value.trim();
  const maps = document.getElementById('input-kontak-maps').value.trim();
  localStorage.setItem('desapaleleh_kontak_data', JSON.stringify({alamat, telp, email, maps}));
  renderKontakData();
  alert('Kontak dan lokasi berhasil disimpan!');
}

// Inisialisasi Saat Halaman Dimuat
window.addEventListener('DOMContentLoaded', () => {
  renderBerandaData();
  renderKegiatanList();
  renderPendudukData();
  renderAparatList();
  renderPengurusBpdLpmList();
  renderSaranaList();
  renderAnggaranData();
  renderVideoList();
  renderTautanList();
  renderSejarah();
  renderVisiMisi();
  renderTupoksiList();
  renderStruktur();
  renderKtPkkList();
  renderKontakData();
  renderAdminNotifikasi();
});
