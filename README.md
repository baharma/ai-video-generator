# AI Video Generator

Dokumentasi ini menjelaskan aplikasi **AI Video Generator**, sebuah aplikasi Laravel + Inertia React untuk membuat naskah video, storyboard, dan proyek video text-to-video melalui Magic Hour.

## Daftar Isi

- [Ringkasan](#ringkasan)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Kebutuhan Sistem](#kebutuhan-sistem)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Instalasi Dengan Docker](#instalasi-dengan-docker)
- [Instalasi Lokal Tanpa Docker](#instalasi-lokal-tanpa-docker)
- [Alur Penggunaan](#alur-penggunaan)
- [Halaman Aplikasi](#halaman-aplikasi)
- [Route Aplikasi](#route-aplikasi)
- [Alur Generasi Video](#alur-generasi-video)
- [Integrasi Magic Hour](#integrasi-magic-hour)
- [Status Lifecycle](#status-lifecycle)
- [Validasi Input](#validasi-input)
- [Struktur Database](#struktur-database)
- [Model dan Relasi](#model-dan-relasi)
- [Frontend React](#frontend-react)
- [Testing dan Build](#testing-dan-build)
- [CI GitHub Actions](#ci-github-actions)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Catatan Keamanan](#catatan-keamanan)

## Ringkasan

AI Video Generator membantu user membuat aset video dari satu input ide. Aplikasi menyimpan input user, membangun naskah dan storyboard lokal, lalu opsional mengirim prompt final ke Magic Hour untuk membuat proyek video.

Output utama aplikasi:

- Judul video.
- Ringkasan konsep.
- Script atau naskah.
- Call to action.
- Storyboard per scene.
- Prompt text-to-video.
- Status proyek Magic Hour.
- URL video hasil render jika tersedia.
- Log penggunaan API.
- Event lifecycle setiap generation.

Aplikasi memakai autentikasi Laravel Breeze. Setiap user hanya dapat melihat dan mengelola generation miliknya sendiri.

## Fitur Utama

- Register, login, logout, verifikasi email, reset password, dan edit profile.
- Dashboard berisi total generation, completed generation, processing generation, dan daftar generation terbaru.
- Form pembuatan video dengan pilihan:
  - video type,
  - topic,
  - keywords,
  - target audience,
  - tone,
  - duration,
  - custom Magic Hour prompt,
  - Magic Hour project name,
  - model,
  - resolution,
  - aspect ratio,
  - audio.
- Mode script/storyboard only tanpa submit ke Magic Hour.
- Submit text-to-video ke Magic Hour.
- Auto refresh status Magic Hour setiap 5 detik pada detail generation.
- Manual refresh status Magic Hour.
- Preview video jika `video_url` sudah tersedia.
- Fallback preview storyboard jika video belum tersedia.
- Export script ke file `.txt`.
- Delete generation.
- Penyimpanan raw response provider untuk audit/debugging.
- Usage log untuk setiap request Magic Hour.
- Event log untuk perubahan status generation.

## Tech Stack

Backend:

- PHP 8.2+.
- Laravel 12.
- Laravel Breeze.
- Inertia Laravel.
- MySQL 8+.
- Laravel HTTP Client.
- PHPUnit.

Frontend:

- React 18.
- Inertia React 2.
- Vite 7.
- Tailwind CSS 3.
- Headless UI.
- Axios.
- Ziggy route helper.

Infrastructure:

- Docker Compose.
- PHP 8.3 CLI container.
- MySQL 8.4 container.
- Node 22 container untuk Vite.
- GitHub Actions CI.

## Struktur Proyek

Direktori penting:

| Path | Fungsi |
| --- | --- |
| `app/Http/Controllers` | Controller untuk dashboard, profile, auth, dan video generation. |
| `app/Http/Requests` | Form request dan validasi input. |
| `app/Models` | Model Eloquent untuk user, generation, scene, event, dan usage log. |
| `app/Service` | Wrapper service untuk request HTTP ke Magic Hour. |
| `config/services.php` | Konfigurasi credential dan base URL Magic Hour. |
| `database/migrations` | Definisi tabel aplikasi. |
| `resources/js/Pages` | Halaman React yang dirender melalui Inertia. |
| `resources/js/Components/App` | Komponen UI aplikasi untuk halaman generation dan dashboard. |
| `routes/web.php` | Route web utama. |
| `docker` | Script entrypoint Docker. |
| `.github/workflows/ci.yml` | Pipeline test dan build. |

## Kebutuhan Sistem

Rekomendasi paling sederhana:

- Docker Desktop.
- Docker Compose.
- Make, opsional.

Jika menjalankan tanpa Docker:

- PHP 8.2 atau lebih baru.
- Composer 2.
- Node.js 22 atau versi kompatibel.
- npm.
- MySQL 8 atau lebih baru.
- Extension PHP yang umum dipakai Laravel, termasuk `bcmath`, `intl`, `mbstring`, `pdo_mysql`, dan `zip`.

## Konfigurasi Environment

Salin file environment:

```bash
cp .env.example .env
```

Konfigurasi database lokal:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=video_streaming
DB_USERNAME=root
DB_PASSWORD=your_password
```

Konfigurasi Magic Hour:

```env
MAGIC_HOUR_API_KEY=your_magic_hour_api_key
MAGIC_HOUR_API_URL=https://api.magichour.ai/v1
```

Konfigurasi aplikasi lokal yang umum:

```env
APP_NAME="AI Video Generator"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

Jangan commit API key asli ke repository.

## Instalasi Dengan Docker

Jalankan:

```bash
docker compose up --build
```

URL default:

- Laravel app: `http://localhost:8000`
- Vite dev server: `http://localhost:5173`
- MySQL host port: `3306`

Service Docker:

| Service | Fungsi |
| --- | --- |
| `app` | Container PHP 8.3, menjalankan Laravel pada port `8000`. |
| `mysql` | Database MySQL 8.4. |
| `vite` | Node 22 untuk Vite dev server pada port `5173`. |

Entrypoint container `app` akan:

- membuat `.env` dari `.env.example` jika belum ada,
- membuat direktori storage/cache yang diperlukan,
- membuat database SQLite jika `.env` memakai SQLite,
- menjalankan `composer install` jika `vendor` belum ada,
- membuat `APP_KEY` jika belum ada,
- menjalankan `php artisan storage:link`,
- menjalankan migration jika `RUN_MIGRATIONS=true`,
- menjalankan `php artisan serve --host=0.0.0.0 --port=8000`.

Jika port MySQL `3306` sudah dipakai:

```bash
DB_FORWARD_PORT=3307 docker compose up --build
```

Di dalam Docker, Laravel memakai host database `mysql`. Dari host machine, gunakan `127.0.0.1`.

## Docker Helper Commands

Command Makefile:

```bash
make docker-up
make docker-up-build
make docker-up-clean
make docker-down
make docker-prune
make docker-reset-cache
```

Penjelasan:

| Command | Fungsi |
| --- | --- |
| `make docker-up` | Menjalankan `docker compose up`. |
| `make docker-up-build` | Menjalankan container dengan rebuild image. |
| `make docker-up-clean` | Menjalankan helper `docker/up-clean.sh`. |
| `make docker-down` | Menghentikan container dan orphan container. |
| `make docker-prune` | Membersihkan builder cache, image, container, dan network tidak terpakai. |
| `make docker-reset-cache` | Sama seperti prune, tetapi juga menghapus volume termasuk data MySQL dan cache dependency. |

Hati-hati dengan `make docker-reset-cache` karena volume database akan ikut terhapus.

## Instalasi Lokal Tanpa Docker

Install dependency PHP:

```bash
composer install
```

Install dependency frontend:

```bash
npm install
```

Generate app key:

```bash
php artisan key:generate
```

Jalankan migration:

```bash
php artisan migrate
```

Jalankan Laravel:

```bash
php artisan serve
```

Jalankan Vite di terminal lain:

```bash
npm run dev
```

Buka:

```text
http://localhost:8000
```

Alternatif untuk menjalankan beberapa proses development sekaligus:

```bash
composer run dev
```

Script `composer run dev` menjalankan Laravel server, queue listener, log pail, dan Vite secara paralel.

## Alur Penggunaan

1. User register atau login.
2. User masuk ke dashboard.
3. User membuka `Create Video`.
4. User mengisi topic, keywords, target audience, tone, duration, dan pilihan Magic Hour.
5. User dapat mengisi custom prompt atau membiarkannya kosong.
6. Aplikasi membuat story plan lokal:
   - title,
   - summary,
   - script,
   - CTA,
   - 3 scene storyboard.
7. Aplikasi menyimpan generation dan scene ke database.
8. Jika `Submit to Magic Hour` aktif, aplikasi mengirim prompt ke endpoint Magic Hour.
9. Jika Magic Hour mengembalikan project id, aplikasi menyimpan provider project id dan status provider.
10. Aplikasi mengambil detail awal project dari Magic Hour.
11. User diarahkan ke detail generation.
12. Detail page melakukan auto refresh setiap 5 detik selama project masih pending.
13. Jika Magic Hour selesai, aplikasi menyimpan `video_url`, metadata download, biaya frame, dan credit.
14. User dapat menonton video, export script, refresh manual, atau menghapus generation.

## Halaman Aplikasi

| Halaman | Path | Deskripsi |
| --- | --- | --- |
| Welcome | `/` | Landing sederhana untuk login/register. |
| Dashboard | `/dashboard` | Statistik dan generation terbaru milik user. |
| Generation History | `/generations` | Daftar generation dengan filter search dan video type. |
| Create Video | `/generations/create` | Form pembuatan script/storyboard dan submit Magic Hour. |
| Generation Detail | `/generations/{id}` | Detail script, storyboard, video preview, event log, dan usage log. |
| Profile | `/profile` | Edit profile, update password, dan delete account. |

## Route Aplikasi

Route utama ada di `routes/web.php`.

| Method | Route | Name | Auth | Fungsi |
| --- | --- | --- | --- | --- |
| `GET` | `/` | - | Tidak | Welcome page. |
| `GET` | `/dashboard` | `dashboard` | Ya | Dashboard user. |
| `GET` | `/generations` | `generations.index` | Ya | List generation user. |
| `GET` | `/generations/create` | `generations.create` | Ya | Form create video. |
| `POST` | `/generations` | `generations.store` | Ya | Simpan generation dan submit Magic Hour jika aktif. |
| `GET` | `/generations/{generation}` | `generations.show` | Ya | Detail generation. |
| `DELETE` | `/generations/{generation}` | `generations.destroy` | Ya | Hapus generation. |
| `POST` | `/generations/{generation}/refresh` | `generations.refresh` | Ya | Ambil ulang status Magic Hour. |
| `GET` | `/generations/{generation}/export` | `generations.export` | Ya | Download script dalam format `.txt`. |
| `GET` | `/profile` | `profile.edit` | Ya | Edit profile. |
| `PATCH` | `/profile` | `profile.update` | Ya | Update profile. |
| `DELETE` | `/profile` | `profile.destroy` | Ya | Delete account. |

Route auth lain dimuat dari `routes/auth.php`.

## Alur Generasi Video

Controller utama:

```text
app/Http/Controllers/VideoGenerationController.php
```

Method penting:

| Method | Tanggung jawab |
| --- | --- |
| `index` | Menampilkan generation milik user, dengan filter `search` dan `video_type`. |
| `create` | Mengirim option dan default form ke halaman React. |
| `store` | Validasi input, buat story plan, simpan generation, submit Magic Hour, simpan response. |
| `show` | Menampilkan detail generation, usage logs, dan lifecycle events. |
| `refresh` | Fetch ulang Magic Hour project dan update generation. |
| `export` | Membuat response text/plain berisi title, summary, script, CTA, dan video URL. |
| `destroy` | Mencatat event delete lalu menghapus generation. |

Story plan lokal dibuat oleh `buildStoryPlan`. Implementasi saat ini membuat 3 scene:

| Scene | Isi |
| --- | --- |
| 1 | Opening hook tentang topic. |
| 2 | Key benefits dan konteks berdasarkan keywords. |
| 3 | Closing dengan action atau transformation. |

Jika user tidak mengisi custom prompt, aplikasi membangun prompt dengan `buildVideoPrompt` dari summary, tone, audience, keywords, script, dan scene breakdown.

## Integrasi Magic Hour

Service utama:

```text
app/Service/VideoApiServiceApi/VideoApiServiceApiImplement.php
app/Service/BaseServiceApi/BaseServiceApiImplement.php
```

Binding service container:

```text
app/Providers/AppServiceProvider.php
```

Konfigurasi:

```text
config/services.php
```

Environment:

```env
MAGIC_HOUR_API_KEY=your_magic_hour_api_key
MAGIC_HOUR_API_URL=https://api.magichour.ai/v1
```

Endpoint yang digunakan:

| Action | Method | Endpoint |
| --- | --- | --- |
| Submit text-to-video | `POST` | `/text-to-video` |
| Fetch video project | `GET` | `/video-projects/{id}` |

Payload submit text-to-video:

```json
{
  "name": "Generated Video",
  "end_seconds": 30,
  "resolution": "720p",
  "model": "ltx-2",
  "aspect_ratio": "16:9",
  "audio": false,
  "style": {
    "prompt": "Prompt final dari script/storyboard"
  }
}
```

Field `aspect_ratio` hanya dikirim jika ada. Field `audio` dikirim jika key tersedia di options.

Base service akan menambahkan header:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <MAGIC_HOUR_API_KEY>
```

Setiap request Magic Hour menghasilkan metadata:

- `successful`
- `status`
- `data`
- `error_message`
- `duration_ms`
- `endpoint`
- `http_method`
- `request_payload`

Metadata ini dipakai untuk memperbarui generation dan membuat record `ai_usage_logs`.

## Status Lifecycle

Status aplikasi disimpan di kolom `video_generations.status`.

| Status | Arti |
| --- | --- |
| `draft` | Default database, sebelum generation diproses. |
| `generating_script` | Generation baru dibuat dan script/storyboard sedang diproses. |
| `script_generated` | Script dan storyboard sudah tersimpan. Ini bisa menjadi status akhir jika submit video dimatikan. |
| `video_submitted` | Status pending yang dikenali UI/statistik untuk submission ke provider. |
| `video_processing` | Project provider sedang queued atau processing. |
| `completed` | Provider selesai dan video URL tersedia atau project selesai. |
| `failed` | Provider gagal atau aplikasi mendapat error saat proses. |

Mapping status Magic Hour ke status aplikasi:

| Provider status | App status |
| --- | --- |
| `complete` | `completed` |
| `failed` | `failed` |
| `error` | `failed` |
| `canceled` | `failed` |
| Status lain atau kosong | `video_processing` |

Event lifecycle disimpan di `video_generation_events`.

Event yang saat ini dapat dibuat:

| Event | Kapan terjadi |
| --- | --- |
| `generation_created` | Generation pertama kali dibuat. |
| `script_generation_completed` | Story plan lokal selesai dan scene tersimpan. |
| `video_submission_started` | Aplikasi mulai submit ke Magic Hour. |
| `video_submitted` | Magic Hour mengembalikan project id. |
| `video_processing` | Fetch project menunjukkan video masih berjalan. |
| `video_completed` | Provider status menjadi `complete`. |
| `video_failed` | Submit atau fetch provider gagal. |
| `download_url_saved` | Download URL dari provider disimpan. |
| `generation_deleted` | User menghapus generation. |

## Validasi Input

Validasi request ada di:

```text
app/Http/Requests/StoreVideoGenerationRequest.php
```

Rules:

| Field | Rule | Catatan |
| --- | --- | --- |
| `video_type` | nullable string max 120 | Contoh: Marketing Video. |
| `topic` | required string max 2000 | Ide utama video. |
| `keywords` | nullable string max 2000 | Kata kunci untuk script/storyboard. |
| `target_audience` | nullable string max 255 | Target penonton. |
| `tone` | nullable string max 120 | Tone komunikasi. |
| `duration` | nullable string max 120 | UI menyediakan 5, 10, 15, dan 30 detik. |
| `prompt` | nullable string max 5000 | Custom prompt untuk Magic Hour. |
| `submit_video` | boolean | Default `true`. |
| `name` | nullable string max 255 | Nama project Magic Hour. |
| `model` | nullable enum | Model Magic Hour yang diizinkan. |
| `resolution` | nullable enum | `480p`, `720p`, atau `1080p`. |
| `aspect_ratio` | nullable enum | `16:9`, `9:16`, atau `1:1`. |
| `audio` | boolean | Default `false`. |

Model yang diizinkan:

```text
default
ltx-2
wan-2.2
seedance
seedance-2.0
kling-2.5
kling-3.0
veo3.1
veo3.1-lite
sora-2
```

Helper durasi menerima angka 1 sampai 10, 15, 20, 25, atau 30. Nilai di luar daftar tersebut akan fallback ke 30 detik.

## Struktur Database

Tabel utama aplikasi:

- `video_generations`
- `video_generation_scenes`
- `ai_usage_logs`
- `video_generation_events`

Laravel default tables juga digunakan untuk:

- `users`
- `sessions`
- `cache`
- `jobs`

### `video_generations`

Menyimpan generation utama, input user, output script/storyboard, metadata provider, status, dan raw response.

Kolom penting:

| Kolom | Fungsi |
| --- | --- |
| `user_id` | Owner generation. |
| `video_type` | Jenis video. |
| `topic` | Ide utama. |
| `keywords` | Kata kunci. |
| `target_audience` | Target audience. |
| `tone` | Tone komunikasi. |
| `duration` | Durasi request. |
| `prompt` | Prompt final untuk provider. |
| `title` | Judul hasil story plan. |
| `summary` | Ringkasan video. |
| `script` | Naskah video. |
| `cta` | Call to action. |
| `scenes` | JSON fallback scene. |
| `raw_ai_response` | Response lokal/template story plan. |
| `script_provider` | Provider script, saat ini `local_template`. |
| `video_provider` | Provider video, saat ini `magic_hour` jika submit aktif. |
| `provider_project_id` | ID project dari Magic Hour. |
| `provider_project_name` | Nama project provider. |
| `provider_project_type` | Tipe project provider. |
| `provider_status` | Status asli dari provider. |
| `provider_created_at` | Timestamp project provider. |
| `video_url` | URL video hasil provider. |
| `video_url_expires_at` | Waktu kedaluwarsa URL video. |
| `downloads` | JSON list download dari provider. |
| `download` | JSON download utama. |
| `width`, `height`, `fps` | Metadata video. |
| `start_seconds`, `end_seconds` | Range waktu project. |
| `estimated_frame_cost` | Estimasi frame cost dari submit response. |
| `total_frame_cost` | Total frame cost dari project response. |
| `credits_charged` | Credit yang dipakai provider. |
| `status` | Status aplikasi. |
| `error_message` | Pesan error terakhir. |
| `raw_video_submit_response` | Raw response submit Magic Hour. |
| `raw_video_project_response` | Raw response fetch project Magic Hour. |
| `deleted_at` | Soft delete. |

### `video_generation_scenes`

Menyimpan scene storyboard secara terpisah.

Kolom penting:

| Kolom | Fungsi |
| --- | --- |
| `video_generation_id` | Relasi ke generation. |
| `scene_number` | Nomor scene. |
| `duration` | Label durasi, contoh `0-10s`. |
| `start_seconds` | Waktu mulai scene. |
| `end_seconds` | Waktu akhir scene. |
| `visual` | Arahan visual. |
| `voice_over` | Narasi voice over. |
| `text_overlay` | Teks overlay. |
| `image_prompt` | Prompt image/visual. |
| `image_url` | URL image jika suatu saat tersedia. |
| `video_clip_url` | URL clip jika suatu saat tersedia. |
| `metadata` | JSON tambahan. |

### `ai_usage_logs`

Menyimpan audit request provider.

Kolom penting:

| Kolom | Fungsi |
| --- | --- |
| `user_id` | User yang memicu request. |
| `video_generation_id` | Generation terkait. |
| `provider` | Provider, saat ini `magic_hour`. |
| `action` | `submit_video` atau `fetch_video_project`. |
| `model` | Model provider. |
| `endpoint` | Endpoint provider. |
| `http_method` | Method HTTP. |
| `http_status` | Status HTTP provider. |
| `success` | Boolean berhasil/gagal. |
| `request_payload` | Payload request. |
| `response_payload` | Payload response. |
| `error_message` | Pesan error jika ada. |
| `estimated_frame_cost` | Estimasi cost. |
| `total_frame_cost` | Total cost. |
| `credits_charged` | Credit provider. |
| `duration_ms` | Durasi request dalam ms. |

### `video_generation_events`

Menyimpan riwayat perubahan lifecycle.

Kolom penting:

| Kolom | Fungsi |
| --- | --- |
| `video_generation_id` | Generation terkait. |
| `user_id` | User yang memicu event, bisa null. |
| `event_type` | Nama event. |
| `from_status` | Status sebelumnya. |
| `to_status` | Status tujuan. |
| `message` | Pesan tambahan atau error. |
| `metadata` | JSON metadata. |
| `raw_payload` | Raw payload terkait event. |

## Model dan Relasi

Model utama:

| Model | Tabel | Relasi |
| --- | --- | --- |
| `User` | `users` | has many `VideoGeneration`. |
| `VideoGeneration` | `video_generations` | belongs to `User`, has many `VideoGenerationScene`, `AiUsageLog`, dan `VideoGenerationEvent`. |
| `VideoGenerationScene` | `video_generation_scenes` | belongs to `VideoGeneration`. |
| `AiUsageLog` | `ai_usage_logs` | belongs to `User`, belongs to `VideoGeneration`. |
| `VideoGenerationEvent` | `video_generation_events` | belongs to `User`, belongs to `VideoGeneration`. |

Helper penting pada `VideoGeneration`:

| Method | Fungsi |
| --- | --- |
| `isDraft()` | Mengecek status `draft`. |
| `isGeneratingScript()` | Mengecek status `generating_script`. |
| `isScriptGenerated()` | Mengecek status `script_generated`. |
| `isVideoSubmitted()` | Mengecek status `video_submitted`. |
| `isVideoProcessing()` | Mengecek status `video_processing`. |
| `isCompleted()` | Mengecek status `completed`. |
| `isFailed()` | Mengecek status `failed`. |
| `hasVideo()` | Mengecek apakah `video_url` ada. |
| `hasProviderProject()` | Mengecek apakah `provider_project_id` ada. |
| `isVideoUrlExpired()` | Mengecek apakah URL video sudah kedaluwarsa. |

## Frontend React

Entry point frontend:

```text
resources/js/app.jsx
```

Layout:

| Path | Fungsi |
| --- | --- |
| `resources/js/Layouts/AuthenticatedLayout.jsx` | Layout halaman yang butuh login. |
| `resources/js/Layouts/GuestLayout.jsx` | Layout auth/guest. |

Halaman utama:

| Path | Fungsi |
| --- | --- |
| `resources/js/Pages/Dashboard.jsx` | Dashboard user. |
| `resources/js/Pages/Generations/Index.jsx` | History generation, search, filter, pagination. |
| `resources/js/Pages/Generations/Create.jsx` | Form create video. |
| `resources/js/Pages/Generations/Show.jsx` | Detail generation, preview, polling, event log, usage log. |
| `resources/js/Pages/Profile/Edit.jsx` | Profile user. |
| `resources/js/Pages/Auth/*` | Login, register, reset password, dan auth flow. |

Komponen aplikasi:

| Komponen | Fungsi |
| --- | --- |
| `PageHeader` | Header konten halaman. |
| `Card` | Container UI. |
| `StatCard` | Kartu statistik dashboard. |
| `GenerationTable` | Tabel generation. |
| `SceneCard` | Tampilan per scene storyboard. |
| `VideoPreview` | Preview storyboard saat video belum tersedia. |
| `MetadataBadge` | Badge metadata/status. |
| `FormGroup` | Wrapper label, input, dan error. |
| `TextInput`, `TextArea`, `SelectInput` | Input form aplikasi. |
| `PrimaryButton`, `SecondaryButton`, `DangerButton` | Tombol aplikasi. |
| `FlashMessage` | Tampilan pesan session flash. |
| `EmptyState` | Tampilan saat data kosong. |

Detail page menggunakan polling:

```text
POST /generations/{generation}/refresh
```

Polling berjalan setiap 5 detik jika:

- generation memiliki `provider_project_id`,
- status aplikasi `video_submitted` atau `video_processing`,
- provider status belum selesai/gagal/canceled,
- auto refresh tidak sedang dipause user.

## Testing dan Build

Jalankan test Laravel:

```bash
php artisan test
```

Atau melalui Composer:

```bash
composer test
```

Build frontend:

```bash
npm run build
```

Development frontend:

```bash
npm run dev
```

Clear cache Laravel:

```bash
php artisan optimize:clear
```

Jalankan migration:

```bash
php artisan migrate
```

Rollback migration batch terakhir:

```bash
php artisan migrate:rollback
```

Command di dalam container:

```bash
docker compose exec app php artisan migrate
docker compose exec app php artisan optimize:clear
docker compose exec app php artisan test
docker compose exec vite npm run build
```

## CI GitHub Actions

Workflow:

```text
.github/workflows/ci.yml
```

Trigger:

- push ke `main`,
- push ke `master`,
- pull request.

Pipeline melakukan:

1. Checkout repository.
2. Setup PHP 8.3.
3. Setup Node 22.
4. Menjalankan MySQL 8.4 service.
5. Install Composer dependencies.
6. Install npm dependencies dengan `npm ci`.
7. Membuat `.env` dari `.env.example`.
8. Generate `APP_KEY`.
9. Clear config.
10. Run migration.
11. Run test.
12. Build frontend.

Secret yang diperlukan:

```text
MAGIC_HOUR_API_KEY
```

Tambahkan secret di GitHub:

1. Buka repository GitHub.
2. Masuk ke `Settings`.
3. Buka `Secrets and variables`.
4. Pilih `Actions`.
5. Klik `New repository secret`.
6. Isi nama `MAGIC_HOUR_API_KEY`.
7. Simpan API key Magic Hour.

Workflow menggunakan:

```env
MAGIC_HOUR_API_URL=https://api.magichour.ai/v1
```

## Deployment

Checklist deployment umum:

1. Set environment production.
2. Set database production.
3. Set `MAGIC_HOUR_API_KEY`.
4. Set `APP_KEY`.
5. Set `APP_URL`.
6. Set `ASSET_URL` jika asset dilayani dari domain tertentu.
7. Jalankan `composer install --no-dev --optimize-autoloader`.
8. Jalankan `npm ci`.
9. Jalankan `npm run build`.
10. Jalankan `php artisan migrate --force`.
11. Jalankan `php artisan storage:link`.
12. Jalankan `php artisan optimize`.
13. Pastikan web server mengarah ke folder `public`.

Contoh environment production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.example
ASSET_URL=https://your-domain.example
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=video_streaming
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
MAGIC_HOUR_API_KEY=your_magic_hour_api_key
MAGIC_HOUR_API_URL=https://api.magichour.ai/v1
```

Jika memakai Docker Compose bawaan repository, perhatikan bahwa `docker-compose.yml` saat ini mengatur:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://video-ai.baharma.my.id
ASSET_URL=https://video-ai.baharma.my.id
VITE_APP_URL=https://video-ai.baharma.my.id
```

Sesuaikan nilai tersebut jika domain deployment berbeda.

## Troubleshooting

### MySQL port sudah dipakai

Gunakan port host lain:

```bash
DB_FORWARD_PORT=3307 docker compose up --build
```

### Laravel di Docker tidak bisa connect ke database

Pastikan container app memakai:

```env
DB_HOST=mysql
```

Compose file sudah mengatur ini untuk service `app`.

### Host machine tidak bisa connect ke MySQL Docker

Dari host machine gunakan:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
```

Jika `DB_FORWARD_PORT=3307`, gunakan:

```env
DB_PORT=3307
```

### Vite tidak reload

Restart service Vite:

```bash
docker compose restart vite
```

### Dependency frontend tidak sinkron

Jalankan ulang install:

```bash
npm install
```

Atau di Docker:

```bash
docker compose exec vite npm install
```

### Cache Laravel bermasalah

Clear cache:

```bash
php artisan optimize:clear
```

Atau:

```bash
docker compose exec app php artisan optimize:clear
```

### Migration gagal

Cek koneksi database dan jalankan:

```bash
php artisan migrate
```

Di Docker:

```bash
docker compose exec app php artisan migrate
```

### Magic Hour request gagal

Periksa:

- `MAGIC_HOUR_API_KEY` sudah benar.
- `MAGIC_HOUR_API_URL` benar.
- Server dapat mengakses internet.
- Response error tersimpan di `ai_usage_logs.error_message`.
- Raw response tersimpan di `ai_usage_logs.response_payload` dan `video_generations.raw_video_*_response`.

### Video URL tidak bisa dibuka

Magic Hour download URL dapat bersifat sementara. Cek:

- `video_url_expires_at`,
- `download`,
- `downloads`,
- provider status terbaru melalui tombol `Refresh Status`.

### Docker cache terlalu besar

Prune cache:

```bash
make docker-prune
```

Jika ingin reset semua cache dan data volume:

```bash
make docker-reset-cache
```

Perintah reset cache akan menghapus data MySQL volume.

## Catatan Keamanan

- Jangan commit `.env` yang berisi credential asli.
- Simpan `MAGIC_HOUR_API_KEY` di secret manager atau GitHub Actions Secrets.
- Raw request dan response provider disimpan untuk debugging. Pastikan data yang dikirim user memang boleh disimpan.
- `VideoGenerationController` memakai pengecekan owner manual melalui `authorizeOwner`, sehingga user tidak dapat melihat atau menghapus generation milik user lain.
- Download URL dari provider bisa kedaluwarsa. Jangan anggap `video_url` sebagai asset permanen kecuali sudah dipindahkan ke storage milik aplikasi.
- Di production, gunakan `APP_DEBUG=false`.
- Pastikan koneksi database production tidak memakai credential default.

## Ringkasan File Penting

| File | Peran |
| --- | --- |
| `routes/web.php` | Definisi route web dan middleware auth. |
| `app/Http/Controllers/VideoGenerationController.php` | Orkestrasi fitur generation. |
| `app/Http/Requests/StoreVideoGenerationRequest.php` | Validasi form create video. |
| `app/Service/VideoApiServiceApi/VideoApiServiceApiImplement.php` | Integrasi Magic Hour. |
| `app/Service/BaseServiceApi/BaseServiceApiImplement.php` | HTTP client wrapper dan metadata response. |
| `app/Models/VideoGeneration.php` | Model utama generation. |
| `database/migrations/2026_04_29_000000_create_video_generations_table.php` | Schema generation. |
| `resources/js/Pages/Generations/Create.jsx` | UI create video. |
| `resources/js/Pages/Generations/Show.jsx` | UI detail, polling, preview, logs. |
| `resources/js/Pages/Generations/Index.jsx` | UI history, search, filter. |
| `docker-compose.yml` | Orkestrasi app, MySQL, dan Vite. |
| `.github/workflows/ci.yml` | CI test dan build. |
