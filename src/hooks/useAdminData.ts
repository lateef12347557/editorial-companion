import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ---------- Articles ----------

export function useAdminArticles() {
  return useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, profiles:author_id(display_name), categories:category_id(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateArticleStatus() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, status, featured }: { id: string; status?: string; featured?: boolean }) => {
      const updates: Record<string, unknown> = {};
      if (status !== undefined) {
        updates.status = status;
        if (status === 'published') updates.published_at = new Date().toISOString();
      }
      if (featured !== undefined) updates.featured = featured;
      const { error } = await supabase.from('articles').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-articles'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Article updated' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-articles'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Article deleted' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

// ---------- Stats ----------

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [articlesRes, writersRes] = await Promise.all([
        supabase.from('articles').select('id, status, featured'),
        supabase.from('user_roles').select('id').eq('role', 'writer'),
      ]);
      const articles = articlesRes.data || [];
      return {
        totalArticles: articles.length,
        publishedArticles: articles.filter((a) => a.status === 'published').length,
        pendingReview: articles.filter((a) => a.status === 'pending').length,
        drafts: articles.filter((a) => a.status === 'draft').length,
        totalWriters: writersRes.data?.length || 0,
        featuredArticles: articles.filter((a) => a.featured).length,
      };
    },
  });
}

// ---------- Writers ----------

export function useWriters() {
  return useQuery({
    queryKey: ['admin-writers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at, profiles:user_id(display_name, avatar_url)')
        .eq('role', 'writer');
      if (error) throw error;
      return data;
    },
  });
}

export function useAllProfiles() {
  return useQuery({
    queryKey: ['admin-all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('id, display_name, avatar_url, is_approved');
      if (error) throw error;
      return data;
    },
  });
}

export function usePendingApprovals() {
  return useQuery({
    queryKey: ['admin-pending-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, created_at, is_approved')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useApproveUser() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ userId, approve }: { userId: string; approve: boolean }) => {
      const { error } = await supabase.from('profiles').update({ is_approved: approve }).eq('id', userId);
      if (error) throw error;
    },
    onSuccess: (_, { approve }) => {
      qc.invalidateQueries({ queryKey: ['admin-pending-approvals'] });
      qc.invalidateQueries({ queryKey: ['admin-all-profiles'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: approve ? 'User approved' : 'User approval revoked' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

export function useManageWriterRole() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'writer' as const });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'writer');
        if (error) throw error;
      }
    },
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: ['admin-writers'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: action === 'add' ? 'Writer role assigned' : 'Writer role removed' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

// ---------- Categories ----------

export function useCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { error } = await supabase.from('categories').insert({ name, slug });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category created' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category deleted' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

// ---------- Gallery ----------

export function useAdminGallery() {
  return useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useToggleGalleryPublish() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from('gallery_images').update({ is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Gallery image updated' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Image deleted' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}
