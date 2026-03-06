
-- Tighten notifications insert policy to only allow inserting notifications for team members
DROP POLICY "Insert notifications" ON public.notifications;
CREATE POLICY "Insert notifications for team" ON public.notifications FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p1
    JOIN public.profiles p2 ON p1.team_id = p2.team_id
    WHERE p1.user_id = auth.uid() AND p2.user_id = notifications.user_id
  )
  OR auth.uid() = user_id
);
