import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, Image, Tag, LogOut, Menu,
  CheckCircle, XCircle, Eye, EyeOff, Star, Trash2, Plus, UserPlus, UserMinus, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  useAdminArticles, useUpdateArticleStatus, useDeleteArticle, useAdminStats,
  useWriters, useAllProfiles, useManageWriterRole,
  useCategories, useCreateCategory, useDeleteCategory,
  useAdminGallery, useToggleGalleryPublish, useDeleteGalleryImage, useUploadGalleryImage,
  usePendingApprovals, useApproveUser,
} from '@/hooks/useAdminData';
import { useAuth } from '@/contexts/AuthContext';
import PendingArticlesPanel from '@/components/admin/PendingArticlesPanel';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: ShieldCheck, label: 'Approvals', id: 'approvals' },
  { icon: FileText, label: 'Articles', id: 'articles' },
  { icon: Users, label: 'Writers', id: 'writers' },
  { icon: Image, label: 'Gallery', id: 'gallery' },
  { icon: Tag, label: 'Categories', id: 'categories' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [articleFilter, setArticleFilter] = useState<'all' | 'pending'>('all');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryAlbum, setGalleryAlbum] = useState('');
  const [galleryDesc, setGalleryDesc] = useState('');
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const { user } = useAuth();

  // Data hooks
  const { data: stats } = useAdminStats();
  const { data: articles, isLoading: articlesLoading } = useAdminArticles();
  const updateArticle = useUpdateArticleStatus();
  const deleteArticle = useDeleteArticle();
  const { data: writers } = useWriters();
  const { data: allProfiles } = useAllProfiles();
  const manageWriter = useManageWriterRole();
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { data: galleryImages } = useAdminGallery();
  const togglePublish = useToggleGalleryPublish();
  const deleteImage = useDeleteGalleryImage();
  const uploadImage = useUploadGalleryImage();
  const { data: pendingApprovals } = usePendingApprovals();
  const approveUser = useApproveUser();

  const writerUserIds = new Set(writers?.map((w) => w.user_id) || []);
  const nonWriterProfiles = allProfiles?.filter((p) => !writerUserIds.has(p.id)) || [];

  const statusBadge = (status: string) => {
    const variant = status === 'published' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary';
    return <Badge variant={variant} className="text-xs capitalize">{status}</Badge>;
  };

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
          {/* ───── Overview ───── */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Articles', value: stats?.totalArticles ?? '—', icon: FileText },
                  { label: 'Published', value: stats?.publishedArticles ?? '—', icon: Eye },
                  { label: 'Pending Review', value: stats?.pendingReview ?? '—', icon: CheckCircle },
                  { label: 'Drafts', value: stats?.drafts ?? '—', icon: FileText },
                  { label: 'Total Writers', value: stats?.totalWriters ?? '—', icon: Users },
                  { label: 'Pending Approvals', value: pendingApprovals?.length ?? '—', icon: ShieldCheck },
                  { label: 'Featured', value: stats?.featuredArticles ?? '—', icon: Star },
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
              {articlesLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                <ArticlesTable
                  articles={(articles || []).slice(0, 10)}
                  statusBadge={statusBadge}
                  onUpdate={updateArticle.mutate}
                  onDelete={deleteArticle.mutate}
                />
              )}
            </motion.div>
          )}

          {/* ───── Approvals ───── */}
          {activeTab === 'approvals' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {/* Pending Articles */}
              <PendingArticlesPanel />

              {/* Pending Account Approvals */}
              <div className="mt-10">
                <h2 className="font-serif text-lg font-semibold mb-4">Pending Account Approvals</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  New users need your approval before they can access the writer dashboard.
                </p>
                <div className="space-y-2">
                  {pendingApprovals?.length === 0 && (
                    <p className="text-sm text-muted-foreground">No pending approvals.</p>
                  )}
                  {pendingApprovals?.map((profile) => (
                    <div key={profile.id} className="bg-card border border-border rounded-sm p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{profile.display_name || 'Unnamed'}</p>
                        <p className="text-xs text-muted-foreground">
                          Signed up {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                          onClick={() => approveUser.mutate({ userId: profile.id, approve: true })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => approveUser.mutate({ userId: profile.id, approve: false })}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'articles' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setArticleFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${articleFilter === 'all' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                  All ({articles?.length ?? 0})
                </button>
                <button
                  onClick={() => setArticleFilter('pending')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${articleFilter === 'pending' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                  Pending ({articles?.filter(a => a.status === 'pending').length ?? 0})
                </button>
              </div>
              {articlesLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                <ArticlesTable
                  articles={(articleFilter === 'pending' ? (articles || []).filter(a => a.status === 'pending') : articles || [])}
                  statusBadge={statusBadge}
                  onUpdate={updateArticle.mutate}
                  onDelete={deleteArticle.mutate}
                />
              )}
            </motion.div>
          )}

          {/* ───── Writers ───── */}
          {activeTab === 'writers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <h2 className="font-serif text-lg font-semibold mb-4">Current Writers</h2>
              <div className="space-y-2 mb-8">
                {writers?.length === 0 && <p className="text-sm text-muted-foreground">No writers yet.</p>}
                {writers?.map((w) => (
                  <div key={w.user_id} className="bg-card border border-border rounded-sm p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{(w.profiles as any)?.display_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">Since {new Date(w.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => manageWriter.mutate({ userId: w.user_id, action: 'remove' })}
                    >
                      <UserMinus className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                ))}
              </div>

              <h2 className="font-serif text-lg font-semibold mb-4">Add Writer</h2>
              <div className="space-y-2">
                {nonWriterProfiles.length === 0 && <p className="text-sm text-muted-foreground">All users already have roles or no users available.</p>}
                {nonWriterProfiles.map((p) => (
                  <div key={p.id} className="bg-card border border-border rounded-sm p-4 flex items-center justify-between">
                    <p className="font-medium text-sm">{p.display_name || 'Unnamed'}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => manageWriter.mutate({ userId: p.id, action: 'add' })}
                    >
                      <UserPlus className="h-4 w-4 mr-1" /> Make Writer
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ───── Gallery ───── */}
          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {/* Upload Form */}
              <div className="bg-card border border-border rounded-sm p-5 mb-6">
                <h3 className="font-serif text-base font-semibold mb-3">Upload Image</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <Input placeholder="Title *" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} />
                  <Input placeholder="Album (optional)" value={galleryAlbum} onChange={e => setGalleryAlbum(e.target.value)} />
                </div>
                <Input placeholder="Description (optional)" value={galleryDesc} onChange={e => setGalleryDesc(e.target.value)} className="mb-3" />
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setGalleryFile(e.target.files?.[0] || null)}
                    className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
                  />
                  <Button
                    disabled={!galleryFile || !galleryTitle.trim() || uploadImage.isPending}
                    onClick={() => {
                      if (galleryFile && galleryTitle.trim() && user) {
                        uploadImage.mutate(
                          { file: galleryFile, title: galleryTitle.trim(), album: galleryAlbum.trim(), description: galleryDesc.trim(), uploaderId: user.id },
                          { onSuccess: () => { setGalleryTitle(''); setGalleryAlbum(''); setGalleryDesc(''); setGalleryFile(null); } }
                        );
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> {uploadImage.isPending ? 'Uploading…' : 'Upload'}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{galleryImages?.length ?? 0} images</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages?.map((img) => (
                  <div key={img.id} className="bg-card border border-border rounded-sm overflow-hidden">
                    <div className="aspect-square">
                      <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{img.title}</p>
                      <p className="text-xs text-muted-foreground">{img.album || 'No album'}</p>
                      <Badge variant={img.is_published ? 'default' : 'secondary'} className="text-[10px] mt-1">
                        {img.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <div className="flex gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => togglePublish.mutate({ id: img.id, is_published: !img.is_published })}
                          title={img.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {img.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => deleteImage.mutate(img.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {galleryImages?.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No gallery images yet.</p>}
              </div>
            </motion.div>
          )}

          {/* ───── Categories ───── */}
          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="flex gap-2 mb-6">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name…"
                  className="max-w-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCategory.trim()) {
                      createCategory.mutate({ name: newCategory.trim() });
                      setNewCategory('');
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (newCategory.trim()) {
                      createCategory.mutate({ name: newCategory.trim() });
                      setNewCategory('');
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {categories?.map((cat) => (
                  <div key={cat.id} className="bg-card border border-border rounded-sm p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteCategory.mutate(cat.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {categories?.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

/* ───── Articles Table Sub-component ───── */

function ArticlesTable({
  articles,
  statusBadge,
  onUpdate,
  onDelete,
}: {
  articles: any[];
  statusBadge: (s: string) => React.ReactNode;
  onUpdate: (args: { id: string; status?: string; featured?: boolean }) => void;
  onDelete: (id: string) => void;
}) {
  return (
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
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {(article.profiles as any)?.display_name || '—'}
                </td>
                <td className="px-4 py-3">{statusBadge(article.status)}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {(article.categories as any)?.name || '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {article.status !== 'published' && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Publish"
                        onClick={() => onUpdate({ id: article.id, status: 'published' })}>
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {article.status === 'pending' && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Reject"
                        onClick={() => onUpdate({ id: article.id, status: 'rejected' })}>
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" title={article.featured ? 'Unfeature' : 'Feature'}
                      onClick={() => onUpdate({ id: article.id, featured: !article.featured })}>
                      {article.featured ? <EyeOff className="h-3.5 w-3.5 text-accent" /> : <Star className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete"
                      onClick={() => onDelete(article.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No articles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
