-- Run this in your Supabase SQL editor to set up the database

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  tier text not null default 'free' check (tier in ('free', 'pro', 'vip')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text,
  created_at timestamptz default now()
);

-- Tips table
create table public.tips (
  id uuid default gen_random_uuid() primary key,
  race_date date not null,
  track text not null,
  race_number integer not null,
  distance text not null,
  horse_name text not null,
  jockey text not null,
  trainer text not null,
  barrier integer not null,
  weight text not null,
  model_odds text not null,
  iq_score integer not null check (iq_score between 0 and 100),
  analysis text not null,
  tier_required text not null default 'free' check (tier_required in ('free', 'pro', 'vip')),
  result text not null default 'pending' check (result in ('pending', 'win', 'place', 'unplaced')),
  sp_odds text,
  profit_loss numeric(10,2),
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.tips enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Tips: free tier sees free tips, pro/vip see all
create policy "Free tips visible to all authenticated users"
  on tips for select
  using (
    auth.role() = 'authenticated' and (
      tier_required = 'free'
      or exists (
        select 1 from profiles
        where id = auth.uid()
        and tier in ('pro', 'vip')
      )
    )
  );

-- Public can see free tips (for landing page)
create policy "Public can see free tips"
  on tips for select
  using (tier_required = 'free');

-- Only service role can insert/update tips (admin only)
create policy "Service role can manage tips"
  on tips for all
  using (auth.role() = 'service_role');

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
