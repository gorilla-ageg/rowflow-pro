
-- Role enum
CREATE TYPE public.app_role AS ENUM ('coach', 'athlete');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teams
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  division TEXT,
  season_start DATE,
  season_end DATE,
  invite_code TEXT NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
  coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view teams" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches can create teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (coach_id = auth.uid());
CREATE POLICY "Coaches can update own team" ON public.teams FOR UPDATE TO authenticated USING (coach_id = auth.uid());

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Athlete profiles
CREATE TABLE public.athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  year TEXT,
  boat_class TEXT,
  seat_position TEXT,
  height NUMERIC,
  weight NUMERIC,
  sleep_goal NUMERIC DEFAULT 8,
  injuries TEXT,
  classes_per_day INTEGER,
  hard_days TEXT[],
  exam_weeks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.athlete_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Athletes manage own" ON public.athlete_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches view team athletes" ON public.athlete_profiles FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'coach') AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = athlete_profiles.user_id AND p.team_id IN (
      SELECT t.id FROM public.teams t WHERE t.coach_id = auth.uid()
    )
  )
);

-- Sessions
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('erg', 'water', 'weights', 'cross_training', 'rest')),
  date DATE NOT NULL,
  time TIME,
  duration INTEGER,
  intensity TEXT CHECK (intensity IN ('low', 'moderate', 'high', 'race_pace')),
  warmup TEXT,
  main_set TEXT,
  cooldown TEXT,
  target_split TEXT,
  target_rate TEXT,
  target_hr_zone TEXT,
  assigned_to TEXT DEFAULT 'team',
  notes TEXT,
  notes_visible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members view sessions" ON public.sessions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.team_id = sessions.team_id)
);
CREATE POLICY "Coaches manage sessions" ON public.sessions FOR ALL TO authenticated USING (coach_id = auth.uid()) WITH CHECK (coach_id = auth.uid());

-- Morning check-ins
CREATE TABLE public.morning_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours NUMERIC,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  energy INTEGER CHECK (energy BETWEEN 1 AND 5),
  stress INTEGER CHECK (stress BETWEEN 1 AND 5),
  motivation INTEGER CHECK (motivation BETWEEN 1 AND 5),
  has_pain BOOLEAN DEFAULT false,
  pain_location TEXT,
  pain_level INTEGER CHECK (pain_level BETWEEN 1 AND 5),
  classes_today INTEGER,
  assignment_due BOOLEAN DEFAULT false,
  exam_this_week BOOLEAN DEFAULT false,
  note_to_coach TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.morning_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Athletes manage own morning" ON public.morning_checkins FOR ALL TO authenticated USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team morning" ON public.morning_checkins FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'coach') AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = morning_checkins.athlete_id AND p.team_id IN (
      SELECT t.id FROM public.teams t WHERE t.coach_id = auth.uid()
    )
  )
);

-- Post-session check-ins
CREATE TABLE public.post_session_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_status TEXT CHECK (completion_status IN ('fully_completed', 'partially', 'did_not_complete')),
  dnf_reason TEXT,
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  legs_fatigue INTEGER CHECK (legs_fatigue BETWEEN 1 AND 5),
  back_fatigue INTEGER CHECK (back_fatigue BETWEEN 1 AND 5),
  breathing INTEGER CHECK (breathing BETWEEN 1 AND 5),
  has_pain BOOLEAN DEFAULT false,
  pain_location TEXT,
  pain_level INTEGER CHECK (pain_level BETWEEN 1 AND 5),
  hit_targets TEXT CHECK (hit_targets IN ('yes', 'close', 'no')),
  felt_good TEXT,
  felt_off TEXT,
  recovery_status INTEGER CHECK (recovery_status BETWEEN 1 AND 5),
  ready_tomorrow TEXT CHECK (ready_tomorrow IN ('yes', 'maybe', 'no')),
  studying_tonight BOOLEAN DEFAULT false,
  study_hours NUMERIC,
  academic_stress INTEGER CHECK (academic_stress BETWEEN 1 AND 5),
  message_to_coach TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.post_session_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Athletes manage own post" ON public.post_session_checkins FOR ALL TO authenticated USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team post" ON public.post_session_checkins FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'coach') AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = post_session_checkins.athlete_id AND p.team_id IN (
      SELECT t.id FROM public.teams t WHERE t.coach_id = auth.uid()
    )
  )
);

-- Evening check-ins
CREATE TABLE public.evening_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  energy_final INTEGER CHECK (energy_final BETWEEN 1 AND 5),
  nutrition TEXT CHECK (nutrition IN ('good', 'okay', 'poor')),
  hydration TEXT CHECK (hydration IN ('good', 'okay', 'poor')),
  expected_sleep NUMERIC,
  day_rating INTEGER CHECK (day_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.evening_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Athletes manage own evening" ON public.evening_checkins FOR ALL TO authenticated USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team evening" ON public.evening_checkins FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'coach') AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = evening_checkins.athlete_id AND p.team_id IN (
      SELECT t.id FROM public.teams t WHERE t.coach_id = auth.uid()
    )
  )
);

-- Injuries
CREATE TABLE public.injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  body_part TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  description TEXT,
  date_flagged DATE NOT NULL DEFAULT CURRENT_DATE,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.injuries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Athletes manage own injuries" ON public.injuries FOR ALL TO authenticated USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team injuries" ON public.injuries FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'coach') AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = injuries.athlete_id AND p.team_id IN (
      SELECT t.id FROM public.teams t WHERE t.coach_id = auth.uid()
    )
  )
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own messages" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users update received" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_athlete_profiles_updated_at BEFORE UPDATE ON public.athlete_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
