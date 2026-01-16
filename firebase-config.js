// Nama File: firebase-config.js

// Import Library Firebase (Versi Compat agar sesuai dengan gaya codingmu sebelumnya)
import firebase from "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpUWUIzPXIZN6rrNtsIqcL6VfOE2RLVl0",
    authDomain: "mading-cf676.firebaseapp.com",
    projectId: "mading-cf676",
    storageBucket: "mading-cf676.firebasestorage.app",
    messagingSenderId: "72175203671",
    appId: "1:72175203671:web:7a0676a55beb64bc96ba12"
};

// Inisialisasi jika belum ada
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Kita export agar bisa dipakai di file lain
export { firebase, auth, db };

// --- FUNGSI GLOBAL UTILS (POP-UP & LOADING) ---
// Ini ditaruh disini agar bisa dipanggil dari semua halaman

export function showLoading(message = "Memuat...") {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        // Buat elemen jika belum ada
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `<div class="progress-spinner"></div><p id="loading-text">${message}</p>`;
        document.body.appendChild(overlay);
    } else {
        document.getElementById('loading-text').textContent = message;
        overlay.classList.remove('hidden');
    }
}

export function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
}

export function showCustomAlert(message, title = 'Informasi') {
    createModalHTML();
    const modalContainer = document.getElementById('global-modal-container');
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <h2>${title}</h2>
                <p>${message}</p>
                <div style="display:flex; justify-content: flex-end; margin-top:20px;">
                    <button class="btn" onclick="document.getElementById('global-modal-container').innerHTML = ''">OK</button>
                </div>
            </div>
        </div>`;
}

export function showCustomConfirm(message) {
    createModalHTML();
    return new Promise(resolve => {
        const modalContainer = document.getElementById('global-modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <h2>Konfirmasi</h2>
                    <p>${message}</p>
                    <div style="display:flex; gap:10px; justify-content: flex-end; margin-top:20px;">
                        <button class="btn btn-secondary" id="confirm-cancel">Batal</button>
                        <button class="btn btn-danger" id="confirm-yes">Ya, Lanjutkan</button>
                    </div>
                </div>
            </div>`;
        
        document.getElementById('confirm-cancel').onclick = () => { modalContainer.innerHTML = ''; resolve(false); };
        document.getElementById('confirm-yes').onclick = () => { modalContainer.innerHTML = ''; resolve(true); };
    });
}

function createModalHTML() {
    if (!document.getElementById('global-modal-container')) {
        const div = document.createElement('div');
        div.id = 'global-modal-container';
        document.body.appendChild(div);
    }
}

// Fungsi Cek Login untuk Proteksi Halaman
export function checkAuth(redirectIfNoUser = true) {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(user => {
            if (!user && redirectIfNoUser) {
                window.location.href = 'login.html';
            } else if (user) {
                // Ambil data user dari Firestore untuk update session
                db.collection("users").doc(user.uid).get().then(doc => {
                    resolve({ uid: user.uid, ...doc.data() });
                });
            } else {
                resolve(null);
            }
        });
    });
}
