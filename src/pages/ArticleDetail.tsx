import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { articles } from '@/data/mockData';

const ArticleDetail = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="editorial-container py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Article Not Found</h1>
        <Link to="/articles" className="text-accent hover:underline">← Back to articles</Link>
      </div>
    );
  }

  return (
    <article>
      {/* Cover */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'var(--overlay-gradient)' }} />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="editorial-container pb-8">
            <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to articles
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">{article.category}</span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mt-2">
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Meta + Content */}
      <div className="editorial-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {article.author}</span>
            <span>·</span>
            <span>{article.authorRole}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {article.readTime}</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg font-medium text-foreground leading-relaxed mb-4">{article.excerpt}</p>
            {article.content.split('\n').map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
