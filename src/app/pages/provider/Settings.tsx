import { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Bell, DollarSign, Shield, User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const contactSchema = z.object({
  phone: z.string().min(10, 'Enter a valid phone number'),
  preferredContact: z.string(),
});
type ContactData = z.infer<typeof contactSchema>;

type PaymentInfo = {
  bankName: string;
  lastFour: string;
  verified: boolean;
  payoutSchedule: string;
};

const DEFAULT_PAYMENT: PaymentInfo = {
  bankName: '',
  lastFour: '',
  verified: false,
  payoutSchedule: 'weekly',
};

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

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(DEFAULT_PAYMENT);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [bankNameInput, setBankNameInput] = useState('');
  const [lastFourInput, setLastFourInput] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: user.phone ?? '',
      preferredContact: 'email',
    },
  });

  const preferredContact = watch('preferredContact');

  useEffect(() => {
    supabase
      .from('providers')
      .select('payment_info')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.payment_info) {
          setPaymentInfo(data.payment_info as PaymentInfo);
        }
        setLoadingPayment(false);
      });
  }, [user.id]);

  async function onContactSave(data: ContactData) {
    const { error } = await supabase.from('profiles').update({
      phone: data.phone,
    }).eq('id', user.id);
    if (error) { toast.error('Failed to save settings'); return; }
    toast.success('Contact info saved');
  }

  async function savePaymentInfo(info: PaymentInfo) {
    const { error } = await supabase.from('providers').update({
      payment_info: info as unknown as Record<string, unknown>,
    }).eq('id', user.id);
    if (error) { toast.error('Failed to save payment info'); return; }
    setPaymentInfo(info);
    toast.success('Payment information updated');
  }

  async function handlePaymentSave() {
    if (!bankNameInput.trim() || lastFourInput.length !== 4) {
      toast.error('Enter a bank name and last 4 digits');
      return;
    }
    const info: PaymentInfo = {
      bankName: bankNameInput.trim(),
      lastFour: lastFourInput,
      verified: true,
      payoutSchedule: paymentInfo.payoutSchedule,
    };
    await savePaymentInfo(info);
    setPaymentDialogOpen(false);
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Password updated successfully');
    setPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
            {loadingPayment ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : paymentInfo.bankName ? (
              <div className="flex items-center justify-between p-4 bg-secondary rounded">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium">{paymentInfo.bankName}</p>
                    {paymentInfo.verified && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted">Account ending in {paymentInfo.lastFour}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={() => {
                    setBankNameInput(paymentInfo.bankName);
                    setLastFourInput(paymentInfo.lastFour);
                    setPaymentDialogOpen(true);
                  }}
                >
                  Update
                </Button>
              </div>
            ) : (
              <div className="p-5 border border-dashed border-border rounded text-center">
                <p className="text-sm text-muted mb-3">No payment method added yet</p>
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={() => {
                    setBankNameInput('');
                    setLastFourInput('');
                    setPaymentDialogOpen(true);
                  }}
                >
                  Add Payment Method
                </Button>
              </div>
            )}
            <div>
              <Label>Payout Schedule</Label>
              <Select
                value={paymentInfo.payoutSchedule || 'weekly'}
                onValueChange={async (v) => {
                  const updated = { ...paymentInfo, payoutSchedule: v };
                  await savePaymentInfo(updated);
                }}
              >
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
              <Input id="ps-email" type="email" className="mt-1 bg-secondary" value={user.email} disabled />
              <p className="text-xs text-muted mt-1">Contact support to change your email address.</p>
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
                <p className="text-xs text-muted">Keep your account secure with a strong password</p>
              </div>
              <Button variant="outline" size="sm" className="border-border" onClick={() => setPasswordDialogOpen(true)}>
                <Lock size={13} className="mr-1.5" /> Change
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted">Coming in a future update</p>
              </div>
              <Button variant="outline" size="sm" className="border-border" disabled>Enable</Button>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-5 border-t border-border">
          <Button variant="ghost" className="text-destructive" onClick={() => toast.error('Account deactivation is disabled in demo mode')}>
            Deactivate account
          </Button>
        </div>
      </div>

      {/* Payment method dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Payment Method</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="pm-bank">Bank Name</Label>
              <Input id="pm-bank" className="mt-1" placeholder="e.g. First Community Bank" value={bankNameInput} onChange={e => setBankNameInput(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pm-last4">Last 4 Digits of Account</Label>
              <Input id="pm-last4" className="mt-1" placeholder="1234" maxLength={4} value={lastFourInput} onChange={e => setLastFourInput(e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={handlePaymentSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change password dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="pw-new">New Password</Label>
              <Input id="pw-new" type="password" className="mt-1" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pw-confirm">Confirm New Password</Label>
              <Input id="pw-confirm" type="password" className="mt-1" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? 'Updating…' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
