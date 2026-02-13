import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'writer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isWriter, isApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'writer' && !isWriter && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Show pending approval message for unapproved writers (admins bypass)
  if (requiredRole === 'writer' && !isAdmin && !isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/50">
        <div className="bg-card border border-border rounded-sm p-8 max-w-md mx-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Clock className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Account Under Review</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Your account has been created successfully. An administrator will review and approve your account shortly. You'll be able to access the writer dashboard once approved.
          </p>
          <div className="editorial-divider-accent mx-auto mb-6" />
          <p className="text-xs text-muted-foreground mb-4">
            Thank you for your patience. We review all new accounts to maintain quality.
          </p>
          <Button asChild variant="outline">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
