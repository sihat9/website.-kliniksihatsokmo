/* scripts.js */

// --- Konfigurasi URL ---

// URL Google Apps Script yang bertindak sebagai proxy CORS
var jadualDoktorCsvUrl = 'https://script.google.com/macros/s/AKfycbwf7RyivqhkDtJAdLyVQ7g8kqYS2Z3JFlKvXl2FvLbAZD38iUaO66OjPgRE8tu00pU/exec'; // Gantikan dengan URL sebenar

// --- Senarai Panel Klinik ---
const panelList = [
    "UNISZA",
    "HEALTH CONNECT",
    "MAIDAM",
    "EverLantern",
    "e-mas",
    "PERKESO",
    "mednefits",
    "MARA",
    "HealthMetrics",
    "MiCARE",
    "AIA",
    "MAIDAM PROPERTY",
    "UMT",
    "PMCare",
    "pekaB40",
    "ASP MEDICAL GROUP",
    "AmMetlife",
    "BANK ISLAM",
    "EDGENTA",
    "UEM",
    "FGV",
    "UIA",
    "KWSP",
    "LPT2",
    "MALAYSIA AIRPORTS",
    "TOURISM MALAYSIA",
    "MYTV",
    "nu sentral",
    "OUM",
    "POS MALAYSIA",
    "HOTEL SERI MALAYSIA",
    "Takaful IKHLAS",
    "TELEKOM MALAYSIA",
    "UniKL"
];

// --- Pembolehubah untuk Menguruskan Paparan Panel ---
let panelsToShow = 6; // Bilangan panel yang dipaparkan setiap kali
let currentIndex = 0;  // Indeks panel semasa

// --- Fungsi untuk Memaparkan Panel ---
function displayPanels(initial = true) {
    const panelGrid = document.getElementById('panelGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const searchTerm = document.getElementById('searchPanel').value.trim().toLowerCase();

    if (initial) {
        panelGrid.innerHTML = ''; // Kosongkan grid sebelum memaparkan
        currentIndex = 0;         // Reset indeks semasa
    }

    // Filter panel berdasarkan carian
    const filteredPanels = panelList.filter(panel => panel.toLowerCase().includes(searchTerm));

    // Paparkan panel dari currentIndex hingga currentIndex + panelsToShow
    const panelsToDisplay = filteredPanels.slice(currentIndex, currentIndex + panelsToShow);

    panelsToDisplay.forEach(panel => {
        // Cipta elemen kolom
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-3 col-sm-6 mb-4';

        // Cipta elemen card
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card panel-card h-100 text-center';

        // Cipta elemen gambar (gunakan gambar placeholder atau sesuaikan)
        const img = document.createElement('img');
        img.src = 'images/panel-placeholder.jpg'; // Gantikan dengan gambar sebenar jika ada
        img.className = 'card-img-top panel-img';
        img.alt = panel;

        // Cipta elemen badan card
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Cipta elemen tajuk
        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = panel;

        // Tambah elemen ke dalam card body
        cardBody.appendChild(cardTitle);

        // Tambah gambar dan badan card ke dalam card
        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);

        // Tambah card ke dalam kolom
        colDiv.appendChild(cardDiv);

        // Tambah card ke dalam grid
        panelGrid.appendChild(colDiv);
    });

    currentIndex += panelsToShow;

    // Tunjukkan atau sembunyikan butang Load More
    if (currentIndex >= filteredPanels.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }

    // Tunjukkan mesej jika tiada panel dipaparkan
    const searchMessage = document.getElementById('searchMessage');
    if (filteredPanels.length === 0) {
        searchMessage.style.display = 'block';
        loadMoreBtn.style.display = 'none';
    } else {
        searchMessage.style.display = 'none';
    }
}

// --- Fungsi untuk Menapis Panel Klinik Berdasarkan Carian ---
function filterPanels() {
    displayPanels(true); // Paparkan semula panel berdasarkan carian
}

