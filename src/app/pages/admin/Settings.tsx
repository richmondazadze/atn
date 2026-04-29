import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Settings as SettingsIcon, DollarSign, Bell, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { usePlatformSettings } from '../../../hooks/usePlatformSettings';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function AdminSettings() {
  const { settings, loading, saveSettings } = usePlatformSettings();

  function update<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    saveSettings({ [key]: value }).catch(() => toast.error('Failed to save'));
  }

  async function handleSaveAll() {
    try {
      await saveSettings(settings);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  }

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-4xl mx-auto animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-surface-teal flex items-center justify-center shrink-0">
              <SettingsIcon size={22} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="label-pill bg-surface-teal text-primary">Configuration</span>
              </div>
              <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Platform Settings</h1>
              <p className="text-sm text-muted mt-0.5">Manage global platform configuration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Payment Settings */}
          <Card className="border-border overflow-hidden card-lift animate-fade-up">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-5 lg:px-8 py-4 bg-surface-green border-b border-border">
              <div className="w-8 h-8 bg-status-green/10 flex items-center justify-center">
                <DollarSign size={16} className="text-status-green" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-status-green">Payment Settings</h2>
                <p className="text-xs text-status-green/70">Platform fees and booking limits</p>
              </div>
            </div>
            <div className="p-5 lg:p-8 space-y-5">
              <div>
                <Label htmlFor="as-fee">Platform Fee (%)</Label>
                <Input
                  id="as-fee"
                  type="number"
                  value={settings.platformFee}
                  onChange={e => update('platformFee', e.target.value)}
                  className="mt-1 w-28 border-border focus:border-primary"
                />
                <p className="text-xs text-muted mt-1">Percentage charged to providers per booking</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="as-min">Minimum Booking ($)</Label>
                  <Input
                    id="as-min"
                    type="number"
                    value={settings.minBooking}
                    onChange={e => update('minBooking', e.target.value)}
                    className="mt-1 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="as-max">Maximum Booking ($)</Label>
                  <Input
                    id="as-max"
                    type="number"
                    value={settings.maxBooking}
                    onChange={e => update('maxBooking', e.target.value)}
                    className="mt-1 border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-4 bg-surface-teal border border-primary/20">
                <p className="text-sm">
                  <strong className="text-primary">Current Platform Fee:</strong>{' '}
                  <span className="text-muted">{settings.platformFee}% per transaction</span>
                </p>
                <p className="text-sm mt-0.5">
                  <strong className="text-primary">Example:</strong>{' '}
                  <span className="text-muted">
                    On a $100 booking, platform fee = ${(100 * parseFloat(settings.platformFee || '0') / 100).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Provider Requirements */}
          <Card className="border-border overflow-hidden card-lift animate-fade-up delay-100">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-5 lg:px-8 py-4 bg-surface-violet border-b border-border">
              <div className="w-8 h-8 bg-violet/10 flex items-center justify-center">
                <ShieldCheck size={16} className="text-violet" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-violet">Provider Requirements</h2>
                <p className="text-xs text-violet/70">Verification and onboarding rules</p>
              </div>
            </div>
            <div className="p-5 lg:p-8 space-y-5">
              <div className="flex items-center justify-between p-3 bg-secondary border border-border">
                <div>
                  <p className="font-medium text-sm">Require Background Check</p>
                  <p className="text-xs text-muted">All providers must complete background verification</p>
                </div>
                <Switch
                  checked={settings.requireBackgroundCheck}
                  onCheckedChange={v => update('requireBackgroundCheck', v)}
                  aria-label="Require background check"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary border border-border">
                <div>
                  <p className="font-medium text-sm">Auto-Approve Provider Applications</p>
                  <p className="text-xs text-muted">Automatically approve new provider registrations</p>
                </div>
                <Switch
                  checked={settings.autoApproveProviders}
                  onCheckedChange={v => update('autoApproveProviders', v)}
                  aria-label="Auto-approve providers"
                />
              </div>
            </div>
          </Card>

          {/* Admin Notifications */}
          <Card className="border-border overflow-hidden card-lift animate-fade-up delay-200">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-5 lg:px-8 py-4 bg-surface-amber border-b border-border">
              <div className="w-8 h-8 bg-amber/10 flex items-center justify-center">
                <Bell size={16} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-amber-600">Admin Notifications</h2>
                <p className="text-xs text-amber-600/70">Alerts and contact configuration</p>
              </div>
            </div>
            <div className="p-5 lg:p-8 space-y-5">
              <div className="flex items-center justify-between p-3 bg-secondary border border-border">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted">Receive email alerts for important events</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={v => update('emailNotifications', v)}
                  aria-label="Email notifications"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary border border-border">
                <div>
                  <p className="font-medium text-sm">SMS Notifications</p>
                  <p className="text-xs text-muted">Receive SMS alerts for urgent issues</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={v => update('smsNotifications', v)}
                  aria-label="SMS notifications"
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="as-emails">Admin Email Addresses</Label>
                <Textarea
                  id="as-emails"
                  value={settings.adminEmails ?? ''}
                  onChange={e => update('adminEmails', e.target.value)}
                  placeholder={`admin@atn.com\nsupport@atn.com`}
                  className="mt-1 min-h-[80px] border-border focus:border-primary"
                />
                <p className="text-xs text-muted mt-1">One email address per line</p>
              </div>
            </div>
          </Card>

          {/* Platform Status */}
          <Card className="border-border overflow-hidden card-lift animate-fade-up delay-300">
            {/* Section Header */}
            <div className={`flex items-center gap-3 px-5 lg:px-8 py-4 border-b border-border ${settings.maintenanceMode ? 'bg-surface-coral' : 'bg-secondary'}`}>
              <div className={`w-8 h-8 flex items-center justify-center ${settings.maintenanceMode ? 'bg-coral/10' : 'bg-muted/10'}`}>
                <AlertTriangle size={16} className={settings.maintenanceMode ? 'text-coral' : 'text-muted'} />
              </div>
              <div>
                <h2 className={`text-base font-semibold ${settings.maintenanceMode ? 'text-coral' : 'text-foreground'}`}>
                  Platform Status
                </h2>
                <p className={`text-xs ${settings.maintenanceMode ? 'text-coral/70' : 'text-muted'}`}>
                  {settings.maintenanceMode ? 'Maintenance mode is ACTIVE' : 'Platform is running normally'}
                </p>
              </div>
              {settings.maintenanceMode && (
                <span className="label-pill bg-coral text-white ml-auto animate-scale-in">
                  <AlertTriangle size={10} /> LIVE
                </span>
              )}
            </div>
            <div className="p-5 lg:p-8 space-y-5">
              <div className={`flex items-center justify-between p-4 border-2 ${settings.maintenanceMode ? 'border-coral/40 bg-surface-coral' : 'border-border bg-secondary'}`}>
                <div>
                  <p className="font-medium text-sm">Maintenance Mode</p>
                  <p className="text-xs text-muted">Temporarily disable public access to platform</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={v => update('maintenanceMode', v)}
                  aria-label="Maintenance mode"
                />
              </div>

              {settings.maintenanceMode && (
                <div className="p-4 bg-surface-coral border border-coral/30 animate-fade-up">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-coral shrink-0 mt-0.5" />
                    <p className="text-sm text-coral font-medium">
                      Maintenance mode is currently ENABLED. Users cannot access the platform.
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <Label htmlFor="as-maintenance-msg">Maintenance Message</Label>
                <Textarea
                  id="as-maintenance-msg"
                  value={settings.maintenanceMessage ?? ''}
                  onChange={e => update('maintenanceMessage', e.target.value)}
                  placeholder="We're currently performing scheduled maintenance. We'll be back soon!"
                  className="mt-1 min-h-[80px] border-border focus:border-primary"
                />
                <p className="text-xs text-muted mt-1">Message shown to users during maintenance</p>
              </div>
            </div>
          </Card>

          {/* Save */}
          <div className="flex items-center justify-end pt-4 border-t border-border animate-fade-up delay-400">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              onClick={handleSaveAll}
            >
              Save All Settings
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
