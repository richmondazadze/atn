import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
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
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormData) {
    if (data.email.includes('admin')) {
      setRole('admin');
      navigate('/admin');
    } else if (data.email.includes('provider') || data.email.includes('deja')) {
      setRole('provider');
      navigate('/provider');
    } else {
      setRole('customer');
      navigate('/customer');
    }
    toast.success('Logged in successfully');
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-border rounded p-8">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/atn_logo_no_bg.png" alt="ATN" className="w-8 h-8 object-contain" />
            <div>
              <div className="text-base font-semibold text-foreground leading-none">ATN</div>
              <div className="text-xs text-muted mt-0.5">Access Terrain Network</div>
            </div>
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-muted mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="mt-1"
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="password">Password</Label>
              <Link to="/reset-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-sm text-center text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
        </p>

      </div>
    </div>
  );
}
