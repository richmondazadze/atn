import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const NAV_LINKS = [
  { label: 'Home', path: '/', exact: true },
  { label: 'Browse', path: '/browse' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Women Rise', path: '/women-rise-initiative', accent: true },
  { label: 'WiFi Hubs', path: '/wifi-hubs' },
];

export function PublicNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function isActive(path: string, exact?: boolean) {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-2xl shadow-sm border-b border-border/60'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[72px]">
          <nav className="flex items-center justify-between h-16 lg:h-[72px]" aria-label="Main navigation">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl py-1 group"
            >
              <div className="relative">
                <img
                  src="/atn_logo_no_bg.png"
                  alt=""
                  className="w-9 h-9 lg:w-10 lg:h-10 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
                  aria-hidden
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-base lg:text-lg font-bold tracking-tight text-foreground leading-tight block">
                  ATN
                </span>
                <span className="text-[10px] text-muted leading-tight hidden sm:block mt-0.5 tracking-wide">
                  Access Terrain Network
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(link => {
                const active = isActive(link.path, link.exact);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      link.accent
                        ? active
                          ? 'text-rose'
                          : 'text-rose/80 hover:text-rose'
                        : active
                          ? 'text-primary'
                          : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" className="text-sm font-medium h-10 px-5">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild variant="accent" className="text-sm font-semibold h-10 px-6 shadow-sm">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden w-11 h-11 flex items-center justify-center -mr-2 rounded-xl hover:bg-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className={`block transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'} absolute`}>
                <Menu size={22} />
              </span>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background/98 backdrop-blur-2xl border-t border-border/50 px-4 pb-6 pt-2">
            <div className="flex flex-col gap-0.5 mb-4">
              {NAV_LINKS.map(link => {
                const active = isActive(link.path, link.exact);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                      link.accent
                        ? active
                          ? 'text-rose bg-surface-rose'
                          : 'text-rose/80 hover:bg-surface-rose hover:text-rose'
                        : active
                          ? 'text-primary bg-surface-teal'
                          : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/60">
              <Button asChild variant="outline" className="w-full h-11 text-sm font-medium">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild variant="accent" className="w-full h-11 text-sm font-semibold">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
