# MOJANG — Monitoring JTM ULP Samboja

MOJANG adalah aplikasi operasional berbasis web untuk memantau pelanggan tegangan menengah, beban penyulang, kondisi gardu/kubikel, dan rekap pelaporan ULP Samboja. Aplikasi ini dibangun ulang dari prototipe Google Apps Script dan workbook `DB_MOJANG_SAMBOJA.xlsx` menjadi Next.js + Supabase.

## Fitur

- Dashboard beban siang/malam untuk enam penyulang.
- Database pelanggan TM dengan pencarian, filter, pagination, tambah, edit, dan hapus.
- Ringkasan serta log inspeksi dengan prioritas kondisi otomatis.
- Laporan operasional siap cetak/PDF dan ekspor Excel.
- Supabase Auth untuk akun Admin dan Staff.
- Row Level Security, audit log, trigger `updated_at`, dan Supabase Realtime.
- Antarmuka responsif dengan motion, ikon isometrik 2D, dan visual emboss.

## Menjalankan secara lokal

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Tanpa environment variable Supabase, aplikasi otomatis berjalan dalam mode preview lokal dengan 19 baris data sumber. Untuk mode produksi, isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Menyiapkan Supabase

1. Buat project Supabase baru.
2. Jalankan `supabase/schema.sql` melalui SQL Editor.
3. Jalankan `supabase/seed.sql` untuk mengimpor 19 pelanggan dari workbook sumber.
4. Buat user `admin@mojang.local` dan `staff@mojang.local` melalui Authentication.
5. Pastikan profil `admin` memiliki role `Admin`; profil lainnya menggunakan role `Staff`.

Schema sudah mencakup RLS sehingga hanya user terautentikasi yang bisa membaca/menulis data, sedangkan penghapusan dibatasi untuk Admin.

## Deploy ke Vercel

Import repository ini sebagai project Next.js, lalu tambahkan tiga environment variable yang sama pada semua environment. Build command menggunakan `pnpm build` dan output terdeteksi otomatis oleh Vercel.

## Sumber data

Seed produksi ditransformasikan dari sheet `Pelanggan` pada `DB_MOJANG_SAMBOJA.xlsx`. Password hash dan riwayat login dari workbook lama tidak diimpor; autentikasi dikelola ulang oleh Supabase Auth.
