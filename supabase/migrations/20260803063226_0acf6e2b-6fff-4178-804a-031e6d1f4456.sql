CREATE TABLE public.public_profiles (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  is_public boolean NOT NULL DEFAULT true,
  full_name text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  avatar_url text,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  awards jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  visible_sections jsonb NOT NULL DEFAULT '{"skills":true,"education":true,"awards":true,"timeline":true,"projects":true,"completeness":true}'::jsonb,
  doc_count integer NOT NULL DEFAULT 0,
  completeness integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;
GRANT ALL ON public.public_profiles TO service_role;

ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their published profile"
  ON public.public_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read published profiles"
  ON public.public_profiles FOR SELECT TO anon
  USING (is_public = true);

CREATE TRIGGER public_profiles_touch_updated_at
  BEFORE UPDATE ON public.public_profiles
  FOR EACH ROW EXECUTE FUNCTION public.mv_touch_updated_at();