# 🚘 KURSUS MENGEMUDI RPL BY ***HELMI*** 🚗💨
Disusun oleh **K2_G14** yang beranggotakan :
- Michelle Lim / 18221052
- Esther Regina / 18221086
- Angela Geraldine Hasian Panjaitan / 18221158
- Seren Elizabeth Siahaan / 18221160

## Penjelasan Singkat Aplikasi
Kursus Mengemudi RPL adalah aplikasi untuk melakukan pendaftaran kursus mengemudi oleh calon pelanggan 🚘. Aplikasi ini juga memungkinkan owner untuk mengelola data kelas, akun admin, informasi perusahaan & FAQ, data kendaraan, data instruktur. Selain itu, aplikasi ini juga memungkinkan admin untuk mengelola data pelanggan. 

## Penjelasan Branch
- Branch ```main``` <br>
Berisi keseluruhan code fix dari branch develop yang di-deploy
- Branch ```staging``` <br>
Berisi code keseluruhan yang ada dalam tahap development
- Branch ```michelle``` <br>
Berisi code untuk fitur <u> mengelola data instruktur</u> dan <u> mengelola data kendaraan </u>
- Branch ```esther``` <br>
Berisi code untuk fitur <u>login</u> dan <u>mengelola data akun admin kursus</u>
- Branch ```angel``` <br>
Berisi code untuk fitur <u>memilih kursus untuk mengisi formulir data diri</u> dan <u>mengelola data calon pelanggan</u>
- Branch ```seren``` <br>
Berisi code untuk fitur <u>mengelola data kelas mengemudi</u> dan <u>melihat informasi kelas, FAQ, dan informasi perusahaan</u>

## Cara menjalankan aplikasi untuk development backend pada localhost
1. Jalankan command ```npm install``` pada terminal untuk menginstal semua modul yang diperlukan untuk menjalankan aplikasi.

2. Buatlah file ```.env``` pada root folder.

    file .env :
    ```
    PORT=3333
    NODE_ENV=dev
    MONGO_URI=mongodb+srv://admin:admin@cluster0.agwt2ah.mongodb.net/?retryWrites=true&w=majority

    JWT_AUDIENCE=localhost:3000
    JWT_ISSUER=localhost:3333
    JWT_KEY=ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff

    REDIS_URL=redis://default:NeIOpPCkBNg1pPgiFIFF4l6bC1L42eeD@monorail.proxy.rlwy.net:36462
    ```

3. Untuk menjalankan aplikasi secara lokal, buka dua tab terminal pada IDE. Pada terminal pertama, jalankan command ```tsc -w``` dan pada terminal satunya, jalankan ```npm run dev``` secara bersamaan. 

4. Test keberjalanan backend aplikasi menggunakan ```Postman```.

## Cara menjalankan aplikasi untuk development frontend pada localhost
1. Jalankan command ```npm install``` pada terminal untuk menginstal semua modul yang diperlukan untuk menjalankan aplikasi.

2. Jalankan ```npm run dev``` untuk menjalankan aplikasi.

3. Buka ```localhost:3000``` pada browser untuk mengakses frontend aplikasi dan memantau perubahan yang dilakukan terhadap source code.

## Cara menjalankan aplikasi secara remote melalui web address yang telah di-deploy
1. Buka https://rpl-frontend-psi.vercel.app/

## Cara menjalankan testing aplikasi
1. Jalankan command ```npm install``` pada terminal untuk menginstal semua modul yang diperlukan untuk menjalankan aplikasi 

2. Jalankan command ```npm test``` pada terminal

## Daftar use case yang diimplementasi
**1. Melihat informasi kelas, FAQ, dan informasi perusahaan** <br>
PIC: 18221160 Seren Elizabeth Siahaan <br>
Capture Screen: <br>
<img src="doc/usecase1/homepage_usecase 1-1.png" width=40%>

**2. Memilih kursus dan Mengisi formulir data diri** <br>
PIC: 18221158 Angela Geraldine Hasian Panjaitan <br>
Capture Screen: <br>
<img src="doc/usecase2/homepage_usecase 2-1.png" width=40%>
<img src="doc/usecase2/form pendaftaran_usecase 2-2.png" width=40%>
<img src="doc/usecase2/form pendaftaran_usecase 2-3.png" width=40%>

**3. Mengelola data kelas yang tersedia** <br>
PIC: 18221160 Seren Elizabeth Siahaan <br>
Capture Screen: <br>
<img src="doc/usecase3/mengelola kelasmengemudi_usecase 3-1.jpeg" width=40%>
<img src="doc/usecase3/create kelasmengemudi_usecase 3-2.jpeg" width=40%>
<img src="doc/usecase3/create kelasmengemudi_usecase 3-3.jpeg" width=40%>
<img src="doc/usecase3/update kelasmengemudi_usecase 3-6.jpeg" width=40%>
<img src="doc/usecase3/delete kelasmengemudi_usecase 3-8.jpeg" width=40%>

