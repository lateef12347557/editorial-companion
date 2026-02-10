import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/articles', label: 'Articles' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isWriter, displayName, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardLink = isAdmin ? '/admin' : isWriter ? '/writer' : null;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="editorial-container">
        <div className="flex items-center justify-between py-2 border-b border-border text-sm text-muted-foreground">
          <span className="hidden sm:block">Independent Journalism · Trusted Voices</span>
          <span className="sm:hidden text-xs">UPEBSA Editorial</span>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs hidden sm:block">{displayName || user.email}</span>
                {dashboardLink && (
                  <Link to={dashboardLink} className="hover:text-foreground transition-colors flex items-center gap-1">
                    <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                  </Link>
                )}
                <button onClick={handleSignOut} className="hover:text-foreground transition-colors flex items-center gap-1">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="editorial-container">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              UPEBSA
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-muted-foreground -mt-1">
              Editorial & Press
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-sm ${
                  location.pathname === link.to
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="ghost" size="icon" className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </nav>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="editorial-container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                    location.pathname === link.to
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  {dashboardLink && (
                    <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-accent">
                      Dashboard
                    </Link>
                  )}
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="px-4 py-3 text-sm font-medium text-left text-muted-foreground">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
