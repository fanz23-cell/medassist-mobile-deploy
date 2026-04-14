create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  resume_text text not null default '',
  story_bank jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_name text not null,
  role_title text not null default '',
  jd_text text not null,
  interview_notes text not null default '',
  question_bank jsonb not null default '[]'::jsonb,
  practice_rounds jsonb not null default '[]'::jsonb,
  answer_cards jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
before update on profiles
for each row
execute function set_updated_at();

drop trigger if exists sessions_set_updated_at on sessions;
create trigger sessions_set_updated_at
before update on sessions
for each row
execute function set_updated_at();
