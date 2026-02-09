import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article } from '@/data/mockData';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

const ArticleCard = ({ article, variant = 'default' }: ArticleCardProps) => {
  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link to={`/article/${article.slug}`} className="group block">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm mb-4">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'var(--overlay-gradient)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                {article.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground leading-tight mb-2">
                {article.title}
              </h2>
              <p className="text-sm text-primary-foreground/70 line-clamp-2">{article.excerpt}</p>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="group"
      >
        <Link to={`/article/${article.slug}`} className="flex gap-4">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {article.category}
            </span>
            <h3 className="font-serif text-sm font-semibold leading-snug mt-1 group-hover:text-accent transition-colors line-clamp-2">
              {article.title}
            </h3>
            <span className="text-xs text-muted-foreground mt-1 block">{article.readTime}</span>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link to={`/article/${article.slug}`} className="block">
        <div className="aspect-[3/2] overflow-hidden rounded-sm mb-3">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          {article.category}
        </span>
        <h3 className="font-serif text-lg font-semibold leading-snug mt-1 mb-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;
