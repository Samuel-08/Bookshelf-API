 # Bookshelf API

Bookshelf API adalah aplikasi RESTful yang memungkinkan Anda untuk mengelola koleksi buku dengan fitur untuk menambahkan, memperbarui, menghapus, dan mengambil informasi buku. API ini ditulis menggunakan Node.js tanpa framework seperti Express.js.

## Daftar Isi

- [Fitur](#fitur)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Endpoint API](#endpoint-api)
  - [POST /books](#post-books)
  - [PUT /books/:id](#put-booksid)
  - [GET /books](#get-books)
  - [GET /books/:id](#get-booksid)
  - [DELETE /books/:id](#delete-booksid)
- [Contoh Permintaan dan Respons](#contoh-permintaan-dan-respons)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Fitur

- Menambahkan buku baru (dengan status selesai dan belum selesai).
- Memperbarui detail buku.
- Menghapus buku berdasarkan ID.
- Mengambil semua buku, buku selesai, buku belum selesai, dan buku berdasarkan nama.

## Persyaratan

- Node.js (12.x atau lebih baru)
- npm (Node Package Manager)

## Instalasi

1. **Clone Repository**

   ```bash
   git clone https://github.com/username/repo.git
   cd repo
   ```

2. **Instal Dependensi**
   Jalankan perintah berikut untuk menginstal dependensi yang diperlukan:

   ```bash
   npm install nanoid
   ```

3. **Menjalankan Aplikasi**
   Jalankan aplikasi dengan perintah berikut:

   ```bash
   node server.js
   ```

   Server akan berjalan di `http://localhost:9000`.

   ```bash
   Server is running on http://localhost:9000
   ```

## Penggunaan

API ini menggunakan method HTTP untuk melakukan operasi CRUD (Create, Read, Update, Delete). Anda dapat menggunakan alat seperti Postman, cURL, atau aplikasi frontend untuk berinteraksi dengan API ini.

### Endpoint API

#### POST `/books`

Menambahkan buku baru.

**Request Body:**

```json
{
  "name": "Judul Buku",
  "year": 2021,
  "author": "Nama Penulis",
  "summary": "Ringkasan Buku",
  "publisher": "Penerbit",
  "pageCount": 100,
  "readPage": 100
}
```

**Response:**

- **201 Created**
  ```json
  {
    "status": "success",
    "message": "Buku berhasil ditambahkan",
    "data": {
      "bookId": "id_buku"
    }
  }
  ```
- **400 Bad Request**
  ```json
  {
    "status": "fail",
    "message": "Gagal menambahkan buku. Mohon isi nama buku"
  }
  ```

#### PUT `/books/:id`

Memperbarui informasi buku berdasarkan ID.

**Request Body:**

```json
{
  "name": "Judul Buku Baru",
  "year": 2022,
  "author": "Nama Penulis",
  "summary": "Ringkasan Buku Baru",
  "publisher": "Penerbit Baru",
  "pageCount": 150,
  "readPage": 50
}
```

**Response:**

- **200 OK**

  ```json
  {
    "status": "success",
    "message": "Buku berhasil diperbarui"
  }
  ```

- **404 Not Found**

  ```json
  {
    "status": "fail",
    "message": "Gagal memperbarui buku. Id tidak ditemukan"
  }
  ```

#### GET `/books`

Mengambil semua buku. Anda dapat menambahkan query parameter:

- `finished=1` untuk mengambil buku yang telah dibaca
- `finished=0` untuk mengambil buku yang belum dibaca
- `name=query` untuk mencari buku berdasarkan nama

**Response:**

- **200 OK**

  ```json
  {
    "status": "success",
    "data": {
      "books": [
        {
          "id": "id_buku",
          "name": "Judul Buku",
          "publisher": "Penerbit"
        }
      ]
    }
  }
  ```

#### GET `/books/:id`

Mengambil informasi buku berdasarkan ID.

**Response:**

- **200 OK**
  ```json
  {
    "status": "success",
    "data": {
      "book": {
        "id": "id_buku",
        "name": "Judul Buku",
        "year": 2021,
        "author": "Nama Penulis",
        "summary": "Ringkasan Buku",
        "publisher": "Penerbit",
        "pageCount": 100,
        "readPage": 100,
        "finished": true,
        "insertedAt": "2022-01-01T00:00:00.000Z",
        "updatedAt": "2022-01-01T00:00:00.000Z"
      }
    }
  }
  
  ```
- **404 Not Found**

  ```json
  {
    "status": "fail",
    "message": "Buku tidak ditemukan"
  }
  ```

#### DELETE `/books/:id`

Menghapus buku berdasarkan ID.
**Response:**

- **200 OK**

  ```json
  {
    "status": "success",
    "message": "Buku berhasil dihapus"
  }
  ```

- **404 Not Found**

  ```json
  {
    "status": "fail",
    "message": "Buku gagal dihapus. Id tidak ditemukan"
  }
  ```

## Contoh Permintaan dan Respons

Berikut adalah beberapa contoh permintaan menggunakan `curl`.

### 1. Menambahkan Buku

```bash
curl -X POST http://localhost:9000/books -H "Content-Type: application/json" -d '{"name": "Buku Contoh", "year": 2021, "author": "Penulis Contoh", "summary": "Ini adalah contoh buku.", "publisher": "Contoh Penerbit", "pageCount": 200, "readPage": 100}'

```

### 2. Mengambil Semua Buku

```bash
curl -X GET http://localhost:9000/books
```

### 3. Memperbarui Buku

```bash
curl -X PUT http://localhost:9000/books/id_buku -H "Content-Type: application/json" -d '{"name": "Buku Contoh Diperbarui", "year": 2022, "author": "Penulis Contoh", "summary": "Ini adalah contoh buku yang diperbarui.", "publisher": "Contoh Penerbit", "pageCount": 250, "readPage": 150}'

```

### 4. Menghapus Buku

```bash
curl -X DELETE http://localhost:9000/books/id_buku
```

## Penanganan Kesalahan

API ini telah dilengkapi dengan penanganan kesalahan yang baik. Jika terjadi kesalahan dalam permintaan (misalnya, data tidak lengkap, ID tidak ditemukan), server akan mengembalikan kode status HTTP yang sesuai dan respons dalam format JSON yang menjelaskan kesalahan tersebut.

### Penjelasan

- **Judul dan Deskripsi**: Menyediakan nama proyek dan deskripsi singkat tentang apa yang dilakukan oleh API.
- **Daftar Isi**: Mempermudah pembaca untuk menavigasi dokumen.
- **Dokumentasi Fitur dan Persyaratan**: Menjelaskan apa yang bisa dilakukan API dan apa yang dibutuhkan untuk menjalankannya.
- **Instalasi dan Penggunaan**: Langkah demi langkah untuk mempersiapkan dan menjalankan API.
- **Endpoint API**: Merinci endpoint yang tersedia, metode HTTP yang digunakan, dan contoh struktur permintaan serta respons.
- **Contoh Permintaan dan Respons**: Memberikan contoh nyata bagaimana menggunakan API dengan `curl`.
- **Penanganan Kesalahan**: Memberikan informasi tentang bagaimana penanganan kesalahan yang baik.
#
