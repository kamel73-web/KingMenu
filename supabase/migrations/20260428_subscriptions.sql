-- Table subscriptions
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  lemon_customer_id       text unique,
  lemon_subscription_id   text unique,
  plan                    text not null default 'free'
                            check (plan in ('free', 'premium', 'family')),
  status                  text not null default 'inactive'
                            check (status in ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Index
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_lemon_customer_idx on public.subscriptions(lemon_customer_id);

-- RLS
alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');

-- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();
