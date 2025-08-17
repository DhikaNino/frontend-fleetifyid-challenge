# frontend-fleetifyid-challenge

Ini adalah frontend untuk Fullstack Developer Challenge Test fleetify.id, disini saya menggunakan ReactJS sebagai library dan menggunakan komponen Radix UI, dan Axios untuk API.


## Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/DhikaNino/frontend-fleetifyid-challenge.git
   cd frontend-fleetifyid-challenge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Buka browser** dan buka url `http://localhost:3000`

## API Endpoints

The application expects the following API endpoints to be available at `http://localhost:3000/api`:

### Karyawan
- `GET /employee` - Mendapatkan semua karyawan
- `GET /employee/:employee_id` - Mendapatkan karyawan berdasarkan employee_id
- `POST /employee` - Membuat karyawan
- `PUT /employee/:employee_id` - Mengupdate karyawan
- `DELETE /employee/:id` - Menghapus karyawan

### Departement
- `GET /departement` - Mendapatkan semua departemen
- `GET /departement/:id` - Mendapatkan departemen berdasarkan ID
- `POST /departement` - Membuat new departemen
- `PUT /departement/:id` - Mengupdate departemen
- `DELETE /departement/:id` - Menghapus departemen

### Absensi
- `GET /attendance` - Mendapatkan log kehadiran bisa menggunakan filter diparameter
- `POST /attendance/in` - Absensi masuk
- `PUT /attendance/out` - Absensi keluar

## Folder Structure

```
src/
├── components/
│   ├── Dialog.jsx
│   ├── Select.jsx
│   ├── Table.jsx
│   ├── Search.jsx
│   ├── Pagination.jsx
│   └── icons.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── EmployeesPage.jsx
│   ├── DepartmentsPage.jsx
│   ├── AttendancePage.jsx
│   └── AttendanceEntryPage.jsx
├── services/
│   └── api.js
├── App.jsx
├── index.js
└── index.css
```

## Usage

### Navigasi

Aplikasi ini memiliki beberapa navigasi yaitu:

* **Dashboard** - Untuk melihat data statistik dan navigasi cepat
* **Karyawan** - Untuk mengelola data karyawan dengan fitur pencarian dan paginasi
* **Manajemen Departemen** - Untuk mengatur departemen dan pengaturan waktu
* **Kehadiran** - Untuk absensi masuk/keluar karyawan
* **Log Absensi** - Untuk melihat dan filter catatan kehadiran

### Karyawan

1. Buka menu **Karyawan**
2. Klik **Tambah Karyawan**
3. Isi data yang diperlukan (Nama, Departemen, Alamat)
4. Klik **Buat**

### Departemen

1. Buka menu **Departemen**
2. Klik **Tambah Departemen**
3. Masukkan nama departemen, waktu maksimal masuk dan waktu maksimal keluar
4. Klik **Buat**

### Log Absensi

1. Buka menu **Log Absensi**
2. Gunakan filter untuk melihat hasil berdasarkan dapartement atau range waktu:
   * Pilih departemen
   * Atur tanggal mulai dan tanggal akhir
   * Klik **Apply Filters**
3. Lihat hasil pada table yang telah difilter
4. Kamu bisa hapus filter dengan cara klik **Clear Filters**



## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.
