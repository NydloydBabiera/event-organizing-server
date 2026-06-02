## Requirements
- Node 22
- Prisma 5
- Docker Desktop

## Manual Actions
- download and install docker desktop (if you dont have)
- setup .env

## Scripts to run
- docker-compose up -d (to initialize pg database)
- npm install
- npx prisma migrate dev --name init
- npx prisma generate
- npm run dev