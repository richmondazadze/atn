import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

const trustBullets = [
  { text: 'Bank-grade security on every account' },
  { text: 'Real-time booking & instant confirmations' },
  { icon: CheckCircle2,text: 'Trusted by 12 000+ professionals globally' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const role = await login(data.email, data.password);

      if (!role) {
        toast.error('Invalid email or password');
        return;
      }

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'provider') {
        navigate('/provider');
      } else {
        navigate('/customer');
      }

      toast.success('Logged in successfully');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* ── Left panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-12 bg-gradient-teal-gold overflow-hidden">
        {/* Subtle noise / texture overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" aria-hidden="true" />

        {/* Photo panel – Full Bleed */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvvBJ851pOrplMONI-0HICH6gyxr7hYNEV5p-2hWulPrCJgl7bp3jNP7NwyuhRED4wn5TkpBssylvjAvUq7siya0b6tGzBFv_gOwcB50ZPz_CN_ZE5CKgr4DX5BiSdlPCR8CeDlHjrOAocp2rtYN9Sdr3OlzWIhjbxdmecpk7wqVbiadlUJBzA0qBWp-IpHg4oyQhsQ8Llf425N2be7VfYL8Wb0YJtWa9ppk3TEp7kJT1k8BbgKnBjM6CjBhMqFnfwULjPVkTXGggb')",
          }}
          aria-hidden="true"
        />

        {/* Gradient overlays for readability and depth */}
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/20 via-transparent to-black/60" />

        <div className="relative z-20 space-y-16">
          {/* Logo */}
          <div className="animate-fade-down">
            <Link to="/" className="flex items-center gap-3">
              <img src="/atn_logo_no_bg.png" alt="ATN" className="w-9 h-9 object-contain drop-shadow-md" />
              <span className="text-2xl font-semibold tracking-tight text-white drop-shadow">ATN</span>
            </Link>
          </div>

          {/* Headline + trust bullets */}
          <div className="animate-fade-up delay-100">
            <h1
              className="text-5xl font-bold leading-tight tracking-tight text-white max-w-md mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Manage your workflow with confidence.
            </h1>
            <p className="text-lg text-white/80 max-w-sm leading-relaxed mb-8">
              Join thousands of professionals using ATN to streamline daily operations and boost productivity.
            </p>

            {/* Trust bullets */}
            <ul className="space-y-4">
              {trustBullets.map(({ icon: Icon, text }, i) => (
                <li
                  key={text}
                  className={`flex items-center gap-3 animate-fade-up delay-${(i + 2) * 100}`}
                >
                  {Icon ? (
                    <span className="flex-shrink-0 w-8 h-8 rounded-full /15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
                      <Icon size={15} className="text-white" />
                    </span>
                  ) : (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full /40" />
                  )}
                  <span className="text-sm text-white/90 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-[420px] space-y-5">

          {/* Top nav row */}
          <div className="flex items-center justify-between animate-fade-down">
            <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm">
              <ArrowLeft size={16} />
              <span className="font-medium">Back</span>
            </Link>
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <img src="/atn_logo_no_bg.png" alt="ATN" className="w-7 h-7 object-contain" />
              <span className="text-lg font-semibold tracking-tight text-foreground">ATN</span>
            </Link>
          </div>

          {/* Heading */}
          <header className="flex flex-col gap-1 animate-fade-up">
            <h2
              className="text-3xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Welcome back
            </h2>
            <p className="text-muted text-xs leading-relaxed">
              Enter your details to sign in to your account.
            </p>
          </header>

          {/* OAuth buttons - Compact */}
          <div className="grid grid-cols-2 gap-2 animate-fade-up">
            <Button
              type="button"
              variant="outline"
              className="h-10 text-xs justify-center gap-2 font-medium hover:bg-background transition-colors"
              onClick={() => toast.message("Google sign-in isn't enabled.")}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 text-xs justify-center gap-2 font-medium hover:bg-background transition-colors"
              onClick={() => toast.message("Apple sign-in isn't enabled.")}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-border/60" />
            <span className="absolute bg-background px-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              or
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Email address</Label>
              <Input id="email" type="email" placeholder="you@email.com" className="h-10 text-sm focus-glow" {...register('email')} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Password</Label>
                <Link to="/reset-password" title="Reset password" className="text-[10px] text-primary hover:underline font-bold">Forgot password?</Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="h-10 text-sm focus-glow" {...register('password')} />
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-bold shadow-sm" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Log in'}
            </Button>
          </form>

          {/* Compact Demo Logins Strip */}
          <div className="bg-background/50 rounded-lg p-2.5 space-y-1 animate-fade-in border border-border/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">Demo Access</p>
            <div className="grid grid-cols-1 gap-1 text-[10px] leading-tight">
              <p><span className="font-bold text-foreground">Customer:</span> sarah.williams@email.com / customer123</p>
              <p><span className="font-bold text-foreground">Provider:</span> deja.johnson@email.com / provider123</p>
              <p><span className="font-bold text-foreground">Admin:</span> admin@atn.local / admin123</p>
            </div>
          </div>

          <footer className="text-center">
            <p className="text-[13px] text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-bold">Sign up for free</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
