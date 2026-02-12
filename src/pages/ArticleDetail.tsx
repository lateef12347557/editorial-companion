import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { usePublishedArticleBySlug } from '@/hooks/usePublicData';

const ArticleDetail = () => {
  const { slug } = useParams();
  const { data: article, isLoading } = usePublishedArticleBySlug(slug);

  if (isLoading) {
    return (
      <div className="editorial-container py-20 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="editorial-container py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Article Not Found</h1>
        <Link to="/articles" className="text-accent hover:underline">← Back to articles</Link>
      </div>
    );
  }

  const coverImg = article.cover_image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&q=80';

  return (
    <article>
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img src={coverImg} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'var(--overlay-gradient)' }} />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="editorial-container pb-8">
            <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to articles
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">{article.category_name}</span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mt-2">
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="editorial-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {article.author_name}</span>
            {article.read_time && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {article.read_time}</span>
              </>
            )}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="prose prose-lg max-w-none">
            {article.excerpt && <p className="text-lg font-medium text-foreground leading-relaxed mb-4">{article.excerpt}</p>}
            {article.content && (
              <div className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
            )}
          </motion.div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
