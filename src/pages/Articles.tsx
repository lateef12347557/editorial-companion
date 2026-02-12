import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import ArticleCard from '@/components/articles/ArticleCard';
import { usePublishedArticles, usePublicCategories } from '@/hooks/usePublicData';

const Articles = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: articles = [], isLoading } = usePublishedArticles();
  const { data: categories = [] } = usePublicCategories();

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || a.category_name === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="editorial-container py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="editorial-divider-accent mb-4" />
            <h1 className="font-serif text-4xl font-bold mb-4">Articles</h1>
            <p className="opacity-80 max-w-xl">Explore our collection of articles spanning education, science, culture, politics, and more.</p>
          </motion.div>
        </div>
      </section>

      <section className="editorial-container py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                  activeCategory === cat
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-center py-20 text-muted-foreground">Loading articles...</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-serif text-xl">No articles found</p>
            <p className="text-sm mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </section>
    </>
  );
};

export default Articles;
