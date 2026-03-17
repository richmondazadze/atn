import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
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
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side: Branding/Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-foreground overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-35 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvvBJ851pOrplMONI-0HICH6gyxr7hYNEV5p-2hWulPrCJgl7bp3jNP7NwyuhRED4wn5TkpBssylvjAvUq7siya0b6tGzBFv_gOwcB50ZPz_CN_ZE5CKgr4DX5BiSdlPCR8CeDlHjrOAocp2rtYN9Sdr3OlzWIhjbxdmecpk7wqVbiadlUJBzA0qBWp-IpHg4oyQhsQ8Llf425N2be7VfYL8Wb0YJtWa9ppk3TEp7kJT1k8BbgKnBjM6CjBhMqFnfwULjPVkTXGggb')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />

        <div className="relative z-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/atn_logo_no_bg.png" alt="ATN" className="w-9 h-9 object-contain" />
            <span className="text-2xl font-semibold tracking-tight text-white">ATN</span>
          </Link>
        </div>

        <div className="relative z-20 mb-12">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white max-w-lg mb-6">
            Manage your workflow with confidence.
          </h1>
          <p className="text-xl text-white/80 max-w-md leading-relaxed">
            Join thousands of professionals using ATN to streamline their daily operations and boost productivity.
          </p>
        </div>

        <div className="relative z-20 flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="h-10 w-10 rounded-full border-2 border-foreground bg-white/20" />
            <div className="h-10 w-10 rounded-full border-2 border-foreground bg-white/20" />
            <div className="h-10 w-10 rounded-full border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
              +12k
            </div>
          </div>
          <span className="text-sm text-white/70 font-medium">Trusted by leading companies globally.</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground">
              <ArrowLeft size={18} />
              <span className="text-xs font-medium">Back to home</span>
            </Link>
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <img src="/atn_logo_no_bg.png" alt="ATN" className="w-7 h-7 object-contain" />
              <span className="text-lg font-semibold tracking-tight text-foreground">ATN</span>
            </Link>
          </div>

          <header className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h2>
            <p className="text-muted">Please enter your details to sign in to your account.</p>
          </header>

          <div className="rounded-lg border border-dashed border-border bg-secondary/60 p-4 text-xs text-muted">
            <p className="font-semibold text-foreground mb-2">Demo logins</p>
            <ul className="space-y-1">
              <li>
                <span className="font-medium text-foreground">Customer</span>:{" "}
                <code className="px-1 py-0.5 bg-background rounded border border-border">sarah.williams@email.com</code>{" "}
                / <code className="px-1 py-0.5 bg-background rounded border border-border">customer123</code>
              </li>
              <li>
                <span className="font-medium text-foreground">Provider</span>:{" "}
                <code className="px-1 py-0.5 bg-background rounded border border-border">deja.johnson@email.com</code>{" "}
                / <code className="px-1 py-0.5 bg-background rounded border border-border">provider123</code>
              </li>
              <li>
                <span className="font-medium text-foreground">Admin</span>:{" "}
                <code className="px-1 py-0.5 bg-background rounded border border-border">admin@atn.local</code> /{" "}
                <code className="px-1 py-0.5 bg-background rounded border border-border">admin123</code>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 justify-center"
              onClick={() => toast.message("Google sign-in isn't enabled in this demo.")}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 justify-center"
              onClick={() => toast.message("Apple sign-in isn't enabled in this demo.")}
            >
              Apple
            </Button>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-3 text-xs font-medium text-muted uppercase tracking-widest">
              or email
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="h-12"
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/reset-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="h-12"
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted select-none">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
              Remember me for 30 days
            </label>

            <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Log in'}
            </Button>
          </form>

          <footer className="pt-2 text-center">
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">Sign up for free</Link>
            </p>
          </footer>

          <div className="pt-8 border-t border-border flex items-center justify-center gap-6 text-[10px] text-muted uppercase tracking-widest font-semibold">
            <Link className="hover:text-foreground" to="/privacy">Privacy Policy</Link>
            <Link className="hover:text-foreground" to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
