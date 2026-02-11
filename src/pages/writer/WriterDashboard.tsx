import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, PenSquare, BarChart3, LogOut, Menu, Clock, CheckCircle, XCircle, Eye, Edit, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyArticles, useWriterStats, useDeleteMyArticle } from '@/hooks/useWriterData';
import ArticleCompose from '@/components/editor/ArticleCompose';
import '@/components/editor/editor.css';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: FileText, label: 'My Articles', id: 'articles' },
  { icon: PenSquare, label: 'New Post', id: 'new' },
  { icon: BarChart3, label: 'My Stats', id: 'stats' },
];

interface EditingArticle {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category_id: string | null;
  cover_image_url: string | null;
  status: string;
  slug: string;
}

const WriterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<EditingArticle | null>(null);

  const { data: articles, isLoading } = useMyArticles();
  const { data: stats } = useWriterStats();
  const deleteArticle = useDeleteMyArticle();

  const statusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category_id: article.category_id,
      cover_image_url: article.cover_image_url,
      status: article.status,
      slug: article.slug,
    });
    setActiveTab('new');
  };

  const handleNewPost = () => {
    setEditingArticle(null);
    setActiveTab('new');
  };

  const handleSaved = () => {
    setEditingArticle(null);
    setActiveTab('articles');
  };

  const currentTabLabel = () => {
    if (activeTab === 'new') return editingArticle ? 'Edit Post' : 'New Post';
    return activeTab;
  };

  const statusBadge = (status: string) => {
    const variant = status === 'published' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary';
    return <Badge variant={variant} className="text-xs capitalize flex-shrink-0">{status}</Badge>;
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="block">
            <span className="font-serif text-xl font-bold">UPEBSA</span>
            <span className="block text-[10px] tracking-[0.3em] uppercase opacity-60">Writer Portal</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.id === 'new') handleNewPost();
                else setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                activeTab === link.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground px-3 py-2">
            <LogOut className="h-4 w-4" /> Back to Site
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-serif text-lg font-semibold capitalize">{currentTabLabel()}</h1>
          </div>
          <Badge variant="outline" className="text-xs">Writer</Badge>
        </header>

        <main className="p-4 sm:p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Published', value: stats?.published ?? '—', icon: Eye },
                  { label: 'Drafts', value: stats?.drafts ?? '—', icon: FileText },
                  { label: 'Pending', value: stats?.pending ?? '—', icon: Clock },
                  { label: 'Total', value: stats?.totalArticles ?? '—', icon: BarChart3 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <stat.icon className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-serif text-2xl font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold">My Recent Articles</h2>
                <Button variant="outline" size="sm" onClick={handleNewPost}>
                  <PenSquare className="h-4 w-4 mr-2" /> New Post
                </Button>
              </div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                <div className="space-y-3">
                  {(articles || []).slice(0, 5).map((article) => (
                    <div key={article.id} className="bg-card border border-border rounded-sm p-4 flex items-center gap-4">
                      {statusIcon(article.status)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{article.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(article.categories as any)?.name || 'No category'} · {article.read_time || '—'}
                        </p>
                      </div>
                      {statusBadge(article.status)}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditArticle(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {articles?.length === 0 && (
                    <p className="text-sm text-muted-foreground">No articles yet. Create your first post!</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* My Articles */}
          {activeTab === 'articles' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{articles?.length ?? 0} articles total</p>
                <Button variant="outline" size="sm" onClick={handleNewPost}>
                  <PenSquare className="h-4 w-4 mr-2" /> New Post
                </Button>
              </div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                <div className="space-y-3">
                  {(articles || []).map((article) => (
                    <div key={article.id} className="bg-card border border-border rounded-sm p-4 flex items-center gap-4">
                      {article.cover_image_url && (
                        <img src={article.cover_image_url} alt="" className="w-16 h-12 object-cover rounded-sm flex-shrink-0 hidden sm:block" />
                      )}
                      {statusIcon(article.status)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{article.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(article.categories as any)?.name || 'No category'} · {article.read_time || '—'} · {new Date(article.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      {statusBadge(article.status)}
                      <div className="flex gap-1">
                        {(article.status === 'draft' || article.status === 'rejected') && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditArticle(article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteArticle.mutate(article.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {articles?.length === 0 && (
                    <p className="text-sm text-muted-foreground">No articles yet.</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* New / Edit Post */}
          {activeTab === 'new' && (
            <ArticleCompose
              article={editingArticle}
              onBack={() => setActiveTab(editingArticle ? 'articles' : 'overview')}
              onSaved={handleSaved}
            />
          )}

          {/* Stats */}
          {activeTab === 'stats' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Total Articles', value: stats?.totalArticles ?? '—' },
                  { label: 'Published', value: stats?.published ?? '—' },
                  { label: 'Drafts', value: stats?.drafts ?? '—' },
                  { label: 'Pending Review', value: stats?.pending ?? '—' },
                  { label: 'Rejected', value: stats?.rejected ?? '—' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-sm p-5">
                    <span className="text-sm text-muted-foreground block mb-1">{stat.label}</span>
                    <span className="font-serif text-2xl font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WriterDashboard;
