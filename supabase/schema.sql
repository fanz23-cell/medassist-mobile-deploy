create extension if not exists "pgcrypto";

create table if not exists care_visits (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  hospital_name text not null,
  department text not null,
  appointment_time timestamptz,
  caregiver_phone text,
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists visit_steps (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references care_visits(id) on delete cascade,
  step_order integer not null,
  title text not null,
  place text not null,
  instruction text not null,
  materials jsonb not null default '[]'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists help_events (
  id uuid primary key default gen_random_uuid(),
  visit_id text not null,
  step_id text not null,
  event_type text not null check (
    event_type in ('step_completed', 'rest_requested', 'staff_help', 'family_update')
  ),
  note text not null default '',
  created_at timestamptz not null default now()
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

drop trigger if exists care_visits_set_updated_at on care_visits;
create trigger care_visits_set_updated_at
before update on care_visits
for each row
execute function set_updated_at();

alter table care_visits enable row level security;
alter table visit_steps enable row level security;
alter table help_events enable row level security;
