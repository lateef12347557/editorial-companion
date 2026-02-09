import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, PenSquare, BarChart3, LogOut, Menu, Clock, CheckCircle, XCircle, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { writerStats, articles } from '@/data/mockData';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: FileText, label: 'My Articles', id: 'articles' },
  { icon: PenSquare, label: 'New Post', id: 'new' },
  { icon: BarChart3, label: 'My Stats', id: 'stats' },
];

const WriterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
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
              onClick={() => { setActiveTab(link.id); setSidebarOpen(false); }}
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
            <h1 className="font-serif text-lg font-semibold capitalize">{activeTab === 'new' ? 'New Post' : activeTab}</h1>
          </div>
          <Badge variant="outline" className="text-xs">Writer</Badge>
        </header>

        <main className="p-4 sm:p-6">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Published', value: writerStats.published, icon: Eye },
                  { label: 'Drafts', value: writerStats.drafts, icon: FileText },
                  { label: 'Pending', value: writerStats.pending, icon: Clock },
                  { label: 'Total Views', value: writerStats.totalViews.toLocaleString(), icon: BarChart3 },
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

              <h2 className="font-serif text-lg font-semibold mb-4">My Recent Articles</h2>
              <div className="space-y-3">
                {articles.slice(0, 4).map((article) => (
                  <div key={article.id} className="bg-card border border-border rounded-sm p-4 flex items-center gap-4">
                    {statusIcon(article.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{article.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{article.category} · {article.readTime}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">{article.status}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab !== 'overview' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <PenSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-xl font-semibold mb-2">
                {activeTab === 'new' ? 'Create New Post' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Connect Lovable Cloud to enable the rich-text editor, image uploads, and article submission workflow.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WriterDashboard;
