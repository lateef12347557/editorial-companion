import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, X, Save, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { useSaveArticle, useDbCategories } from '@/hooks/useWriterData';
import { supabase } from '@/integrations/supabase/client';

interface ArticleData {
  id?: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category_id: string | null;
  cover_image_url: string | null;
  status: string;
  slug: string;
}

interface ArticleComposeProps {
  article?: ArticleData | null;
  onBack: () => void;
  onSaved: () => void;
}

const ArticleCompose = ({ article, onBack, onSaved }: ArticleComposeProps) => {
  const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const saveArticle = useSaveArticle();
  const { data: dbCategories } = useDbCategories();

  const [title, setTitle] = useState(article?.title || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [categoryId, setCategoryId] = useState(article?.category_id || '');
  const [content, setContent] = useState(article?.content || '');
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url || '');
  const [uploading, setUploading] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('uploads').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
      setCoverUrl(urlData.publicUrl);
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (status: 'draft' | 'pending') => {
    if (!title.trim()) {
      toast({ title: 'Title required', description: 'Please add a title to your article.', variant: 'destructive' });
      return;
    }
    if (status === 'pending' && !content.trim()) {
      toast({ title: 'Content required', description: 'Please write some content before submitting.', variant: 'destructive' });
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    await saveArticle.mutateAsync({
      id: article?.id,
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId || null,
      cover_image_url: coverUrl || null,
      status,
      read_time: readTime,
    });

    toast({
      title: status === 'draft' ? 'Draft saved' : 'Submitted for review',
      description: status === 'draft'
        ? 'Your draft has been saved successfully.'
        : 'Your article has been submitted for editorial review.',
    });

    onSaved();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saveArticle.isPending}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSave('pending')} disabled={saveArticle.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="h-4 w-4 mr-2" /> Submit for Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Main editor */}
        <div className="space-y-5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="font-serif text-2xl font-bold h-auto py-3 border-none bg-transparent shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
          />
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a short excerpt or summary..."
            rows={2}
            className="resize-none text-muted-foreground"
          />
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {/* Sidebar settings */}
        <div className="space-y-5">
          {article && (
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="text-sm font-semibold mb-2">Status</h3>
              <Badge variant="secondary" className="capitalize">{article.status}</Badge>
            </div>
          )}

          {/* Cover image */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold mb-3">Cover Image</h3>
            {coverUrl ? (
              <div className="relative aspect-[16/9] rounded-sm overflow-hidden mb-3">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 bg-foreground/50 text-background hover:bg-foreground/70"
                  onClick={() => setCoverUrl('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-[16/9] rounded-sm border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-xs font-medium">{uploading ? 'Uploading…' : 'Upload Cover'}</span>
              </button>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            {coverUrl && (
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => coverInputRef.current?.click()}>
                Change Image
              </Button>
            )}
          </div>

          {/* Category */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {(dbCategories || []).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    categoryId === cat.id
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              {dbCategories?.length === 0 && (
                <p className="text-xs text-muted-foreground">No categories available. Ask an admin to create some.</p>
              )}
            </div>
          </div>

          {/* Word count */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold mb-2">Statistics</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}</p>
              <p>Est. read time: {Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length / 200))} min</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCompose;
