import { Outlet, Link } from 'react-router';
import { PublicNavbar } from '../components/PublicNavbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-16 lg:pt-[72px]">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-secondary/50">
        <div className="page-shell py-10 lg:py-14">
          <div className="content-shell">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 sm:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <img src="/atn_logo_no_bg.png" alt="ATN" className="w-7 h-7 object-contain" />
                <span className="font-semibold text-foreground">ATN</span>
              </Link>
              <p className="text-xs text-muted leading-relaxed">
                Access Terrain Network — connecting communities with trusted local service providers.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Platform</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/browse" className="text-sm text-muted hover:text-foreground transition-colors">Browse</Link>
                <Link to="/how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</Link>
                <Link to="/signup" className="text-sm text-muted hover:text-foreground transition-colors">Sign Up</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Legal</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-sm text-muted hover:text-foreground transition-colors">Terms of Service</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Support</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/login" className="text-sm text-muted hover:text-foreground transition-colors">Log In</Link>
                <a href="mailto:support@atn.local" className="text-sm text-muted hover:text-foreground transition-colors">Contact</a>
              </nav>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted">&copy; {new Date().getFullYear()} Access Terrain Network. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-xs text-muted hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="text-xs text-muted hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
