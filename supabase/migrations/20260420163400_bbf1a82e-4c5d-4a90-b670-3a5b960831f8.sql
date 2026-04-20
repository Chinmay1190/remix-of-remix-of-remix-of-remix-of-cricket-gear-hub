-- Replace overly permissive SELECT policy on newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can check subscription status" ON public.newsletter_subscribers;

CREATE POLICY "Admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));