# LankaPulse AI 🇱🇰

### AI-Powered Sri Lankan News Aggregation & Intelligence Platform

LankaPulse AI is a full-stack news intelligence platform that collects, categorizes, summarizes, and analyzes Sri Lankan news from multiple permitted public sources through a centralized dashboard.

Powered by AI-assisted classification, summarization, duplicate detection, and relevance scoring, the platform helps users discover important news and follow developing stories more efficiently.

## 🌐 Live Applications

| Platform | Link |
|---|---|
| Frontend | [lanka-pulse-ai.vercel.app](https://lanka-pulse-ai.vercel.app/) |
| Backend | [lankapulse-ai.onrender.com](https://lankapulse-ai.onrender.com) |
| Facebook Page | [LankaPulse AI](https://web.facebook.com/profile.php?id=61596601900604) |
| GitHub Repository | [NipunaSudesh/LankaPulse-AI](https://github.com/NipunaSudesh/LankaPulse-AI) |

## ✨ Key Features

- **Multi-Source News Aggregation:** Collect news from public APIs and permitted RSS feeds.
- **AI-Powered Classification:** Automatically categorize news into relevant topics.
- **Intelligent Summarization:** Generate concise summaries of news articles.
- **AI Relevance Scoring:** Evaluate and prioritize important news.
- **Duplicate Detection:** Identify duplicate and similar news articles.
- **News Search & Filtering:** Search articles by keywords, categories, sources, and dates.
- **News Intelligence Dashboard:** Explore news trends and developing stories.
- **Bilingual Content Support:** Support for English and Sinhala news content.
- **Admin Dashboard:** Manage articles, review AI analysis, and monitor publishing activity.
- **Facebook Integration:** Support automated and controlled Facebook Page publishing.
- **Responsive Design:** Accessible across desktop and mobile devices.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Laravel 12, PHP 8.2 |
| Database | TiDB Cloud (MySQL-compatible) |
| AI Integration | Google Gemini |
| API Architecture | REST API |
| Authentication | Laravel Sanctum |
| News Integration | News APIs, RSS Feeds |
| Social Media | Facebook Graph API |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Automation | GitHub Actions |
| Version Control | Git, GitHub |

## 🏗️ System Architecture

LankaPulse AI follows a separated frontend and backend architecture within a single GitHub monorepo.

```text
             NEWS SOURCES
          APIs and RSS Feeds
                  |
                  v
          LARAVEL BACKEND
               Render
                  |
       +----------+----------+
       |          |          |
   Collection   AI Analysis  Processing
       |          |          |
       +----------+----------+
                  |
                  v
             TiDB CLOUD
           MySQL Database
                  |
                  v
             REST API
                  |
                  v
           NEXT.JS FRONTEND
                Vercel
                  |
          Public News Dashboard

          GITHUB ACTIONS
                  |
          Laravel Scheduler
                  |
          Automated Pipeline
                  |
          FACEBOOK GRAPH API
```

## 📂 Project Structure

```text
LankaPulse-AI/
│
├── next-frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── laravel-backend/
│   ├── app/
│   │   ├── Console/
│   │   ├── Http/
│   │   ├── Models/
│   │   └── Services/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   ├── composer.json
│   └── artisan
│
└── .github/
    └── workflows/
        └── laravel-scheduler.yml
```

## ⚙️ Local Development Setup

### Prerequisites

- Node.js and npm
- PHP 8.2+
- Composer
- MySQL-compatible database access
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/NipunaSudesh/LankaPulse-AI.git

cd LankaPulse-AI
```

### 2. Backend Setup

```bash
cd laravel-backend

composer install

copy .env.example .env
```

Configure the backend `.env` file with your database, AI, news API, and Facebook credentials.

Generate an application key for a new local installation:

```bash
php artisan key:generate
```

Run migrations only when setting up a new database:

```bash
php artisan migrate
```

Start the Laravel development server:

```bash
php artisan serve
```

Backend URL:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd next-frontend

npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

## 🗄️ Database Configuration

LankaPulse AI uses **TiDB Cloud**, a MySQL-compatible cloud database.

| Setting | Value |
|---|---|
| Database Provider | TiDB Cloud |
| Cluster | lankapulse-mysql |
| Branch | main |
| Database | lankapulse_ai |
| Port | 4000 |
| Driver | MySQL |
| Connection | TLS / SSL |

Configure the database connection in the backend `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=your-tidb-host
DB_PORT=4000
DB_DATABASE=lankapulse_ai
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password

MYSQL_ATTR_SSL_CA=/path/to/ca-certificate.pem
```

**Note:** Replace the example credentials and certificate path with your own configuration. Never commit database credentials or certificates containing private keys.

## 🤖 News Processing & Automation

The Laravel backend provides an automated news-processing pipeline.

Run the complete pipeline:

```bash
php artisan news:run-pipeline
```

Individual commands:

```bash
php artisan news:fetch-sri-lanka
php artisan news:prepare-facebook
php artisan news:publish-facebook --dry-run
```

### Laravel Scheduler

Scheduled tasks are configured in:

```text
laravel-backend/routes/console.php
```

Current schedule:

```php
Schedule::command('news:run-pipeline')
    ->hourly()
    ->withoutOverlapping();
```

GitHub Actions triggers Laravel's scheduler every five minutes:

```yaml
on:
  schedule:
    - cron: '*/5 * * * *'
  workflow_dispatch:
```

Laravel determines whether the hourly pipeline is due.

Sensitive configuration is managed through GitHub Actions repository secrets.

## 📱 Facebook Integration

LankaPulse AI integrates with the Facebook Graph API to support news publishing.

Features include:

- Facebook Page integration.
- Automated article publishing.
- AI-assisted content selection.
- Daily publishing limits.
- Article age restrictions.
- Publishing status tracking.
- Duplicate publishing safeguards.
- Administrative publishing controls.

Facebook configuration is managed through protected environment variables.

## 🚀 Deployment

| Component | Hosting Platform |
|---|---|
| Next.js Frontend | Vercel |
| Laravel Backend | Render |
| Database | TiDB Cloud |
| Scheduled Automation | GitHub Actions |
| Source Code | GitHub |

The frontend communicates with the Laravel backend through REST API endpoints.

## 🔐 Security

- Store API keys and credentials in environment variables.
- Use GitHub Actions secrets for automated workflows.
- Secure database connections with TLS.
- Protect administrative endpoints with authentication and authorization.
- Never expose database passwords, API keys, or Facebook access tokens in source control.

## 🎯 Project Objective

LankaPulse AI aims to simplify access to Sri Lankan news by bringing information from multiple publishers into one intelligent platform.

The project demonstrates practical full-stack software engineering, AI integration, API development, cloud database management, background automation, data processing, and third-party service integration.

---

**LankaPulse AI — Stay Informed. Think Smarter.**
