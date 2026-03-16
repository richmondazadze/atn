import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});
type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function onSubmit(_data: FormData) {
    toast.success('Reset link sent — check your email');
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-border rounded p-8">
        <div className="mb-6">
          <Link to="/" className="text-2xl font-semibold text-foreground">ATN</Link>
        </div>

        <h1 className="text-2xl font-semibold mb-1">Reset password</h1>
        <p className="text-sm text-muted mb-6">Enter your email to receive a reset link</p>

        {isSubmitSuccessful ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✉️</span>
            </div>
            <p className="text-sm text-foreground font-medium mb-1">Check your inbox</p>
            <p className="text-xs text-muted mb-4">We sent you a password reset link.</p>
            <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                className="mt-1"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
