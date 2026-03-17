import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import { Bell, DollarSign, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const contactSchema = z.object({
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  preferredContact: z.string(),
});
type ContactData = z.infer<typeof contactSchema>;

export default function ProviderSettings() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailReviews: true,
    emailPayments: true,
    smsBookings: true,
    smsReminders: false,
    pushEnabled: true,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: user.email,
      phone: user.phone ?? '',
      preferredContact: 'email',
    },
  });

  const preferredContact = watch('preferredContact');

  async function onContactSave(data: ContactData) {
    const { error } = await supabase.from('profiles').update({
      email: data.email,
      phone: data.phone,
    }).eq('id', user.id);
    if (error) { toast.error('Failed to save settings'); return; }
    toast.success('Settings saved');
  }

  function toggle(key: keyof typeof notifications) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Settings</h1>
          <p className="text-sm text-muted">Manage your account preferences and notifications</p>
        </div>

        {/* Notifications */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Notifications</h2>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-3">Email</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailBookings' as const, label: 'New bookings', desc: 'Get notified when someone books your service' },
                  { key: 'emailReviews' as const, label: 'New reviews', desc: 'Get notified when you receive a review' },
                  { key: 'emailPayments' as const, label: 'Payment updates', desc: 'Get notified about payouts and earnings' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    <Switch checked={notifications[item.key]} onCheckedChange={() => toggle(item.key)} aria-label={item.label} />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">SMS</h3>
              <div className="space-y-3">
                {[
                  { key: 'smsBookings' as const, label: 'Booking confirmations', desc: 'Text alerts for new and confirmed bookings' },
                  { key: 'smsReminders' as const, label: 'Appointment reminders', desc: 'Reminders 24 hours before appointments' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    <Switch checked={notifications[item.key]} onCheckedChange={() => toggle(item.key)} aria-label={item.label} />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push notifications</p>
                <p className="text-xs text-muted">Browser notifications for important updates</p>
              </div>
              <Switch checked={notifications.pushEnabled} onCheckedChange={() => toggle('pushEnabled')} aria-label="Push notifications" />
            </div>
          </div>
        </Card>

        {/* Payment info */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Payment Information</h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-secondary rounded">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium">First Community Bank</p>
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">Verified</Badge>
                </div>
                <p className="text-xs text-muted">Account ending in 4892</p>
              </div>
              <Button variant="outline" size="sm" className="border-border">Update</Button>
            </div>
            <div>
              <Label>Payout Schedule</Label>
              <Select defaultValue="weekly">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly (Mondays)</SelectItem>
                  <SelectItem value="monthly">Monthly (1st of month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Contact Information</h2>
          </div>
          <form onSubmit={handleSubmit(onContactSave)} noValidate className="space-y-4">
            <div>
              <Label htmlFor="ps-email">Email</Label>
              <Input id="ps-email" type="email" className="mt-1" aria-invalid={!!errors.email} {...register('email')} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="ps-phone">Phone Number</Label>
              <Input id="ps-phone" type="tel" className="mt-1" aria-invalid={!!errors.phone} {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label>Preferred Contact Method</Label>
              <Select value={preferredContact} onValueChange={v => setValue('preferredContact', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="sms">Text Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground">Save contact info</Button>
          </form>
        </Card>

        {/* Security */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm" className="border-border" onClick={() => toast.info('Password change coming soon')}>Change</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" className="border-border" onClick={() => toast.info('2FA setup coming soon')}>Enable</Button>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-5 border-t border-border">
          <Button variant="ghost" className="text-destructive" onClick={() => toast.error('Account deactivation is disabled in demo mode')}>
            Deactivate account
          </Button>
        </div>
      </div>
    </div>
  );
}
