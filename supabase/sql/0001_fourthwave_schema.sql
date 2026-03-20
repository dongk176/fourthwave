-- Fourthwave dedicated schema (shared DB-safe)
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;
create schema if not exists fourthwave;

create table if not exists fourthwave.result_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default 'FourthWave Artist',
  description text not null default '',
  type text not null check (type in ('audio', 'video')),
  media_key text,
  media_data bytea,
  media_mime text not null,
  thumbnail_key text,
  thumbnail_data bytea,
  thumbnail_mime text,
  created_at timestamptz not null default now()
);

create index if not exists fourthwave_result_assets_created_at_idx
  on fourthwave.result_assets (created_at desc);

create table if not exists fourthwave.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fourthwave_faq_items_sort_order_idx
  on fourthwave.faq_items (sort_order asc, created_at asc);
