-- Drop ALL existing policies (both with and without trailing spaces) then recreate as PERMISSIVE

-- athlete_profiles
DROP POLICY IF EXISTS "Athletes manage own " ON public.athlete_profiles;
DROP POLICY IF EXISTS "Athletes manage own" ON public.athlete_profiles;
DROP POLICY IF EXISTS "Coaches view team athletes " ON public.athlete_profiles;
DROP POLICY IF EXISTS "Coaches view team athletes" ON public.athlete_profiles;
CREATE POLICY "Athletes manage own ap" ON public.athlete_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches view team athletes ap" ON public.athlete_profiles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'coach'::app_role) AND EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = athlete_profiles.user_id AND p.team_id IN (
      SELECT t.id FROM teams t WHERE t.coach_id = auth.uid())));

-- morning_checkins
DROP POLICY IF EXISTS "Athletes manage own morning " ON public.morning_checkins;
DROP POLICY IF EXISTS "Athletes manage own morning" ON public.morning_checkins;
DROP POLICY IF EXISTS "Coaches view team morning " ON public.morning_checkins;
DROP POLICY IF EXISTS "Coaches view team morning" ON public.morning_checkins;
CREATE POLICY "Athletes manage own mc" ON public.morning_checkins FOR ALL TO authenticated
  USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team mc" ON public.morning_checkins FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'coach'::app_role) AND EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = morning_checkins.athlete_id AND p.team_id IN (
      SELECT t.id FROM teams t WHERE t.coach_id = auth.uid())));

-- evening_checkins
DROP POLICY IF EXISTS "Athletes manage own evening " ON public.evening_checkins;
DROP POLICY IF EXISTS "Athletes manage own evening" ON public.evening_checkins;
DROP POLICY IF EXISTS "Coaches view team evening " ON public.evening_checkins;
DROP POLICY IF EXISTS "Coaches view team evening" ON public.evening_checkins;
CREATE POLICY "Athletes manage own ec" ON public.evening_checkins FOR ALL TO authenticated
  USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team ec" ON public.evening_checkins FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'coach'::app_role) AND EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = evening_checkins.athlete_id AND p.team_id IN (
      SELECT t.id FROM teams t WHERE t.coach_id = auth.uid())));

-- post_session_checkins
DROP POLICY IF EXISTS "Athletes manage own post " ON public.post_session_checkins;
DROP POLICY IF EXISTS "Athletes manage own post" ON public.post_session_checkins;
DROP POLICY IF EXISTS "Coaches view team post " ON public.post_session_checkins;
DROP POLICY IF EXISTS "Coaches view team post" ON public.post_session_checkins;
CREATE POLICY "Athletes manage own psc" ON public.post_session_checkins FOR ALL TO authenticated
  USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team psc" ON public.post_session_checkins FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'coach'::app_role) AND EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = post_session_checkins.athlete_id AND p.team_id IN (
      SELECT t.id FROM teams t WHERE t.coach_id = auth.uid())));

-- injuries
DROP POLICY IF EXISTS "Athletes manage own injuries " ON public.injuries;
DROP POLICY IF EXISTS "Athletes manage own injuries" ON public.injuries;
DROP POLICY IF EXISTS "Coaches view team injuries " ON public.injuries;
DROP POLICY IF EXISTS "Coaches view team injuries" ON public.injuries;
CREATE POLICY "Athletes manage own inj" ON public.injuries FOR ALL TO authenticated
  USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Coaches view team inj" ON public.injuries FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'coach'::app_role) AND EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = injuries.athlete_id AND p.team_id IN (
      SELECT t.id FROM teams t WHERE t.coach_id = auth.uid())));

-- messages
DROP POLICY IF EXISTS "Users view own messages " ON public.messages;
DROP POLICY IF EXISTS "Users view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users send messages " ON public.messages;
DROP POLICY IF EXISTS "Users send messages" ON public.messages;
DROP POLICY IF EXISTS "Users update received " ON public.messages;
DROP POLICY IF EXISTS "Users update received" ON public.messages;
CREATE POLICY "Users view own msg" ON public.messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send msg" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users update msg" ON public.messages FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id);

-- notifications
DROP POLICY IF EXISTS "Users view own notifications " ON public.notifications;
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications " ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Insert notifications for team " ON public.notifications;
DROP POLICY IF EXISTS "Insert notifications for team" ON public.notifications;
CREATE POLICY "Users view own notif" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notif" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Insert notif for team" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p1 JOIN profiles p2 ON p1.team_id = p2.team_id WHERE p1.user_id = auth.uid() AND p2.user_id = notifications.user_id) OR auth.uid() = user_id);

-- user_roles
DROP POLICY IF EXISTS "Users can insert own role " ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles " ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Profiles viewable by authenticated " ON public.profiles;
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Profiles viewable" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- teams
DROP POLICY IF EXISTS "Authenticated can view teams " ON public.teams;
DROP POLICY IF EXISTS "Authenticated can view teams" ON public.teams;
DROP POLICY IF EXISTS "Coaches can create teams " ON public.teams;
DROP POLICY IF EXISTS "Coaches can create teams" ON public.teams;
DROP POLICY IF EXISTS "Coaches can update own team " ON public.teams;
DROP POLICY IF EXISTS "Coaches can update own team" ON public.teams;
CREATE POLICY "View teams" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches create teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (coach_id = auth.uid());
CREATE POLICY "Coaches update team" ON public.teams FOR UPDATE TO authenticated USING (coach_id = auth.uid());

-- sessions
DROP POLICY IF EXISTS "Coaches manage sessions " ON public.sessions;
DROP POLICY IF EXISTS "Coaches manage sessions" ON public.sessions;
DROP POLICY IF EXISTS "Team members view sessions " ON public.sessions;
DROP POLICY IF EXISTS "Team members view sessions" ON public.sessions;
CREATE POLICY "Coaches manage sess" ON public.sessions FOR ALL TO authenticated
  USING (coach_id = auth.uid()) WITH CHECK (coach_id = auth.uid());
CREATE POLICY "Team view sess" ON public.sessions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.team_id = sessions.team_id));