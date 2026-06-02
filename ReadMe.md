## Requirements
- Node 22
- Prisma 5
- Postgres

## Manual Actions
- Create a database manually
- setup env files
- generate JWT token

## Scripts to run
- npm install
- npx prisma migrate dev --name init
- npx prisma generate
- npx prisma db seed (to add default user)
- npm run dev / npm run start