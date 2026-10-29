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

// --- FUNGSI PILIH JENIS SURAT & KIRIM PERMOHONAN ---
function pilihJenisSurat(jenis) {
  showPage('view-permohonan-surat');
  const selectEl = document.getElementById('form-jenis-surat');
  if (selectEl) {
    selectEl.value = jenis;
  }
}

function kirimPermohonanSurat(event) {
  event.preventDefault();
  const jenis = document.getElementById('form-jenis-surat').value;
  const nama = document.getElementById('form-nama-pemohon').value.trim();
  const nik = document.getElementById('form-nik-pemohon').value.trim();
  const telp = document.getElementById('form-telp-pemohon').value.trim();
  const dusun = document.getElementById('form-dusun-pemohon').value;
  const keperluan = document.getElementById('form-keperluan').value.trim();
  const fileInput = document.getElementById('form-berkas-upload');

  if (!nama || !nik || !telp || !keperluan) {
    alert('Semua kolom formulir wajib diisi!');
    return;
  }

  if (fileInput.files.length === 0) {
    alert('Silakan unggah berkas persyaratan terlebih dahulu!');
    return;
  }

  alert(`Terima kasih ${nama}!\nPermohonan ${jenis} Anda telah berhasil diajukan dan akan diproses oleh Kantor Desa Paleleh. Konfirmasi selanjutnya akan dikirimkan melalui WhatsApp.`);
  event.target.reset();
  showPage('view-beranda');
}

// --- FUNGSI AKSESIBILITAS SIDEBAR & UKURAN FONT ---
function toggleAccessibilityModal() {
  const modal = document.getElementById('accessibilityModal');
  if (modal) {
    modal.classList.toggle('active');
  }
}

let currentFontScale = 1;
function changeFontSize(amount) {
  currentFontScale += amount / 100;
  if (currentFontScale < 0.8) currentFontScale = 0.8;
  if (currentFontScale > 1.6) currentFontScale = 1.6;

  document.documentElement.style.setProperty('--font-scale', currentFontScale);
  const display = document.getElementById('fontSizeDisplay');
  if (display) {
    display.innerText = Math.round(currentFontScale * 100) + '%';
  }
}

function toggleBodyClass(className, enable) {
  if (enable) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
}

// --- FUNGSI YOUTUBE EMBED ---
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

// --- KELOLA MENU TAUTAN EKSTERNAL ---
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
  const adminEl = document.getElementById('
