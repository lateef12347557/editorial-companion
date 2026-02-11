import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useMyArticles() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['writer-articles', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, categories:category_id(name)')
        .eq('author_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useWriterStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['writer-stats', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, status')
        .eq('author_id', user!.id);
      if (error) throw error;
      const articles = data || [];
      return {
        totalArticles: articles.length,
        published: articles.filter((a) => a.status === 'published').length,
        drafts: articles.filter((a) => a.status === 'draft').length,
        pending: articles.filter((a) => a.status === 'pending').length,
        rejected: articles.filter((a) => a.status === 'rejected').length,
      };
    },
  });
}

export function useSaveArticle() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      slug,
      excerpt,
      content,
      category_id,
      cover_image_url,
      status,
      read_time,
    }: {
      id?: string;
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      category_id: string | null;
      cover_image_url: string | null;
      status: string;
      read_time: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const row = {
        title,
        slug,
        excerpt,
        content,
        category_id,
        cover_image_url,
        status,
        read_time,
        author_id: user.id,
        ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
      };

      if (id) {
        // Update existing
        const { error } = await supabase.from('articles').update(row).eq('id', id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase.from('articles').insert({ ...row, slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['writer-articles'] });
      qc.invalidateQueries({ queryKey: ['writer-stats'] });
      qc.invalidateQueries({ queryKey: ['admin-articles'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: Error) => toast({ title: 'Error saving article', description: err.message, variant: 'destructive' }),
  });
}

export function useDeleteMyArticle() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['writer-articles'] });
      qc.invalidateQueries({ queryKey: ['writer-stats'] });
      toast({ title: 'Article deleted' });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });
}

export function useDbCategories() {
  return useQuery({
    queryKey: ['db-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
}
