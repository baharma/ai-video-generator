# AI Video Generator

Laravel + Inertia React application for generating AI video history, script/storyboard data, and Magic Hour video project results.

## Requirements

Recommended setup:

- Docker Desktop
- Docker Compose
- Make, optional but useful

Local setup without Docker needs:

- PHP 8.2+
- Composer 2
- Node.js 22+
- MySQL 8+

## Environment

Copy the example env file:

```bash
cp .env.example .env
```

Set database values:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=video_streaming
DB_USERNAME=root
DB_PASSWORD=your_password
```

Set Magic Hour values:

```env
MAGIC_HOUR_API_KEY=your_magic_hour_api_key
MAGIC_HOUR_API_URL=https://api.magichour.ai/v1
```

Do not commit a real API key.

## GitHub Actions Secrets

For GitHub Actions, keep the Magic Hour key in repository secrets instead of committing it.

Add this repository secret:

```text
MAGIC_HOUR_API_KEY
```

Use this value for the URL in the workflow or repo variables:

```text
MAGIC_HOUR_API_URL=https://api.magichour.ai/v1
```

How to add the secret:

1. Open the GitHub repository.
2. Go to `Settings`.
3. Open `Secrets and variables`.
4. Open `Actions`.
5. Click `New repository secret`.
6. Name it `MAGIC_HOUR_API_KEY`.
7. Paste the Magic Hour key and save.

The workflow file is in `.github/workflows/ci.yml`. It installs PHP and Node dependencies, starts MySQL, runs migrations, runs tests, and builds the frontend.

## Install With Docker

Start the app:

```bash
docker compose up --build
```

Open:

- Laravel app: http://localhost:8000
- Vite dev server: http://localhost:5173
- MySQL host port: `3306`

The Docker entrypoint will automatically:

- create `.env` from `.env.example` if missing
- install Composer dependencies if `vendor` is missing
- generate `APP_KEY` if missing
- wait for MySQL healthcheck through Compose
- run `php artisan migrate --force`
- start Laravel on port `8000`

If local port `3306` is already used:

```bash
DB_FORWARD_PORT=3307 docker compose up --build
```

Inside Docker, the app connects to MySQL using `DB_HOST=mysql`. On your host machine, use `127.0.0.1`.

## Docker Helper Commands

Normal up:

```bash
make docker-up
```

Up with rebuild:

```bash
make docker-up-build
```

Up after pruning Docker build/image cache:

```bash
make docker-up-clean
```

Stop containers:

```bash
make docker-down
```

Prune Docker build/image/container/network cache:

```bash
make docker-prune
```

Reset cache volumes too:

```bash
make docker-reset-cache
```

`docker-reset-cache` removes named Docker volumes, including dependency cache and MySQL data.

## Local Install Without Docker

Install dependencies:

```bash
composer install
npm install
```

Generate app key:

```bash
php artisan key:generate
```

Run migrations:

```bash
php artisan migrate
```

Start Laravel:

```bash
php artisan serve
```

Start Vite:

```bash
npm run dev
```

Open http://localhost:8000.

## How To Use

1. Register or login.
2. Open `Create Video`.
3. Fill video type, topic, keywords, target audience, tone, and duration.
4. Keep `Submit to Magic Hour` enabled if you want a real Magic Hour video project.
5. Click `Generate`.
6. The app saves:
   - user input
   - generated script/storyboard
   - scene records
   - Magic Hour submit response
   - Magic Hour project response
   - usage logs
   - lifecycle events
7. Open the generation detail page.
8. If Magic Hour status is `queued` or `processing`, the page refreshes status every 5 seconds.
9. When Magic Hour returns `complete`, the app stores the video URL and marks the generation as `completed`.

## Main Pages

- `/dashboard`
- `/generations`
- `/generations/create`
- `/generations/{id}`

## Magic Hour Flow

Submit text-to-video:

```text
POST https://api.magichour.ai/v1/text-to-video
```

Fetch project:

```text
GET https://api.magichour.ai/v1/video-projects/{id}
```

Status handling:

- `queued` means loading
- `processing` means loading
- `complete` becomes app status `completed`
- `failed`, `error`, or `canceled` becomes app status `failed`

The video download URL from Magic Hour is temporary. The app stores:

- `video_url`
- `video_url_expires_at`
- `downloads`
- `download`

## Database Tables

Core tables:

- `video_generations`
- `video_generation_scenes`
- `ai_usage_logs`
- `video_generation_events`

Laravel default tables are also used for users, sessions, cache, and queue jobs.

## Useful Artisan Commands

Run migrations:

```bash
php artisan migrate
```

Rollback last migration batch:

```bash
php artisan migrate:rollback
```

Clear config/cache:

```bash
php artisan optimize:clear
```

Run tests:

```bash
php artisan test
```

With Docker:

```bash
docker compose exec app php artisan migrate
docker compose exec app php artisan optimize:clear
docker compose exec app php artisan test
```

## Troubleshooting

If MySQL port is already used:

```bash
DB_FORWARD_PORT=3307 docker compose up --build
```

If app cannot connect to MySQL inside Docker, check that app uses:

```env
DB_HOST=mysql
```

The Compose file already overrides this for the app container.

If Vite does not reload from Docker, restart the Vite service:

```bash
docker compose restart vite
```

If Docker cache grows too large:

```bash
make docker-prune
```
