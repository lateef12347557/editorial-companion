                import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  LayoutDashboard,
  FileText,
  Users,
  Image,
  Tag,
  LogOut,
  Menu,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Star,
  Trash2,
  Plus,
  UserPlus,
  UserMinus,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import {
  useAdminArticles,
  useUpdateArticleStatus,
  useDeleteArticle,
  useAdminStats,
  useWriters,
  useAllProfiles,
  useManageWriterRole,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useAdminGallery,
  useToggleGalleryPublish,
  useDeleteGalleryImage,
  useUploadGalleryImage,
  usePendingApprovals,
  useApproveUser,
} from '@/hooks/useAdminData';

import { useAuth } from '@/contexts/AuthContext';


// Sidebar links
const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: ShieldCheck, label: 'Approvals', id: 'approvals' },
  { icon: FileText, label: 'Articles', id: 'articles' },
  { icon: Users, label: 'Writers', id: 'writers' },
  { icon: Image, label: 'Gallery', id: 'gallery' },
  { icon: Tag, label: 'Categories', id: 'categories' },
];


const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [newCategory, setNewCategory] = useState('');

  const [articleFilter, setArticleFilter] = useState<'all' | 'pending'>('all');

  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryAlbum, setGalleryAlbum] = useState('');
  const [galleryDesc, setGalleryDesc] = useState('');
  const [galleryFile, setGalleryFile] = useState<File | null>(null);


  // DATA HOOKS
  const { data: stats } = useAdminStats();

  const {
    data: articles = [],
    isLoading: articlesLoading,
  } = useAdminArticles();

  const updateArticle = useUpdateArticleStatus();
  const deleteArticle = useDeleteArticle();

  const { data: writers = [] } = useWriters();
  const { data: allProfiles = [] } = useAllProfiles();

  const manageWriter = useManageWriterRole();

  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const { data: galleryImages = [] } = useAdminGallery();
  const togglePublish = useToggleGalleryPublish();
  const deleteImage = useDeleteGalleryImage();
  const uploadImage = useUploadGalleryImage();

  const { data: pendingApprovals = [] } = usePendingApprovals();
  const approveUser = useApproveUser();


  const pendingArticles = articles.filter(
    (article) => article.status === 'pending'
  );


  const statusBadge = (status: string) => {
    const variant =
      status === 'published'
        ? 'default'
        : status === 'rejected'
        ? 'destructive'
        : 'secondary';

    return (
      <Badge variant={variant} className="capitalize text-xs">
        {status}
      </Badge>
    );
  };


  return (
    <div className="min-h-screen flex bg-background">

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        <div className="p-6 border-b">
          <Link to="/">
            <span className="font-bold text-xl">UPEBSA</span>
            <span className="block text-xs opacity-60">
              Admin Panel
            </span>
          </Link>
        </div>


        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (

            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm ${
                activeTab === link.id
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              }`}
            >
              <link.icon size={16} />
              {link.label}

            </button>
          ))}
        </nav>


        <div className="absolute bottom-0 w-full p-4 border-t">

          <Link to="/" className="flex items-center gap-2 text-sm">

            <LogOut size={16} />
            Back to site

          </Link>

        </div>

      </aside>


      {/* MAIN */}

      <div className="flex-1">

        <header className="border-b px-6 py-3 flex justify-between">

          <div className="flex gap-3 items-center">

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>

            <h1 className="font-semibold capitalize">
              {activeTab}
            </h1>

          </div>

          <Badge variant="outline">Admin</Badge>

        </header>


        <main className="p-6">

          {/* APPROVALS TAB */}

          {activeTab === 'approvals' && (

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <h2 className="font-semibold mb-4">

                Pending Articles ({pendingArticles.length})

              </h2>


              <ArticlesTable
                articles={pendingArticles}
                statusBadge={statusBadge}
                onUpdate={updateArticle.mutate}
                onDelete={deleteArticle.mutate}
              />


              <h2 className="font-semibold mt-10 mb-4">
                Pending User Approvals
              </h2>


              {pendingApprovals.map((profile) => (

                <div
                  key={profile.id}
                  className="border p-4 flex justify-between"
                >

                  <div>

                    <p>{profile.display_name}</p>

                    <p className="text-xs opacity-60">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>

                  </div>


                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      onClick={() =>
                        approveUser.mutate({
                          userId: profile.id,
                          approve: true,
                        })
                      }
                    >
                      Approve
                    </Button>


                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        approveUser.mutate({
                          userId: profile.id,
                          approve: false,
                        })
                      }
                    >
                      Deny
                    </Button>

                  </div>

                </div>

              ))}

            </motion.div>

          )}


          {/* ARTICLES TAB */}

          {activeTab === 'articles' && (

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <div className="flex gap-3 mb-4">

                <Button
                  size="sm"
                  onClick={() => setArticleFilter('all')}
                >
                  All
                </Button>

                <Button
                  size="sm"
                  onClick={() => setArticleFilter('pending')}
                >
                  Pending
                </Button>

              </div>


              <ArticlesTable
                articles={
                  articleFilter === 'pending'
                    ? pendingArticles
                    : articles
                }
                statusBadge={statusBadge}
                onUpdate={updateArticle.mutate}
                onDelete={deleteArticle.mutate}
              />

            </motion.div>

          )}

        </main>

      </div>

    </div>
  );
};




// ARTICLES TABLE COMPONENT

function ArticlesTable({
  articles,
  statusBadge,
  onUpdate,
  onDelete,
}: any) {

  return (

    <div className="border rounded-sm overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-secondary">

          <tr>

            <th className="text-left p-3">Title</th>

            <th>Status</th>

            <th className="text-right p-3">
              Actions
            </th>

          </tr>

        </thead>


        <tbody>

          {articles.map((article: any) => (

            <tr key={article.id} className="border-t">

              <td className="p-3">
                {article.title}
              </td>


              <td>
                {statusBadge(article.status)}
              </td>


              <td className="p-3 text-right">

                <div className="flex gap-2 justify-end">


                  {/* APPROVE */}
                  {article.status === 'pending' && (

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        onUpdate({
                          id: article.id,
                          status: 'published',
                        })
                      }
                    >
                      <CheckCircle size={16} />
                    </Button>

                  )}


                  {/* REJECT */}
                  {article.status === 'pending' && (

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        onUpdate({
                          id: article.id,
                          status: 'rejected',
                        })
                      }
                    >
                      <XCircle size={16} />
                    </Button>

                  )}


                  {/* DELETE */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(article.id)}
                  >
                    <Trash2 size={16} />
                  </Button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}


export default AdminDashboard;
