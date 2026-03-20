# Fourthwave DB Setup (Prisma + Supabase)

## 1) Environment
Use `.env.local` (and keep `.env` identical to avoid Prisma confusion).

Required keys:

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<url-encoded-password>@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1
DIRECT_URL=postgresql://postgres.<project-ref>:<url-encoded-password>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require&connect_timeout=10
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=<access-key-id>
AWS_SECRET_ACCESS_KEY=<secret-access-key>
S3_BUCKET=<bucket-name>
ADMIN_PASSWORD=<strong-password>
ADMIN_SESSION_SECRET=<long-random-secret>
```

If your DB password contains `@`, encode it as `%40`.
Example: `abc@@123` -> `abc%40%40123`

## 2) Prisma commands (use pnpm scripts)
Do not use raw `pnpm exec prisma ...` directly unless needed.

```bash
pnpm db:generate
pnpm db:push
pnpm db:migrate:dev
pnpm db:migrate:status
```

## 3) First-time table creation
The app expects schema/table:
- schema: `fourthwave`
- table: `result_assets`

`pnpm db:push` should create them from `prisma/schema.prisma`.

## 4) Troubleshooting
- `P1000 Authentication failed`
  - Username/password mismatch in `DATABASE_URL`.
  - Copy Prisma connection string from Supabase dashboard and re-check.
  - If needed, reset DB password in Supabase and update `.env.local`.

- `P1001 Can't reach database server`
  - Network/DNS issue to the host/port.
  - Use pooler host for both URLs:
    - runtime: `...pooler.supabase.com:6543`
    - prisma cli direct/session: `...pooler.supabase.com:5432`

- Prisma says `Environment variables loaded from .env`
  - Prisma always tries `.env` by default.
  - Keep `.env` and `.env.local` in sync:
    ```bash
    cp .env.local .env
    ```
