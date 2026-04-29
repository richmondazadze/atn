import { useEffect, useState } from 'react';
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
import { supabase } from '../../../lib/supabase';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Settings,
  User,
  Lock,
  Bell,
  CalendarCheck,
  Clock,
  Megaphone,
  AlertTriangle,
} from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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

type NotificationPrefs = {
  bookingConfirmations: boolean;
  bookingReminders: boolean;
  promotionalEmails: boolean;
};

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  bookingConfirmations: true,
  bookingReminders: true,
  promotionalEmails: false,
};

export default function CustomerSettings() {
  const { user, refreshProfile } = useAuth();
  const [notifications, setNotifications] = useState<NotificationPrefs>(DEFAULT_NOTIFICATIONS);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? '' },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    profileForm.reset({ name: user.name, phone: user.phone ?? '' });
  }, [user.name, user.phone, profileForm.reset]);

  useEffect(() => {
    if (!user.id) return;
    supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const prefs = data?.notification_preferences as NotificationPrefs | null;
        if (prefs && typeof prefs === 'object') {
          setNotifications({ ...DEFAULT_NOTIFICATIONS, ...prefs });
        }
        setNotificationsLoading(false);
      });
  }, [user.id]);

  async function onProfileSave(data: ProfileData) {
    const { error } = await supabase
      .from('profiles')
      .update({ name: data.name, phone: data.phone })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to save profile. Please try again.');
      return;
    }

    toast.success('Profile updated');
    await refreshProfile();
  }

  async function onNotificationsChange(key: keyof NotificationPrefs, value: boolean) {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    const { error } = await supabase
      .from('profiles')
      .update({ notification_preferences: next })
      .eq('id', user.id);
    if (error) toast.error('Failed to save notification preference');
    else toast.success('Notification preference saved');
  }

  async function onPasswordUpdate(data: PasswordData) {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      toast.error(error.message || 'Failed to update password');
      return;
    }

    toast.success('Password updated');
    passwordForm.reset();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-3xl mx-auto animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-teal flex items-center justify-center shrink-0">
              <Settings size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-[28px] font-semibold leading-tight">Settings</h1>
              <p className="text-sm text-muted mt-0.5">Manage your profile, security, and notification preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px]">
        <div className="py-6 lg:py-8 max-w-3xl mx-auto">
          <div className="space-y-5 lg:space-y-6">

            {/* Profile Card */}
            <Card className="rounded-2xl border border-border card-lift overflow-hidden animate-fade-up delay-100">
              <div className="flex items-center gap-3 px-5 lg:px-6 py-4 border-b border-border bg-surface-teal/40">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Profile Information</h2>
                  <p className="text-[11px] text-muted">Your public name and contact details</p>
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <form onSubmit={profileForm.handleSubmit(onProfileSave)} noValidate className="space-y-4">
                  <div>
                    <Label htmlFor="cs-name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="cs-name"
                      className="mt-1.5 rounded-xl focus-glow"
                      aria-invalid={!!profileForm.formState.errors.name}
                      {...profileForm.register('name')}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                        <span>{profileForm.formState.errors.name.message}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cs-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="cs-email"
                      type="email"
                      value={user.email}
                      className="mt-1.5 rounded-xl bg-secondary/50 cursor-not-allowed opacity-70"
                      disabled
                    />
                    <p className="text-[11px] text-muted mt-1.5">Contact support to change your email address.</p>
                  </div>
                  <div>
                    <Label htmlFor="cs-phone" className="text-sm font-medium">Phone</Label>
                    <Input
                      id="cs-phone"
                      type="tel"
                      className="mt-1.5 rounded-xl focus-glow"
                      aria-invalid={!!profileForm.formState.errors.phone}
                      {...profileForm.register('phone')}
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-xs text-destructive mt-1.5">{profileForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div className="pt-1">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 font-semibold shadow-teal-sm transition-all"
                    >
                      Save changes
                    </Button>
                  </div>
                </form>
              </div>
            </Card>

            {/* Notifications Card */}
            <Card className="rounded-2xl border border-border card-lift overflow-hidden animate-fade-up delay-200">
              <div className="flex items-center gap-3 px-5 lg:px-6 py-4 border-b border-border bg-surface-amber/40">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
                  <p className="text-[11px] text-muted">Choose what updates you receive</p>
                </div>
              </div>
              <div className="p-5 lg:p-6">
                {notificationsLoading ? (
                  <div className="h-24 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Booking confirmations */}
                    <div className="flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-surface-teal flex items-center justify-center shrink-0 mt-0.5">
                          <CalendarCheck size={14} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Booking confirmations</div>
                          <div className="text-xs text-muted">Receive email when bookings are confirmed</div>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.bookingConfirmations}
                        onCheckedChange={v => onNotificationsChange('bookingConfirmations', v)}
                        aria-label="Booking confirmations"
                      />
                    </div>

                    <Separator className="my-1" />

                    {/* Booking reminders */}
                    <div className="flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-surface-violet flex items-center justify-center shrink-0 mt-0.5">
                          <Clock size={14} className="text-violet-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Booking reminders</div>
                          <div className="text-xs text-muted">Get reminders 24 hours before your booking</div>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.bookingReminders}
                        onCheckedChange={v => onNotificationsChange('bookingReminders', v)}
                        aria-label="Booking reminders"
                      />
                    </div>

                    <Separator className="my-1" />

                    {/* Promotional emails */}
                    <div className="flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-surface-amber flex items-center justify-center shrink-0 mt-0.5">
                          <Megaphone size={14} className="text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Promotional emails</div>
                          <div className="text-xs text-muted">Special offers and new provider announcements</div>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.promotionalEmails}
                        onCheckedChange={v => onNotificationsChange('promotionalEmails', v)}
                        aria-label="Promotional emails"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Password Card */}
            <Card className="rounded-2xl border border-border card-lift overflow-hidden animate-fade-up delay-300">
              <div className="flex items-center gap-3 px-5 lg:px-6 py-4 border-b border-border bg-surface-violet/40">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Lock size={16} className="text-violet-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Password</h2>
                  <p className="text-[11px] text-muted">Keep your account secure</p>
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <form onSubmit={passwordForm.handleSubmit(onPasswordUpdate)} noValidate className="space-y-4">
                  {[
                    { id: 'cs-cp', name: 'currentPassword' as const, label: 'Current Password' },
                    { id: 'cs-np', name: 'newPassword' as const, label: 'New Password' },
                    { id: 'cs-conf', name: 'confirmPassword' as const, label: 'Confirm New Password' },
                  ].map(field => (
                    <div key={field.id}>
                      <Label htmlFor={field.id} className="text-sm font-medium">{field.label}</Label>
                      <Input
                        id={field.id}
                        type="password"
                        className="mt-1.5 rounded-xl focus-glow"
                        aria-invalid={!!passwordForm.formState.errors[field.name]}
                        {...passwordForm.register(field.name)}
                      />
                      {passwordForm.formState.errors[field.name] && (
                        <p className="text-xs text-destructive mt-1.5">
                          {passwordForm.formState.errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="pt-1">
                    <Button
                      type="submit"
                      variant="outline"
                      className="border-border rounded-xl px-5 font-semibold hover:border-violet-500 hover:bg-surface-violet hover:text-violet-700 transition-all"
                    >
                      Update password
                    </Button>
                  </div>
                </form>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="rounded-2xl border border-destructive/40 card-lift overflow-hidden animate-fade-up delay-400">
              <div className="flex items-center gap-3 px-5 lg:px-6 py-4 border-b border-destructive/20 bg-red-50/50 dark:bg-destructive/5">
                <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-destructive" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
                  <p className="text-[11px] text-muted">Irreversible account actions</p>
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <p className="text-sm text-muted mb-4">
                  Once you delete your account, there is no going back. All your data will be permanently removed. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  className="rounded-xl px-5 font-semibold"
                  onClick={() => toast.error('Account deletion is disabled in demo mode')}
                >
                  Delete account
                </Button>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
