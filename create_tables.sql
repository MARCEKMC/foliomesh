-- Script SQL para crear las tablas de Foliomesh en Supabase
-- Ejecutar en Database → SQL Editor

-- Crear tipos enumerados
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');
CREATE TYPE "BlockType" AS ENUM ('INTRO', 'EXPERIENCE', 'PROJECTS', 'CERTIFICATES', 'CONTACT');
CREATE TYPE "ProjectKind" AS ENUM ('EXTERNAL', 'GITHUB');

-- Tabla Users
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "supabase_user_id" TEXT NOT NULL UNIQUE,
    "given_name" TEXT NOT NULL,
    "family_name1" TEXT NOT NULL,
    "family_name2" TEXT,
    "middle_name" TEXT,
    "avatar_url" TEXT,
    "locale_pref" TEXT DEFAULT 'en',
    "preferred_slug" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id")
);

-- Tabla Portfolios
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT NOT NULL,
    "subdomain_slug" TEXT NOT NULL UNIQUE,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "private_token" TEXT,
    "theme" JSONB NOT NULL DEFAULT '{"palette":"blue","font":"inter","background":"gradient"}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Tabla Blocks
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "portfolio_id" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "order" INTEGER NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE,
    UNIQUE ("portfolio_id", "type")
);

-- Tabla Projects
CREATE TABLE "projects" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "portfolio_id" TEXT NOT NULL,
    "kind" "ProjectKind" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "cover_image" TEXT,
    "repo_meta" JSONB,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE
);

-- Tabla Integrations
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT NOT NULL,
    "github_username" TEXT,
    "github_connected" BOOLEAN NOT NULL DEFAULT false,
    "github_access_token" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    UNIQUE ("user_id")
);

-- Tabla Translations
CREATE TABLE "translations" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "portfolio_id" TEXT NOT NULL,
    "lang_target" TEXT NOT NULL,
    "checksum_base" TEXT NOT NULL,
    "blocks_json" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE,
    UNIQUE ("portfolio_id", "lang_target")
);

-- Tabla Visits
CREATE TABLE "visits" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "portfolio_id" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "ip_hash" TEXT NOT NULL,
    "ua_hash" TEXT NOT NULL,
    "referrer_hash" TEXT,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE
);

-- Tabla Rate Limits
CREATE TABLE "rate_limits" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT,
    "scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,
    "window_start" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "expires_at" TIMESTAMPTZ NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    UNIQUE ("scope", "key")
);

-- Crear índices para optimización
CREATE INDEX "idx_portfolios_user_id" ON "portfolios"("user_id");
CREATE INDEX "idx_portfolios_subdomain_slug" ON "portfolios"("subdomain_slug");
CREATE INDEX "idx_blocks_portfolio_id" ON "blocks"("portfolio_id");
CREATE INDEX "idx_projects_portfolio_id" ON "projects"("portfolio_id");
CREATE INDEX "idx_translations_portfolio_lang" ON "translations"("portfolio_id", "lang_target");
CREATE INDEX "idx_visits_portfolio_id" ON "visits"("portfolio_id");
CREATE INDEX "idx_rate_limits_scope_key" ON "rate_limits"("scope", "key");

-- Mensaje de confirmación
SELECT 'Tablas de Foliomesh creadas exitosamente!' as resultado;