import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Bell, DollarSign, User, Lock, Shield, CreditCard, CheckCircle2, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

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
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/50 px-4 md:px-6 lg:px-[72px] py-8 lg:py-12 animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 label-pill bg-surface-teal text-primary mb-4">
            <Settings size={11} />
            Account
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account preferences, notifications, and payment info.</p>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Notifications */}
          <div className="border border-border rounded-2xl bg-background overflow-hidden animate-fade-up">
            <div className="flex items-center gap-3 p-5 lg:p-6 border-b border-border bg-surface-amber/20">
              <div className="w-9 h-9 rounded-xl bg-surface-amber flex items-center justify-center shrink-0">
                <Bell size={16} className="text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Notifications</h2>
                <p className="text-xs text-muted">Choose how you want to be alerted</p>
              </div>
            </div>
            <div className="p-5 lg:p-6 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Email</h3>
                <div className="space-y-3">
                  {[
                    { key: 'emailBookings' as const, label: 'New bookings', desc: 'Get notified when someone books your service' },
                    { key: 'emailReviews' as const, label: 'New reviews', desc: 'Get notified when you receive a review' },
                    { key: 'emailPayments' as const, label: 'Payment updates', desc: 'Get notified about payouts and earnings' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key]} onCheckedChange={() => toggle(item.key)} aria-label={item.label} />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">SMS</h3>
                <div className="space-y-3">
                  {[
                    { key: 'smsBookings' as const, label: 'Booking confirmations', desc: 'Text alerts for new and confirmed bookings' },
                    { key: 'smsReminders' as const, label: 'Appointment reminders', desc: 'Reminders 24 hours before appointments' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key]} onCheckedChange={() => toggle(item.key)} aria-label={item.label} />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-semibold text-foreground">Push notifications</p>
                  <p className="text-xs text-muted">Browser notifications for important updates</p>
                </div>
                <Switch checked={notifications.pushEnabled} onCheckedChange={() => toggle('pushEnabled')} aria-label="Push notifications" />
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="border border-border rounded-2xl bg-background overflow-hidden animate-fade-up delay-100">
            <div className="flex items-center gap-3 p-5 lg:p-6 border-b border-border bg-surface-green/30">
              <div className="w-9 h-9 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                <DollarSign size={16} className="text-status-green" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Payment Information</h2>
                <p className="text-xs text-muted">Bank details and payout schedule</p>
              </div>
            </div>
            <div className="p-5 lg:p-6 space-y-5">
              {loadingPayment ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : paymentInfo.bankName ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-green/20 border border-status-green/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center">
                      <CreditCard size={16} className="text-status-green" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-foreground">{paymentInfo.bankName}</p>
                        {paymentInfo.verified && (
                          <Badge className="bg-surface-green text-status-green border-0 text-[10px] gap-1">
                            <CheckCircle2 size={10} /> Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted">Account ending in {paymentInfo.lastFour}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
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
                <div className="p-6 border-2 border-dashed border-border rounded-xl text-center bg-background/50">
                  <div className="w-12 h-12 rounded-2xl bg-surface-teal flex items-center justify-center mx-auto mb-3">
                    <CreditCard size={20} className="text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">No payment method added</p>
                  <p className="text-xs text-muted mb-4">Add your bank details to receive payouts</p>
                  <Button
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
                <Label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">Payout Schedule</Label>
                <Select
                  value={paymentInfo.payoutSchedule || 'weekly'}
                  onValueChange={async (v) => {
                    const updated = { ...paymentInfo, payoutSchedule: v };
                    await savePaymentInfo(updated);
                  }}
                >
                  <SelectTrigger className="mt-1 focus-glow">
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
          </div>

          {/* Contact */}
          <div className="border border-border rounded-2xl bg-background overflow-hidden animate-fade-up delay-200">
            <div className="flex items-center gap-3 p-5 lg:p-6 border-b border-border bg-surface-teal/20">
              <div className="w-9 h-9 rounded-xl bg-surface-teal flex items-center justify-center shrink-0">
                <User size={16} className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Contact Information</h2>
                <p className="text-xs text-muted">How customers can reach you</p>
              </div>
            </div>
            <div className="p-5 lg:p-6">
              <form onSubmit={handleSubmit(onContactSave)} noValidate className="space-y-4">
                <div>
                  <Label htmlFor="ps-email" className="text-xs font-bold uppercase tracking-widest text-muted">Email</Label>
                  <Input id="ps-email" type="email" className="mt-1.5 bg-secondary/40" value={user.email} disabled />
                  <p className="text-xs text-muted mt-1">Contact support to change your email address.</p>
                </div>
                <div>
                  <Label htmlFor="ps-phone" className="text-xs font-bold uppercase tracking-widest text-muted">Phone Number</Label>
                  <Input id="ps-phone" type="tel" className="mt-1.5 focus-glow" aria-invalid={!!errors.phone} {...register('phone')} />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted">Preferred Contact Method</Label>
                  <Select value={preferredContact} onValueChange={v => setValue('preferredContact', v)}>
                    <SelectTrigger className="mt-1.5 focus-glow"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">Text Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="font-bold">Save contact info</Button>
              </form>
            </div>
          </div>

          {/* Security */}
          <div className="border border-border rounded-2xl bg-background overflow-hidden animate-fade-up delay-300">
            <div className="flex items-center gap-3 p-5 lg:p-6 border-b border-border bg-surface-violet/20">
              <div className="w-9 h-9 rounded-xl bg-surface-violet flex items-center justify-center shrink-0">
                <Shield size={16} className="text-violet" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Security</h2>
                <p className="text-xs text-muted">Manage your password and account safety</p>
              </div>
            </div>
            <div className="p-5 lg:p-6 space-y-4">
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-semibold text-foreground">Password</p>
                  <p className="text-xs text-muted">Keep your account secure with a strong password</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)}>
                  <Lock size={13} className="mr-1.5" /> Change
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-semibold text-foreground">Two-factor authentication</p>
                  <p className="text-xs text-muted">Coming in a future update</p>
                </div>
                <Button variant="outline" size="sm" disabled>Enable</Button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="pt-4 border-t border-border animate-fade-up delay-400">
            <Button
              variant="ghost"
              className="text-destructive hover:bg-surface-coral hover:text-coral"
              onClick={() => toast.error('Account deactivation is disabled in demo mode')}
            >
              Deactivate account
            </Button>
          </div>
        </div>
      </div>

      {/* Payment method dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Payment Method</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="pm-bank" className="text-xs font-bold uppercase tracking-widest text-muted">Bank Name</Label>
              <Input id="pm-bank" className="mt-1.5 focus-glow" placeholder="e.g. First Community Bank" value={bankNameInput} onChange={e => setBankNameInput(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pm-last4" className="text-xs font-bold uppercase tracking-widest text-muted">Last 4 Digits of Account</Label>
              <Input id="pm-last4" className="mt-1.5 focus-glow" placeholder="1234" maxLength={4} value={lastFourInput} onChange={e => setLastFourInput(e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePaymentSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change password dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="pw-new" className="text-xs font-bold uppercase tracking-widest text-muted">New Password</Label>
              <Input id="pw-new" type="password" className="mt-1.5 focus-glow" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pw-confirm" className="text-xs font-bold uppercase tracking-widest text-muted">Confirm New Password</Label>
              <Input id="pw-confirm" type="password" className="mt-1.5 focus-glow" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? 'Updating…' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
