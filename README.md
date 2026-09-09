# Prototipe profil Risal Num Arif Rivan Syahrir
Prototipe lokal untuk profil, karya, dan tautan produk. Identitas visual mengacu pada LulusUjian.com.

## Cara mencoba
Halaman utama: http://localhost:3000/
Pengelola: http://localhost:3000/kelola

Pilih **Masuk ke mode pratinjau**. Edit profil atau tambahkan karya/produk, lalu simpan. Buka **Lihat profil** untuk melihat perubahan. Simpan lokal menggunakan database D1/SQLite di folder .wrangler/state; data bertahan setelah browser ditutup.

Login pratinjau bukan autentikasi produksi. Semua operasi tulis ditolak pada build produksi. Belum ada publikasi atau pembelian hosting.

## Menjalankan kembali
Gunakan Node.js 22.13+ dan pnpm. Jalankan pnpm install --ignore-scripts, terapkan migrasi lokal dengan pnpm exec wrangler d1 migrations apply DB --local --config wrangler.local.json, lalu pnpm dev --host 127.0.0.1.

## Sebelum diterbitkan
Hubungkan penyedia login, tentukan akun pemilik di sisi server, pindahkan penyimpanan ke layanan produksi, dan uji hak akses pemilik. Prototipe belum boleh dipakai sebagai dashboard publik.

## Referensi
Nama, jabatan, dan instansi: diberikan pengguna.
Bio profesional (ASN, widyaiswara, entrepreneur, IPDN XVIII): https://www.instagram.com/arifrivan/
Logo dan penjelasan LulusUjian: https://lulusujian.com/
Teks pengantar dan bio adalah draf yang dapat diedit.
