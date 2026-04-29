// 1. Update Jam Real-time
function updateClock() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} WIB`;
}
updateClock();
setInterval(updateClock, 1000);

// 2. Data Insiden
const incidents = [
  { type: 'Kecelakaan', loc: 'Jl. Sudirman KM 5', time: '14:18', sev: 'high' },
  { type: 'Macet Parah', loc: 'Bundaran HI – Thamrin', time: '14:05', sev: 'high' },
  { type: 'Mogok', loc: 'Jl. Gatot Subroto', time: '13:52', sev: 'med' },
  { type: 'Perbaikan', loc: 'Jl. Rasuna Said', time: '13:30', sev: 'low' },
];
const sevBg = { high: '#F09595', med: '#FAC775', low: '#9FE1CB' };
const sevTx = { high: '#791F1F', med: '#633806', low: '#085041' };

const iList = document.getElementById('incidents-list');
incidents.forEach(inc => {
  const d = document.createElement('div');
  d.style.cssText = 'padding: 8px 10px; background: var(--color-background-secondary); border-radius: var(--border-radius-md);';
  d.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
      <span style="font-size:10px; font-weight:500; padding:2px 6px; border-radius:3px; background:${sevBg[inc.sev]}; color:${sevTx[inc.sev]};">${inc.type}</span>
      <span style="font-size:10px; color:var(--color-text-tertiary);">${inc.time}</span>
    </div>
    <p style="font-size:11px; color:var(--color-text-secondary); margin:0;">${inc.loc}</p>
  `;
  iList.appendChild(d);
});

// 3. Data Koridor (Ruas Jalan)
const corridors = [
  { name: 'Jl. Sudirman', spd: 12, st: 'Kritis' },
  { name: 'Jl. Thamrin', spd: 15, st: 'Kritis' },
  { name: 'Jl. Gatot Subroto', spd: 24, st: 'Padat' },
  { name: 'Jl. Rasuna Said', spd: 19, st: 'Padat' },
  { name: 'Jl. HR Rasuna', spd: 32, st: 'Sedang' },
  { name: 'Jl. Kuningan Raya', spd: 40, st: 'Lancar' },
];
const stBg = { Kritis: '#F09595', Padat: '#FAC775', Sedang: '#B5D4F4', Lancar: '#9FE1CB' };
const stTx = { Kritis: '#791F1F', Padat: '#633806', Sedang: '#042C53', Lancar: '#085041' };

