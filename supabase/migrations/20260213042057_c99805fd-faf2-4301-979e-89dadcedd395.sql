
-- Add is_approved column to profiles, default false for new users
ALTER TABLE public.profiles ADD COLUMN is_approved boolean NOT NULL DEFAULT false;

-- Approve existing users (admin and current writer)
UPDATE public.profiles SET is_approved = true;
