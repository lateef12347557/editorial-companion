
-- Auto-assign writer role to every new user on signup
CREATE OR REPLACE FUNCTION public.assign_writer_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'writer')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_writer
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.assign_writer_role();
