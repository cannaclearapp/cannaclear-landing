create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  consent_launch_updates boolean not null default true,
  consent_text_version text not null,
  consent_text text not null,
  consent_at timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmation_token_hash text,
  confirmation_token_expires_at timestamptz,
  unsubscribe_token_hash text,
  source_path text,
  source_locale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.newsletter_subscribers add column if not exists unsubscribe_token_hash text;

create index if not exists newsletter_subscribers_status_idx on public.newsletter_subscribers(status);
create index if not exists newsletter_subscribers_token_idx on public.newsletter_subscribers(confirmation_token_hash);
create index if not exists newsletter_subscribers_unsubscribe_token_idx on public.newsletter_subscribers(unsubscribe_token_hash);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

alter table public.newsletter_subscribers enable row level security;

create table if not exists public.newsletter_events (
  id bigint generated always as identity primary key,
  subscriber_id uuid references public.newsletter_subscribers(id) on delete set null,
  email text,
  event_type text not null check (event_type in ('subscribe_started', 'subscribe_confirmed', 'unsubscribe_clicked')),
  source_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_events_subscriber_id_idx on public.newsletter_events(subscriber_id);
create index if not exists newsletter_events_event_type_idx on public.newsletter_events(event_type);
create index if not exists newsletter_events_created_at_idx on public.newsletter_events(created_at desc);

alter table public.newsletter_events enable row level security;

create or replace view public.newsletter_subscribers_export as
select
  s.id,
  s.email,
  s.status,
  s.consent_at,
  s.confirmed_at,
  s.source_path,
  s.source_locale,
  s.created_at as subscribed_at,
  case
    when s.confirmed_at is null then null
    else extract(epoch from (s.confirmed_at - s.created_at)) / 60.0
  end as minutes_to_confirm,
  (
    select count(*)
    from public.newsletter_events e
    where e.subscriber_id = s.id
      and e.event_type = 'subscribe_started'
  ) as subscribe_started_events,
  (
    select count(*)
    from public.newsletter_events e
    where e.subscriber_id = s.id
      and e.event_type = 'subscribe_confirmed'
  ) as subscribe_confirmed_events
from public.newsletter_subscribers s;
