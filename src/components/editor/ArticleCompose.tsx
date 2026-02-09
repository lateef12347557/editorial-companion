import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, X, Save, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { categories, type Article } from '@/data/mockData';

interface ArticleComposeProps {
  article?: Article | null;
  onBack: () => void;
  onSave: (article: Partial<Article>) => void;
}

const ArticleCompose = ({ article, onBack, onSave }: ArticleComposeProps) => {
  const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(article?.title || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [category, setCategory] = useState(article?.category || categories[0]);
  const [content, setContent] = useState(article?.content || '');
  const [coverImage, setCoverImage] = useState(article?.coverImage || '');
  const [coverPreview, setCoverPreview] = useState(article?.coverImage || '');

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setCoverImage(src);
      setCoverPreview(src);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (status: 'draft' | 'pending') => {
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

    onSave({
      id: article?.id || crypto.randomUUID(),
      title,
      slug,
      excerpt,
      content,
      category,
      coverImage,
      status,
      readTime,
      author: 'Current Writer',
      authorRole: 'Contributing Writer',
      publishedAt: new Date().toISOString().split('T')[0],
      featured: false,
    });

    toast({
      title: status === 'draft' ? 'Draft saved' : 'Submitted for review',
      description: status === 'draft'
        ? 'Your draft has been saved successfully.'
        : 'Your article has been submitted for editorial review.',
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSave('pending')} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="h-4 w-4 mr-2" /> Submit for Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Main editor */}
        <div className="space-y-5">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="font-serif text-2xl font-bold h-auto py-3 border-none bg-transparent shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
          />

          {/* Excerpt */}
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a short excerpt or summary..."
            rows={2}
            className="resize-none text-muted-foreground"
          />

          {/* Rich text editor */}
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {/* Sidebar settings */}
        <div className="space-y-5">
          {/* Status */}
          {article && (
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="text-sm font-semibold mb-2">Status</h3>
              <Badge variant="secondary" className="capitalize">{article.status}</Badge>
            </div>
          )}

          {/* Cover image */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold mb-3">Cover Image</h3>
            {coverPreview ? (
              <div className="relative aspect-[16/9] rounded-sm overflow-hidden mb-3">
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 bg-foreground/50 text-background hover:bg-foreground/70"
                  onClick={() => { setCoverImage(''); setCoverPreview(''); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-[16/9] rounded-sm border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-xs font-medium">Upload Cover</span>
              </button>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            {coverPreview && (
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => coverInputRef.current?.click()}>
                Change Image
              </Button>
            )}
          </div>

          {/* Category */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="text-sm font-semibold mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    category === cat
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
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
