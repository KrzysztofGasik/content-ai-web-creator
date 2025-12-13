# ContentForge AI 🚀

Full-stack content generation platform with AI text/image creation, project organization, and analytics.

## 🔗 Demo

https://content-ai-web-creator.vercel.app

## 📸 Screenshots

![LandingPage](/public/screenshots/landing.png)
![Content Generation](/public/screenshots/content.png)
![Images gallery](/public/screenshots/images.png)
![Analytics](/public/screenshots/analytics.png)

## ✨ Features

- 🤖 AI text generation with GPT-4 (streaming)
- 🎨 Image generation with DALL-E 3
- 📁 Project organization with tags
- 📊 Analytics dashboard with charts
- 📝 Content version history
- 🔍 Advanced search & filtering
- ☁️ AWS S3 image storage
- 🌙 Dark/light mode

## 🛠️ Tech Stack

**Frontend:** Next.js 16, Tailwind CSS, shadcn/ui, TanStack Query
**Backend:** Prisma, PostgreSQL (Neon), NextAuth v5
**AI:** OpenAI GPT-3, DALL-E 3, Vercel AI SDK
**Storage:** AWS S3
**Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- OpenAI API key
- AWS S3 bucket

### Installation

1. Clone the repository
2. Install dependencies: `npm install --legacy-peer-deps`
3. Copy `.env.example` to `.env`
4. Fill in environment variables
5. Push database schema: `npx prisma db push`
6. Run dev server: `npm run dev`

## 📝 Environment Variables

| Variable                | Description                           |
| ----------------------- | ------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string          |
| `AUTH_SECRET`           | NextAuth secret key                   |
| `AUTH_URL`              | App URL (e.g., http://localhost:3000) |
| `AWS_ACCESS_KEY_ID`     | AWS access key                        |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                        |
| `AWS_REGION`            | S3 bucket region                      |
| `AWS_S3_BUCKET_NAME`    | S3 bucket name                        |

## 📄 License

MIT
