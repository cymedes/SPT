# Prisma notes for Subaru Pricing Tool

This project uses Prisma v7+ and PostgreSQL. Important notes for running migrations and using Prisma locally:

- Prisma schema file: `prisma/schema.prisma` (DO NOT put connection URLs there for Prisma 7+)
- Prisma CLI config: `prisma/prisma.config.js` (or `.ts`) — this is where connection URLs belong for Migrate

Quick setup:

1. Create a `.env` based on the project root `.env.example` and fill `DATABASE_URL` with your Postgres connection string.
2. (Optional) set `SHADOW_DATABASE_URL` if you use shadow DBs for migrations in CI.
3. Generate Prisma client:

   npx prisma generate --schema prisma/schema.prisma

4. Run migrations (when `DATABASE_URL` is set):

   npx prisma migrate dev --name <name> --config prisma/prisma.config.js

If you run into parsing errors while using the Prisma CLI, check that `DATABASE_URL` is set and that `prisma/prisma.config.js` exports the expected shape.
