import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$|^\d{10}$/, 'Enter a valid phone number').or(z.string().min(10, 'Enter a valid phone number')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const { setRole: setAuthRole } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function onSubmit(_data: FormData) {
    setAuthRole(role);
    navigate('/verify-email');
    toast.success('Account created! Check your email to verify.');
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-border rounded p-8">
        <div className="mb-6 text-center">
          <Link to="/" className="text-2xl font-semibold text-foreground">ATN</Link>
          <h1 className="text-2xl font-semibold mt-4 mb-1">Create your account</h1>
          <p className="text-sm text-muted">Join Access Terrain Network</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Role selection */}
          <div>
            <Label className="mb-2 block">I want to…</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as 'customer' | 'provider')} className="space-y-2">
              <div className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-colors ${role === 'customer' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <RadioGroupItem value="customer" id="role-customer" />
                <label htmlFor="role-customer" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Book services</div>
                  <div className="text-xs text-muted">Find and book local service providers</div>
                </label>
              </div>
              <div className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-colors ${role === 'provider' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <RadioGroupItem value="provider" id="role-provider" />
                <label htmlFor="role-provider" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Offer services</div>
                  <div className="text-xs text-muted">List your services and accept bookings</div>
                </label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your full name" className="mt-1" aria-invalid={!!errors.name} {...register('name')} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" className="mt-1" aria-invalid={!!errors.email} {...register('email')} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="(870) 555-0123" className="mt-1" aria-invalid={!!errors.phone} {...register('phone')} />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" className="mt-1" aria-invalid={!!errors.password} {...register('password')} />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Continue'}
          </Button>
        </form>

        <p className="text-sm text-center text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>

        <p className="text-xs text-center text-muted mt-4 pt-4 border-t border-border">
          By signing up you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
