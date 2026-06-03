## Requirements
- Node 22
- Prisma 5
- Docker Desktop

## Manual Actions
- download and install docker desktop (if you dont have)
- setup .env
- if you have an existing postgresql running on your device, I highly suggest to stop it's services

## Scripts to run
- docker-compose up -d (to initialize pg database)
- npm install
- npx prisma migrate dev --name init
- npx prisma generate
- npm run dev