import { motion } from 'framer-motion';
import { CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react'; // Added Loader2 for better UX
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminArticles, useUpdateArticleStatus, useDeleteArticle } from '@/hooks/useAdminData';

const PendingArticlesPanel = () => {
  const { data: articles, isLoading, error } = useAdminArticles();
  const updateArticle = useUpdateArticleStatus();
  const deleteArticle = useDeleteArticle();

  // FIX 1: Use toLowerCase() to ensure 'Pending' vs 'pending' doesn't break the filter
  const pendingArticles = (articles || []).filter(
    (a) => a.status?.toLowerCase() === 'pending'
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-5 w-5 text-accent" />
        <h2 className="font-serif text-lg font-semibold">Pending Articles</h2>
        <Badge variant="secondary" className="text-xs">
          {pendingArticles.length}
        </Badge>
      </div>
      
      {/* Error State Handling */}
      {error && (
        <p className="text-sm text-destructive mb-4">Error loading articles. Please check permissions.</p>
      )}

      <p className="text-sm text-muted-foreground mb-6">
        Review and approve or reject articles submitted by writers before they appear on the public site.
      </p>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading articles...
        </div>
      ) : pendingArticles.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-8 text-center">
          <CheckCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No pending articles — you're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingArticles.map((article) => (
            <div
              key={article.id}
              className="bg-card border border-border rounded-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{article.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {/* FIX 2: Added optional chaining for common variations of profile/profiles */}
                  <span>
                    {(article.profiles as any)?.display_name || 
                     (article.author as any)?.display_name || 
                     'Unknown author'}
                  </span>
                  <span>·</span>
                  <span>{(article.categories as any)?.name || 'Uncategorized'}</span>
                  <span>·</span>
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => updateArticle.mutate({ id: article.id, status: 'published' })}
                  disabled={updateArticle.isPending}
                >
                  {updateArticle.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />} 
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => updateArticle.mutate({ id: article.id, status: 'rejected' })}
                  disabled={updateArticle.isPending}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PendingArticlesPanel;
