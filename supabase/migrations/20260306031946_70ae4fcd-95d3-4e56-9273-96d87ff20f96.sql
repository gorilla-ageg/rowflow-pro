-- Drop existing FK that points to wrong table
ALTER TABLE public.athlete_profiles DROP CONSTRAINT IF EXISTS athlete_profiles_user_id_fkey;

-- Add FK from athlete_profiles.user_id to profiles.user_id
ALTER TABLE public.athlete_profiles
  ADD CONSTRAINT athlete_profiles_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add FK from injuries.athlete_id to profiles.user_id
ALTER TABLE public.injuries
  ADD CONSTRAINT injuries_athlete_id_profiles_fkey
  FOREIGN KEY (athlete_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add FK from morning_checkins.athlete_id to profiles.user_id
ALTER TABLE public.morning_checkins
  ADD CONSTRAINT morning_checkins_athlete_id_profiles_fkey
  FOREIGN KEY (athlete_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add FK from evening_checkins.athlete_id to profiles.user_id
ALTER TABLE public.evening_checkins
  ADD CONSTRAINT evening_checkins_athlete_id_profiles_fkey
  FOREIGN KEY (athlete_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add FK from post_session_checkins.athlete_id to profiles.user_id
ALTER TABLE public.post_session_checkins
  ADD CONSTRAINT post_session_checkins_athlete_id_profiles_fkey
  FOREIGN KEY (athlete_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;