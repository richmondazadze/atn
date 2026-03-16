import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <img src="/atn_logo_no_bg.png" alt="ATN" className="w-16 h-16 object-contain mx-auto mb-6 opacity-40" />
          <h1 className="text-[80px] font-semibold text-primary leading-none mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-2">Page not found</h2>
          <p className="text-sm text-muted">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="border-border"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} className="mr-2" /> Go back
          </Button>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <Home size={15} className="mr-2" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