const cDiv = document.getElementById('corridors');
corridors.forEach(c => {
  const pct = Math.round((c.spd / 60) * 100);
  const el = document.createElement('div');
  el.style.cssText = 'padding: 10px 12px; background: var(--color-background-secondary); border-radius: var(--border-radius-md);';
  el.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
      <span style="font-size:11px; font-weight:600; color:var(--color-text-primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:110px;">${c.name}</span>
      <span style="font-size:10px; font-weight:600; padding:1px 7px; border-radius:3px; margin-left:4px; flex-shrink:0; background:${stBg[c.st]}; color:${stTx[c.st]};">${c.st}</span>
    </div>
    <div style="height:3px; background:var(--color-border-tertiary); border-radius:2px; overflow:hidden; margin-bottom:4px;">
      <div style="height:100%; width:${pct}%; background:${stBg[c.st]}; border-radius:2px;"></div>
    </div>
    <span style="font-size:10px; color:var(--color-text-tertiary);">${c.spd} km/h</span>
  `;
  cDiv.appendChild(el);
});

// 4. Rekomendasi Sinyal AI
const signals = [
  { loc: 'Simpang Semanggi', action: 'Tambah fase hijau 15 detik arah Selatan', impact: 'Kurangi antrean 30%' },
  { loc: 'Bundaran HI', action: 'Aktifkan siklus adaptif AI', impact: 'Throughput +22%' },
  { loc: 'Simpang Kuningan', action: 'Koordinasi gelombang hijau barat–timur', impact: 'Waktu tempuh -8 mnt' },
  { loc: 'Simpang Gatsu', action: 'Perpanjang fase sisi Barat 20 detik', impact: 'Kurangi antrean 25%' },
];
const sDiv = document.getElementById('signal-recs');
signals.forEach(s => {
  const el = document.createElement('div');
  el.style.cssText = 'padding: 10px 12px; background: var(--color-background-secondary); border-radius: var(--border-radius-md); border-left: 2px solid #378ADD;';
  el.innerHTML = `
    <p style="font-size:11px; font-weight:600; color:var(--color-text-primary); margin:0 0 4px;">${s.loc}</p>
    <p style="font-size:11px; color:var(--color-text-secondary); margin:0 0 4px; line-height:1.4;">${s.action}</p>
    <span style="font-size:10px; padding:1px 6px; border-radius:3px; background:#E6F1FB; color:#185FA5;">${s.impact}</span>
  `;
  sDiv.appendChild(el);
});

// 5. Konfigurasi Chart.js
const hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'].map(h => h+':00');
const actual = [5,4,5,4,3,8,22,38,45,32,28,30,35,33,30,28,32,40,48,44,35,25,18,10];
const predict = [5,4,5,4,3,9,24,40,44,30,27,31,34,32,31,29,35,43,50,46,36,24,17,9];
const curHour = new Date().getHours();

const ctx = document.getElementById('trafficChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: hours,
    datasets: [
      {
        label: 'Aktual',
        data: actual.map((v, i) => i <= curHour ? v : null),
        borderColor: '#378ADD',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Prediksi AI',
        data: predict,
        borderColor: '#EF9F27',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { font: { size: 9 }, color: '#888780', autoSkip: true, maxTicksLimit: 8 },
        grid: { color: 'rgba(136,135,128,0.12)' }
      },
      y: {
        min: 0, max: 55,
        ticks: { font: { size: 9 }, color: '#888780', stepSize: 10 },
        grid: { color: 'rgba(136,135,128,0.12)' },
        title: { display: true, text: 'Indeks Kemacetan', font: { size: 9 }, color: '#888780' }
      }
    }
  }
});

// 6. Animasi Simulasi Live Data (Metric Angka Bergerak)
let titikVal = 23;
setInterval(() => {
  const delta = Math.random() > 0.5 ? 1 : -1;
  titikVal = Math.max(18, Math.min(28, titikVal + delta));
  document.getElementById('titik-macet').textContent = titikVal;
  
  const kec = Math.round(Math.random() * 4 + 16);
  document.getElementById('kecepatan').innerHTML = kec + ' <span>km/h</span>';
}, 4000);

// Data kumpulan skenario AI (Bisa kamu tambah/ubah isinya)
const skenarioAI = [
  {
    ruas: "Jl. Sudirman (Kritis)",
    sebab: "Penyempitan lajur di KM 4 akibat proyek galian bawah tanah.",
    prediksi: "Antrean akan terurai otomatis pada pukul 19:45 WIB.",
    tindakan: "Siklus lampu hijau di Simpang Gatot Subroto diperpanjang 20 detik."
  },
  {
    ruas: "Jl. Thamrin (Padat)",
    sebab: "Volume kendaraan pribadi meningkat 40% dari arah Monas.",
    prediksi: "Kepadatan diprediksi menurun bertahap dalam 25 menit.",
    tindakan: "Sistem merekomendasikan pengalihan arus ke Jl. Tanah Abang."
  },
  {
    ruas: "Jl. Gatot Subroto (Kritis)",
    sebab: "Kecelakaan ringan di lajur kanan dekat pintu tol masuk.",
    prediksi: "Kemacetan diprediksi tertahan hingga evakuasi selesai (± 35 menit).",
    tindakan: "Notifikasi darurat dikirim ke petugas patroli lapangan."
  },
  {
    ruas: "Jl. Rasuna Said (Sedang)",
    sebab: "Terdapat genangan air setinggi 10cm di jalur lambat.",
    prediksi: "Arus lalu lintas akan kembali normal jika hujan mereda.",
    tindakan: "Papan informasi digital (VMS) diubah untuk menampilkan peringatan kurangi kecepatan."
  }
];

// Fungsi Buka Modal & Acak Data AI
function bukaModal() {
  // Pilih salah satu skenario secara acak dari data di atas
  const acak = skenarioAI[Math.floor(Math.random() * skenarioAI.length)];
  
  // Masukkan teks acak tersebut ke dalam HTML
  document.getElementById('modal-ruas').textContent = acak.ruas;
  document.getElementById('modal-sebab').textContent = acak.sebab;
  document.getElementById('modal-prediksi').textContent = acak.prediksi;
  document.getElementById('modal-tindakan').textContent = acak.tindakan;

  // Munculkan jendelanya
  document.getElementById('aiModal').style.display = 'flex';
}

// Fungsi Tutup Modal
function tutupModal() {
  document.getElementById('aiModal').style.display = 'none';
}
