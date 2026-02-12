import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/articles/ArticleCard';
import { usePublishedArticles } from '@/hooks/usePublicData';

const Index = () => {
  const { data: articles = [], isLoading } = usePublishedArticles();

  const featuredArticles = articles.filter((a) => a.featured);
  const latestArticles = articles.filter((a) => !a.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="editorial-container py-16 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="editorial-divider-accent mb-6" />
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 text-balance">
              Independent Journalism.<br />Rigorous Scholarship.
            </h1>
            <p className="text-lg sm:text-xl opacity-80 max-w-xl mb-8 leading-relaxed">
              UPEBSA Editorial & Press amplifies voices that shape the future — through fearless reporting, thoughtful analysis, and creative expression.
            </p>
            <div className="flex gap-3">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <Link to="/articles">Read Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/about">About Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="editorial-container py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="editorial-divider-accent mb-3" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">Featured Stories</h2>
          </div>
          <Link to="/articles" className="text-sm text-accent font-medium hover:underline hidden sm:block">View all →</Link>
        </div>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : featuredArticles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredArticles.slice(0, 2).map((article) => (
              <ArticleCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No featured stories yet.</p>
        )}
      </section>

      {/* Latest + Sidebar */}
      <section className="editorial-container pb-16">
        <div className="editorial-divider mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-xl font-bold mb-6">Latest Articles</h2>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No articles yet.</p>
            )}
          </div>
          <aside>
            <h2 className="font-serif text-xl font-bold mb-6">Trending</h2>
            <div className="space-y-4">
              {articles.slice(0, 4).map((article, i) => (
                <div key={article.id}>
                  <ArticleCard article={article} variant="compact" />
                  {i < 3 && <div className="editorial-divider mt-4" />}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary">
        <div className="editorial-container py-16 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">Join Our Community of Writers</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Share your perspective with a growing audience. Apply to become a contributing writer today.
          </p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link to="/auth">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