**4. Mengelola akun pengguna admin** <br>
PIC: 18221086 Esther Regina <br>
Capture Screen: <br>
<img src="doc/usecase4/mengelola adminkursus_usecase 4-1.png" width=40%>
<img src="doc/usecase4/create adminkursus_usecase 4-2.png" width=40%>
<img src="doc/usecase4/create adminkursus_usecase 4-3.png" width=40%>
<img src="doc/usecase4/update adminkursus_usecase 4-6.png" width=40%>
<img src="doc/usecase4/delete adminkursus_usecase 4-8.png" width=40%>

**5. Mengelola data instruktur** <br>
PIC: 18221052 Michelle Lim <br>
Capture Screen: <br>
<img src="doc/usecase5/mengelola instruktur_usecase 5-1.png" width=40%>
<img src="doc/usecase5/create instruktur_usecase 5-2.png" width=40%>
<img src="doc/usecase5/create instruktur_usecase 5-3.png" width=40%>
<img src="doc/usecase5/update instruktur_usecase 5-6.png" width=40%>
<img src="doc/usecase5/delete instruktur_usecase 5-8.png" width=40%>

**6. Mengelola data kendaraan** <br>
PIC: 18221052 Michelle Lim <br>
Capture Screen: <br>
<img src="doc/usecase6/mengelola kendaraan_usecase 6-1.png" width=40%>
<img src="doc/usecase6/create kendaraan_usecase 6-2.png" width=40%>
<img src="doc/usecase6/create kendaraan_usecase 6-3.png" width=40%>
<img src="doc/usecase6/update kendaraan_usecase 6-6.png" width=40%>
<img src="doc/usecase6/delete kendaraan_usecase 6-8.png" width=40%>

**7. Log in** <br>
PIC: 18221086 Esther Regina <br>
Capture Screen: <br>
<img src="doc/usecase7/header_usecase 7-1.png" width=40%>
<img src="doc/usecase7/login_usecase 7-2.png" width=40%>
<img src="doc/usecase7/login_usecase 7-3.png" width=40%>
<img src="doc/usecase7/dashboard owner_usecase 7-4.png" width=40%>
<img src="doc/usecase7/dashboard admin_usecase 7-5.png" width=40%>

**8. Mengelola data pelanggan** <br>
PIC: 18221158 Angela Geraldine Hasian Panjaitan <br>
Capture Screen: <br>
<img src="doc/usecase8/data pelanggan_usecase 8-1.png" width=40%>
<img src="doc/usecase8/create pelanggan_usecase 8-2.png" width=40%>
<img src="doc/usecase8/create pelanggan_usecase 8-3.png" width=40%>
<img src="doc/usecase8/update pelanggan_usecase 8-6.png" width=40%>
<img src="doc/usecase8/delete pelanggan_usecase 8-8.png" width=40%>

## Tabel Basis Data Implementasi

| Nama Tabel          |Atribut     |
| ----------------    | ------------------|
| calonpelanggan_datas| - _id <br>- calonPelangganID <br> - nama <br> - kelasPelanggan <br> - umur <br> - noWA <br> - alamat<br> - adminKursus<br> - statusPelanggan<br> - tanggalPendaftaran <br> - __v <br>|
|instruktur_datas| - _id <br>- nikInstruktur <br> - namaLengkap <br> - alamatInstruktur <br> - noTelp <br> - noRekening <br> - createdAt<br> - createdBy<br> - __v <br>|
|kelasmengemudi_datas| - _id <br>- kelasMengemudiID <br> - namaKelas <br> - hargaKelas <br> - jenisKendaraan <br> - totalJamKursus <br> - jumlahSesi<br> - platNomorKendaraan<br> - namaKendaraan<br> - createdAt<br> - createdBy <br> - __v <br>|
|kendaraan_datas| - _id <br>- nomorKendaraan <br> - namaKendaraan <br> - jenisTransmisi <br> - jumlahKilometer <br> - tanggalTerakhirService <br> - statusKetersediaan<br> - statusKendaraan<br> - createdAt<br> - createdBy <br> - __v <br>|
|kendaraan_datas| - _id <br>- nomorKendaraan <br> - namaKendaraan <br> - jenisTransmisi <br> - jumlahKilometer <br> - tanggalTerakhirService <br> - statusKetersediaan<br> - statusKendaraan<br> - createdAt<br> - createdBy <br> - __v <br>|
|user_datas| - _id <br>- user_id <br> - username <br> - password_hash <br> - tipe_user <br> - created_at <br> - created_by<br> - __v <br>|
|property|<table><tr><td>Key</td><td>Value</td></tr><tr><td>deskripsi</td><td>deskripsi</td></tr><tr><td>faq</td><td>[ { question, answer} ]</td></tr></table>|
