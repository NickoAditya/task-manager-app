# 🚀 TaskEasy – Task Management Web App (Extreme Programming Project)

![HTML](https://img.shields.io/badge/HTML-5-orange?logo=html5) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript) ![React](https://img.shields.io/badge/React-18-blue?logo=react) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Integrated-38B2AC?logo=tailwindcss) ![Status](https://img.shields.io/badge/Status-Prototype-green)
> 🎯 Dibuat sebagai bagian dari tugas kuliah "Extreme Programming", aplikasi **TaskEasy** adalah solusi manajemen tugas sederhana dan efisien dengan menerapkan **praktik-praktik Extreme Programming (XP)** secara nyata.

---

## 📚 Deskripsi Proyek

"TaskEasy" adalah aplikasi berbasis web yang memungkinkan pengguna:
- Membuat, melihat, mengedit, dan menghapus tugas
- Menetapkan prioritas (Low, Medium, High)
- Melacak status tugas (To-Do, In Progress, Done)

Proyek ini dikerjakan oleh tim kami selama 1 minggu dengan pendekatan **Extreme Programming (XP)**, termasuk praktik seperti **pair programming, TDD, continuous integration**, dan **daily small releases**.

---

## 🌟 Fitur Inti

✅ Buat tugas baru (title, deskripsi, prioritas, status)  
✅ Lihat daftar semua tugas, tersortir berdasarkan prioritas  
✅ Edit atau hapus tugas  
✅ Simpan data secara lokal (LocalStorage)  
✅ Mode gelap/terang  
✅ Responsive design untuk desktop dan mobile

---

## 🔧 Teknologi

- HTML + CSS + JavaScript
- React.js
- TailwindCSS
- Jest (untuk Unit Testing)
- Git + GitHub + GitHub Actions (untuk CI)
- JSON Server (opsional, untuk simulasi backend)
- Vercel (deployment)

---

## 👥 Struktur Tim & Kontribusi

| Nama                     | NIM        | Peran Utama                                                                                        |
|--------------------------|------------|-----------------------------------------------------------------------------------------------------|
| **Nicko Fernando Aditya** | 231111742  | 👨‍💻 *Frontend Developer & Customer Role* <br>– Membuat UI/UX: Dashboard, Kanban, Calendar, Pomodoro <br>– Menyusun prioritas fitur harian <br>– Memberikan feedback harian sebagai "Customer" |
| **Raihan Azhari Lubis**   | 231111619  | 👨‍💻 *Frontend Developer & XP Coach* <br>– Pair Programming Driver <br>– Menyusun struktur kode dan mengimplementasi task list & form <br>– Menjaga penerapan TDD dan refactoring code |

---

## ⚙️ Cara Menjalankan Project Secara Lokal

1. **Clone repository:**

```bash
git clone https://github.com/username/task-easy.git
cd task-easy
```

2. **Install dependencies:**

```bash
npm install --legacy-peer-deps
```

3. **Jalankan aplikasi lokal:**

```bash
npm run dev
```

4. **Akses via browser:**

```
http://localhost:3000
```

---

## ✅ Penerapan Praktik Extreme Programming

| Praktik XP                 | Implementasi                                                                                         |
|---------------------------|------------------------------------------------------------------------------------------------------|
| **Pair Programming**       | Kami bekerja berpasangan secara teratur, saling bertukar peran driver-navigator.                    |
| **Test-Driven Development**| Kami menulis unit test (menggunakan Jest) sebelum mengembangkan fitur inti.                         |
| **Continuous Integration** | Repositori GitHub diatur dengan GitHub Actions untuk menjalankan test otomatis setiap commit.       |
| **Small Releases**         | Setiap fitur inti dirilis harian dan diuji secara lokal/dengan feedback dari "customer".            |
| **Refactoring**            | Dilakukan rutin, terutama setelah testing, agar kode tetap rapi dan mudah dipahami.                 |
| **Customer Feedback**      | Nicko bertindak sebagai "customer", memberikan review harian terhadap fitur yang sudah selesai.      |
| **Planning Game**          | Hari pertama: kami breakdown semua kebutuhan menjadi user stories, lalu memberi estimasi story point.|

---

## 🧾 User Stories

Berikut adalah daftar *user stories* yang kami buat berdasarkan hasil *Planning Game* bersama anggota tim dan peran "Customer":

1. **Sebagai pengguna, saya ingin membuat tugas dengan judul dan prioritas** agar saya bisa mengatur pekerjaan berdasarkan tingkat kepentingan.
2. **Sebagai pengguna, saya ingin menambahkan deskripsi pada tugas** supaya saya bisa memberikan detail penting mengenai pekerjaan tersebut.
3. **Sebagai pengguna, saya ingin mengatur status tugas menjadi "to-do", "in-progress", atau "done"** agar saya bisa memantau progres kerja saya.
4. **Sebagai pengguna, saya ingin melihat daftar semua tugas yang sudah dibuat** agar saya dapat mengelola pekerjaan saya secara menyeluruh.
5. **Sebagai pengguna, saya ingin mengurutkan tugas berdasarkan prioritas** agar saya bisa mendahulukan yang paling penting.
6. **Sebagai pengguna, saya ingin mengedit tugas yang sudah saya buat** jika saya perlu memperbarui informasi atau status.
7. **Sebagai pengguna, saya ingin menghapus tugas** agar saya bisa menghapus pekerjaan yang sudah tidak relevan.
8. **Sebagai pengguna, saya ingin melihat tampilan kalender** agar saya bisa merencanakan tugas berdasarkan tanggal.
9. **Sebagai pengguna, saya ingin menggunakan papan Kanban** agar saya bisa menggeser tugas antar kolom sesuai statusnya dengan lebih visual.
10. **Sebagai pengguna, saya ingin menggunakan timer Pomodoro** agar saya bisa bekerja dalam sesi fokus yang teratur.
11. **Sebagai pengguna, saya ingin bisa mencari tugas secara cepat** agar saya dapat menemukan pekerjaan tertentu tanpa perlu menggulir panjang.
12. **Sebagai pengguna, saya ingin mengganti tema terang atau gelap** agar saya bisa menyesuaikan tampilan sesuai preferensi visual saya.

> Semua user story di atas diestimasi menggunakan *story points* dan dikembangkan berdasarkan prioritas yang telah ditentukan oleh tim bersama "Customer".

---

## 📷 Preview Foto Website

![image](https://github.com/user-attachments/assets/7e6d2100-67db-4dfa-ab7e-ed05619b2b1e)

---

## 🌐 Demo Langsung

🔗 [task-manager-app-henna.vercel.app](https://task-manager-app-henna.vercel.app)

---

## 🧪 Unit Testing

- Framework: **Jest**
- Fokus test: fungsi CRUD, validasi form, dan update status.
- Test dijalankan otomatis setiap commit via **GitHub Actions** (CI Pipeline)

---

> Dibuat dengan semangat kolaboratif dan nilai-nilai Agile oleh mahasiswa Mikroskil.
