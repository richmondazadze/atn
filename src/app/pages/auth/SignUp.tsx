import { useState } from 'react';
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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$|^\d{10}$/, 'Enter a valid phone number').or(z.string().min(10, 'Enter a valid phone number')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const { signUp: authSignUp } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  async function onSubmit(data: FormData) {
    const { error } = await authSignUp(data.email, data.password, {
      name: data.name,
      phone: data.phone,
      role,
    });

    if (error) {
      toast.error(error);
      return;
    }

    if (role === 'provider') {
      navigate('/provider/onboarding');
    } else {
      navigate('/customer');
    }
    toast.success('Account created! Welcome to ATN.');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 border-b border-border bg-background">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft size={18} className="text-muted hover:text-foreground" />
          <img src="/atn_logo_no_bg.png" alt="ATN" className="w-8 h-8 object-contain" />
          <span className="text-xl font-semibold leading-tight tracking-tight text-foreground">ATN</span>
        </Link>
        <div className="flex items-center gap-6">
          <p className="hidden md:block text-muted text-sm">Already have an account?</p>
          <Button asChild className="h-10 px-6">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-[960px] w-full flex flex-col items-center text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-3">
            Join the ATN Network
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl">
            Whether you're looking for expert help or want to share your professional skills, we've got you covered.
          </p>
        </div>

        {step === 'role' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[960px]">
              {/* Customer Card */}
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`group text-left relative flex flex-col bg-background p-7 rounded-xl shadow-sm border transition-all ${
                  role === 'customer' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary'
                }`}
              >
                <div className="w-full h-44 bg-background rounded-lg mb-6 overflow-hidden border border-border">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEQJ731OasG6X6fexIq3rlDJAQMC2Zl3U8CSW4VN2H9rkJNADCHcH8wcLyRg2rF300f-2njFwmf5wo-baIBaCL5Ll-g8RPcflOiBoBACHjonqdt0KS_sQ5UTtsDQgdOQdeyWebsCWvSBs0ci4mP5Ii5GiQECCq6A1rC9yjRnOZ9n-JmIGmbtLznpC7l66jr6rrOtpYMQyLmtvAm-EhK2FgaIS_cu2Xddn6lFIpEYRuKOJu1Bipg0qUn4VtEBCaz-4eFgQS5axFVEgO')",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <span className="uppercase text-xs font-semibold tracking-widest">Customer</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">I want to book services</h3>
                <p className="text-muted mb-7 flex-grow text-sm">
                  Access a curated network of top-tier professionals. Book appointments, manage projects, and get results instantly.
                </p>
                <div className="mt-auto">
                  <div className={`w-full h-12 rounded-lg flex items-center justify-center font-semibold transition-colors ${
                    role === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}>
                    Select Customer
                  </div>
                </div>
              </button>

              {/* Provider Card */}
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`group text-left relative flex flex-col bg-background p-7 rounded-xl shadow-sm border transition-all ${
                  role === 'provider' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary'
                }`}
              >
                <div className="w-full h-44 bg-background rounded-lg mb-6 overflow-hidden border border-border">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZFo3aD36Noj9wOFZix_PX3uyotgorq8WU7pKhzDGzonknbL7Z6cv0FANP-yHOOVyg7VG1iYD_AfYhjPEa32Rm-4Rd_rmurdM5UOm9q82mBk7LGqtdrvti_fjMRadsJmoJ1_u2MS9jx67d0tX-QeJGBppdM8sWvVUH3c8w4qIZ0Jmze7lxAtKeE7BQrYMtl55qejOmrJ8ne0001uyLgPYivZHJTKYhbDtls1fvfUk1B4qOn4IyNsnlbgXcxBhR8oUAgEKQJejdgpz7')",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <span className="uppercase text-xs font-semibold tracking-widest">Provider</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">I want to offer services</h3>
                <p className="text-muted mb-7 flex-grow text-sm">
                  Grow your business, reach new local clients, and manage your bookings effortlessly with our pro toolset.
                </p>
                <div className="mt-auto">
                  <div className={`w-full h-12 rounded-lg flex items-center justify-center font-semibold transition-colors ${
                    role === 'provider' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}>
                    Select Provider
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <Button className="h-12 px-10 min-w-[320px]" onClick={() => setStep('details')}>
                Continue with Registration
              </Button>
              <p className="text-muted text-sm">By continuing, you agree to our Terms of Service</p>
            </div>
          </>
        ) : (
          <div className="w-full max-w-[560px] bg-background border border-border rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Create your account</h2>
                <p className="text-sm text-muted mt-1">
                  Signing up as <span className="font-medium text-foreground">{role === 'customer' ? 'Customer' : 'Provider'}</span>
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => setStep('role')}>
                Change role
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your full name" className="mt-1 h-12" aria-invalid={!!errors.name} {...register('name')} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" className="mt-1 h-12" aria-invalid={!!errors.email} {...register('email')} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(870) 555-0123" className="mt-1 h-12" aria-invalid={!!errors.phone} {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="At least 8 characters" className="mt-1 h-12" aria-invalid={!!errors.password} {...register('password')} />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Continue'}
              </Button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-6 border-t border-border bg-background flex flex-col items-center gap-4">
        <div className="flex gap-8 text-sm font-medium text-muted">
          <Link className="hover:text-primary transition-colors" to="/terms">Terms of Use</Link>
          <Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
          <a className="hover:text-primary transition-colors" href="mailto:support@atn.local">Support</a>
        </div>
        <p className="text-muted text-xs">© 2026 ATN Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
