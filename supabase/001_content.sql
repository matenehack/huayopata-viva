-- Reproducible schema for Huayopata Viva. Apply once to a fresh project.
create table public.places (id text primary key, data jsonb not null, published boolean not null default true, updated_at timestamptz not null default now());
create table public.chapters (id text primary key, data jsonb not null, sort_order integer not null default 0, published boolean not null default true);
create table public.media_assets (path text primary key, bucket text not null default 'huayopata-media', kind text not null, bytes bigint not null, sha256 text not null, original_source text, created_at timestamptz not null default now());
alter table public.places enable row level security;
alter table public.chapters enable row level security;
alter table public.media_assets enable row level security;
revoke all on public.places,public.chapters,public.media_assets from anon,authenticated;
grant select on public.places,public.chapters,public.media_assets to anon,authenticated;
create policy "Published places are readable" on public.places for select to anon,authenticated using(published);
create policy "Published chapters are readable" on public.chapters for select to anon,authenticated using(published);
create policy "Media catalog is readable" on public.media_assets for select to anon,authenticated using(true);
insert into storage.buckets(id,name,public,file_size_limit) values ('huayopata-media','huayopata-media',true,52428800),('migration-backups','migration-backups',false,52428800);
