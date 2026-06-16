window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Pemetaan: "ID di HTML" : "Parameter di URL" (KODE ASLI ANDA)
    const mapping = {
        'mainid': 'id',
        'mainstore': 'store',
        'mainpasien': 'nama',
        'mainalamat': 'alamat'
    };

    for (const [fieldID, paramName] of Object.entries(mapping)) {
        const value = urlParams.get(paramName);
        const field = document.getElementById(fieldID);
        
        if (value && field) {
            field.value = value;
        }
    }

    // ==================== TAMBAHAN VALIDASI AWAL ====================
    const mainID = urlParams.get('id');
    const cameraInput = document.getElementById('cameraInput');
    const sendBtn = document.getElementById('mainSendBtn');

    if (mainID) {
        try {
            // SILAKAN GANTI URL DI BAWAH INI DENGAN URL FLOW VALIDASI BARU ANDA
            const validateResponse = await fetch("https://default9ec0d6c58a25418fb3841c77c55584.c2.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/5999a7e576bf4409b16334396bc93cad/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=woKUgYUcXHFSu1do37C6miR4eqViAvFDNwg9sKqKoBw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: mainID })
            });

            // Jika Power Automate merespons 400 (Sudah Pernah Feedback)
            if (validateResponse.status === 400) {
                alert("Terima kasih anda sudah feedback foto resep kerjasama atas nama pasien berikut!"); // Pesan kustom sesuai request Anda
                
                // Mengunci input kamera dan tombol kirim di HTML
                if (cameraInput) cameraInput.disabled = true;
                if (sendBtn) {
                    sendBtn.disabled = true;
                    sendBtn.innerText = "Foto Resep Sudah Diterima";
                }
                return; // Berhenti di sini, tidak mengeksekusi baris bawahnya
            }

            // Jika response 200, aplikasi otomatis lanjut ke logika di bawah tanpa interupsi

        } catch (error) {
            console.error("Gagal melakukan verifikasi ID:", error);
        }
    }
    // ===========================================================================
});

const cameraInput = document.getElementById('cameraInput');
const photoPreview = document.getElementById('photoPreview');
const previewContainer = document.getElementById('previewContainer');
const sendBtn = document.getElementById('mainSendBtn');

let base64String = "";

// 1. Logika Menangkap Foto dan Convert ke Base64 (KODE ASLI ANDA)
cameraInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            base64String = event.target.result.split(',')[1]; // Ambil string base64 saja
            photoPreview.src = event.target.result;
            previewContainer.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// 2. Kirim Data ke Power Automate (KODE ASLI ANDA)
sendBtn.addEventListener('click', async () => {
    const mainID = document.getElementById('mainid').value;
    const store = document.getElementById('mainstore').value;
    const pasien = document.getElementById('mainpasien').value;

    if (!base64String) {
        alert("Silakan ambil foto terlebih dahulu!");
        return;
    }

    const payload = {
        id: mainID,
        storeName: store,
        patientName: pasien,
        photo: base64String, // String Base64
        fileName: `${mainID}_${Date.now()}.jpg`
    };

    sendBtn.disabled = true;
    sendBtn.innerText = "Sending...";

    try {
        const response = await fetch("https://default9ec0d6c58a25418fb3841c77c55584.c2.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4f58044fc3954d39bebc6e28a3d46478/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OAF_mw-27NfjK85rladDAGjXQlejFWFNsoqDeZ_5HLA", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Data dan Foto berhasil dikirim!");
            window.close();
        } else {
            alert("Gagal mengirim data.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan koneksi.");
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerText = "Submit Data";
    }
});
