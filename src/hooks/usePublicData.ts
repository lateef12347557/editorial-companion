import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  featured: boolean;
  published_at: string | null;
  read_time: string | null;
  category_name: string | null;
  author_name: string | null;
}

async function fetchPublishedArticles(): Promise<PublicArticle[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, content, cover_image_url, featured, published_at, read_time, categories:category_id(name), author_id')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw error;

  // Fetch author names from profiles
  const authorIds = [...new Set((data || []).map((a) => a.author_id))];
  const { data: profiles } = authorIds.length
    ? await supabase.from('profiles').select('id, display_name').in('id', authorIds)
    : { data: [] };
  const profileMap = new Map((profiles || []).map((p) => [p.id, p.display_name]));

  return (data || []).map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    cover_image_url: a.cover_image_url,
    featured: a.featured,
    published_at: a.published_at,
    read_time: a.read_time,
    category_name: (a.categories as any)?.name || null,
    author_name: profileMap.get(a.author_id) || 'Unknown',
  }));
}

export function usePublishedArticles() {
  return useQuery({
    queryKey: ['published-articles'],
    queryFn: fetchPublishedArticles,
  });
}

export function usePublishedArticleBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['published-article', slug],
    enabled: !!slug,
    queryFn: async () => {
      const articles = await fetchPublishedArticles();
      return articles.find((a) => a.slug === slug) || null;
    },
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('id, name').order('name');
      if (error) throw error;
      return data || [];
    },
  });
}

export function usePublishedGallery() {
  return useQuery({
    queryKey: ['published-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}
