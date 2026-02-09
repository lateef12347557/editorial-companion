import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, Image, Tag, BarChart3, LogOut, Menu, X, CheckCircle, XCircle, Eye, EyeOff, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminStats, articles } from '@/data/mockData';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: FileText, label: 'Articles', id: 'articles' },
  { icon: Users, label: 'Writers', id: 'writers' },
  { icon: Image, label: 'Gallery', id: 'gallery' },
  { icon: Tag, label: 'Categories', id: 'categories' },
  { icon: BarChart3, label: 'Analytics', id: 'analytics' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="block">
            <span className="font-serif text-xl font-bold">UPEBSA</span>
            <span className="block text-[10px] tracking-[0.3em] uppercase opacity-60">Admin Panel</span>
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

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-background border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-serif text-lg font-semibold capitalize">{activeTab}</h1>
          </div>
          <Badge variant="outline" className="text-xs">Admin</Badge>
        </header>

        <main className="p-4 sm:p-6">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Articles', value: adminStats.totalArticles, icon: FileText },
                  { label: 'Published', value: adminStats.publishedArticles, icon: Eye },
                  { label: 'Pending Review', value: adminStats.pendingReview, icon: CheckCircle },
                  { label: 'Total Writers', value: adminStats.totalWriters, icon: Users },
                  { label: 'Total Views', value: adminStats.totalViews.toLocaleString(), icon: BarChart3 },
                  { label: 'This Month', value: adminStats.thisMonthViews.toLocaleString(), icon: Star },
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

              <h2 className="font-serif text-lg font-semibold mb-4">Recent Articles</h2>
              <div className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Title</th>
                        <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Author</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                        <th className="text-right px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {articles.map((article) => (
                        <tr key={article.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium max-w-xs truncate">{article.title}</td>
                          <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{article.author}</td>
                          <td className="px-4 py-3">
                            <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="text-xs capitalize">
                              {article.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{article.category}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7"><CheckCircle className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7"><XCircle className="h-3.5 w-3.5" /></Button>
                              {article.featured ? (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-accent"><EyeOff className="h-3.5 w-3.5" /></Button>
                              ) : (
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Star className="h-3.5 w-3.5" /></Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'overview' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-xl font-semibold mb-2 capitalize">{activeTab} Management</h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Connect Lovable Cloud to enable full {activeTab} management with database storage, authentication, and real-time updates.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