// --- Fungsi untuk Memuatkan Jadual Doktor dari Google Sheets menggunakan PapaParse ---
function loadJadualDoktor(hari) {
    console.log('Memuatkan jadual doktor untuk:', hari);
    Papa.parse(jadualDoktorCsvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            console.log('Data CSV:', data); // Log keseluruhan data CSV
            var tbody = document.querySelector('#jadualTable tbody');
            tbody.innerHTML = ''; // Kosongkan jadual sebelum mengisi

            var matchedRows = 0; // Untuk mengira jumlah baris yang dipaparkan

            data.forEach(function(row) {
                // Pastikan kolum "Hari" sesuai dengan yang diharapkan
                if (row.Hari && row.Hari.trim().toLowerCase() === hari.trim().toLowerCase()) {
                    var namaDoktor = row['Nama Doktor'];
                    var waktuBertugas = row['Waktu Bertugas'];

                    // Tentukan kelas badge berdasarkan shift waktu
                    var badgeClass = '';
                    if (waktuBertugas.toLowerCase().includes('pagi')) {
                        badgeClass = 'badge-shift-pagi';
                    } else if (waktuBertugas.toLowerCase().includes('tengah')) {
                        badgeClass = 'badge-shift-tengah';
                    } else if (waktuBertugas.toLowerCase().includes('malam')) {
                        badgeClass = 'badge-shift-malam';
                    } else {
                        badgeClass = 'bg-secondary';
                    }

                    // Buat baris jadual
                    var tr = document.createElement('tr');

                    // Hari dengan ikon
                    var tdHari = document.createElement('td');
                    tdHari.innerHTML = '<i class="fas fa-calendar-alt me-2"></i>' + row.Hari;
                    tr.appendChild(tdHari);

                    // Nama Doktor
                    var tdNama = document.createElement('td');
                    tdNama.textContent = namaDoktor;
                    tr.appendChild(tdNama);

                    // Waktu Bertugas dengan badge
                    var tdWaktu = document.createElement('td');
                    var badge = document.createElement('span');
                    badge.className = 'badge ' + badgeClass;
                    badge.textContent = waktuBertugas;
                    tdWaktu.appendChild(badge);
                    tr.appendChild(tdWaktu);

                    // Hubungi dengan WhatsApp dan Telefon
                    var tdHubungi = document.createElement('td');
                    tdHubungi.className = 'text-center';
                    
                    // Pautan WhatsApp
                    var whatsappLink = document.createElement('a');
                    whatsappLink.href = 'https://wa.me/60139242800?text=' + encodeURIComponent('Saya ingin booking slot bersama ' + namaDoktor + ', adakah masih available?');
                    whatsappLink.target = '_blank';
                    whatsappLink.rel = 'noopener noreferrer';
                    whatsappLink.title = 'Hubungi dengan WhatsApp';
                    whatsappLink.className = 'me-2';
                    var whatsappIcon = document.createElement('i');
                    whatsappIcon.className = 'fab fa-whatsapp whatsapp-icon';
                    whatsappLink.appendChild(whatsappIcon);

                    // Pautan Telefon
                    var phoneLink = document.createElement('a');
                    phoneLink.href = 'tel:096152800'; // Pastikan nombor telefon betul
                    phoneLink.title = 'Hubungi melalui Telefon';
                    var phoneIcon = document.createElement('i');
                    phoneIcon.className = 'fas fa-phone phone-icon';
                    phoneLink.appendChild(phoneIcon);

                    // Tambah kedua-dua pautan ke dalam sel
                    tdHubungi.appendChild(whatsappLink);
                    tdHubungi.appendChild(phoneLink);

                    tr.appendChild(tdHubungi);

                    tbody.appendChild(tr);

                    matchedRows++; // Tambah bilangan baris yang dipaparkan
                }
            });

            // Jika tidak ada data untuk hari tersebut
            if (matchedRows === 0) {
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                td.setAttribute('colspan', '4'); // Menyesuaikan kepada 4 kolum
                td.className = 'text-center text-muted';
                td.textContent = 'Tiada Doktor Bertugas untuk hari ini.';
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        },
        error: function(error) {
            console.error('Error memuatkan jadual doktor:', error);
            alert('Gagal memuatkan jadual doktor. Sila cuba lagi.');
        }
    });
}

// --- Event Listeners untuk Butang "Hari Ini" dan "Esok" ---
document.getElementById('btnHariIni').addEventListener('click', function() {
    loadJadualDoktor('Hari Ini');
    // Tukar butang aktif
    this.classList.remove('btn-secondary');
    this.classList.add('btn-primary');
    document.getElementById('btnEsok').classList.remove('btn-primary');
    document.getElementById('btnEsok').classList.add('btn-secondary');
});

document.getElementById('btnEsok').addEventListener('click', function() {
    loadJadualDoktor('Esok');
    // Tukar butang aktif
    this.classList.remove('btn-secondary');
    this.classList.add('btn-primary');
    document.getElementById('btnHariIni').classList.remove('btn-primary');
    document.getElementById('btnHariIni').classList.add('btn-secondary');
});

// --- Event Listener untuk Butang Load More ---
document.getElementById('loadMoreBtn').addEventListener('click', function() {
    displayPanels(false); // Paparkan lebih banyak panel tanpa reset
});

// --- Event Listener untuk Butang Cari ---
document.getElementById('btnSearch').addEventListener('click', function() {
    filterPanels();
});

// --- Event Listener untuk Carian Enter ---
document.getElementById('searchPanel').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        filterPanels();
    }
});

// --- Fungsi untuk Memuatkan Panel Klinik secara Default dan Jadual Doktor Hari Ini ---
window.addEventListener('DOMContentLoaded', (event) => {
    displayPanels(true); // Paparkan 6 panel pertama
    loadJadualDoktor('Hari Ini'); // Memuatkan jadual doktor untuk hari ini
});
