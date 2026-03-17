import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});
type ProfileData = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type PasswordData = z.infer<typeof passwordSchema>;

export default function CustomerSettings() {
  const { user } = useAuth();

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email, phone: user.phone ?? '' },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  function onProfileSave(_data: ProfileData) {
    toast.success('Profile updated');
  }

  function onPasswordUpdate(_data: PasswordData) {
    toast.success('Password updated');
    passwordForm.reset();
  }

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl lg:text-[32px] font-semibold mb-6 lg:mb-8">Settings</h1>

        <div className="space-y-6 lg:space-y-8">
          {/* Profile */}
          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">Profile Information</h2>
            <form onSubmit={profileForm.handleSubmit(onProfileSave)} noValidate className="space-y-4">
              <div>
                <Label htmlFor="cs-name">Full Name</Label>
                <Input id="cs-name" className="mt-1" aria-invalid={!!profileForm.formState.errors.name} {...profileForm.register('name')} />
                {profileForm.formState.errors.name && <p className="text-xs text-destructive mt-1">{profileForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="cs-email">Email</Label>
                <Input id="cs-email" type="email" className="mt-1" aria-invalid={!!profileForm.formState.errors.email} {...profileForm.register('email')} />
                {profileForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{profileForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="cs-phone">Phone</Label>
                <Input id="cs-phone" type="tel" className="mt-1" aria-invalid={!!profileForm.formState.errors.phone} {...profileForm.register('phone')} />
                {profileForm.formState.errors.phone && <p className="text-xs text-destructive mt-1">{profileForm.formState.errors.phone.message}</p>}
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save changes</Button>
            </form>
          </Card>

          {/* Notifications */}
          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">Notifications</h2>
            <div className="space-y-4">
              {[
                { id: 'n1', label: 'Booking confirmations', desc: 'Receive email when bookings are confirmed', defaultChecked: true },
                { id: 'n2', label: 'Booking reminders', desc: 'Get reminders 24 hours before your booking', defaultChecked: true },
                { id: 'n3', label: 'Promotional emails', desc: 'Special offers and new provider announcements', defaultChecked: false },
              ].map((item, i) => (
                <div key={item.id}>
                  {i > 0 && <Separator className="mb-4" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted">{item.desc}</div>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} aria-label={item.label} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Password */}
          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">Password</h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordUpdate)} noValidate className="space-y-4">
              {[
                { id: 'cs-cp', name: 'currentPassword' as const, label: 'Current Password' },
                { id: 'cs-np', name: 'newPassword' as const, label: 'New Password' },
                { id: 'cs-conf', name: 'confirmPassword' as const, label: 'Confirm New Password' },
              ].map(field => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input id={field.id} type="password" className="mt-1" aria-invalid={!!passwordForm.formState.errors[field.name]} {...passwordForm.register(field.name)} />
                  {passwordForm.formState.errors[field.name] && (
                    <p className="text-xs text-destructive mt-1">{passwordForm.formState.errors[field.name]?.message}</p>
                  )}
                </div>
              ))}
              <Button type="submit" variant="outline" className="border-border">Update password</Button>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-2 text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="destructive" onClick={() => toast.error('Account deletion is disabled in demo mode')}>
              Delete account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
