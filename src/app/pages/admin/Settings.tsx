import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Settings as SettingsIcon, DollarSign, Shield, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformFee: '8',
    minBooking: '25',
    maxBooking: '500',
    requireBackgroundCheck: true,
    autoApproveProviders: false,
    emailNotifications: true,
    smsNotifications: true,
    maintenanceMode: false,
  });

  function update<K extends keyof typeof settings>(key: K, value: typeof settings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Platform Settings</h1>
          <p className="text-sm text-muted">Manage global platform configuration</p>
        </div>

        {/* Payment Settings */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Payment Settings</h2>
          </div>
          <div className="space-y-5">
            <div>
              <Label htmlFor="as-fee">Platform Fee (%)</Label>
              <Input
                id="as-fee"
                type="number"
                value={settings.platformFee}
                onChange={e => update('platformFee', e.target.value)}
                className="mt-1 w-28"
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="as-max">Maximum Booking ($)</Label>
                <Input
                  id="as-max"
                  type="number"
                  value={settings.maxBooking}
                  onChange={e => update('maxBooking', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded text-sm">
              <strong>Current Platform Fee:</strong> {settings.platformFee}% per transaction<br />
              <strong>Example:</strong> On a $100 booking, platform fee = ${(100 * parseFloat(settings.platformFee || '0') / 100).toFixed(2)}
            </div>
          </div>
        </Card>

        {/* Provider Requirements */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Provider Requirements</h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
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
            <Separator />
            <div className="flex items-center justify-between">
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
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Admin Notifications</h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
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
            <Separator />
            <div className="flex items-center justify-between">
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
                placeholder={`admin@atn.com\nsupport@atn.com`}
                className="mt-1 min-h-[80px]"
              />
              <p className="text-xs text-muted mt-1">One email address per line</p>
            </div>
          </div>
        </Card>

        {/* Platform Status */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <SettingsIcon size={18} className="text-muted" />
            <h2 className="text-lg font-medium">Platform Status</h2>
          </div>
          <div className="space-y-5">
            <div className={`flex items-center justify-between p-4 border-2 rounded ${settings.maintenanceMode ? 'border-destructive/40' : 'border-border'}`}>
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
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded">
                <p className="text-sm text-destructive font-medium">
                  Maintenance mode is currently ENABLED. Users cannot access the platform.
                </p>
              </div>
            )}

            <Separator />

            <div>
              <Label htmlFor="as-maintenance-msg">Maintenance Message</Label>
              <Textarea
                id="as-maintenance-msg"
                placeholder="We're currently performing scheduled maintenance. We'll be back soon!"
                className="mt-1 min-h-[80px]"
              />
              <p className="text-xs text-muted mt-1">Message shown to users during maintenance</p>
            </div>
          </div>
        </Card>

        {/* Save */}
        <div className="flex items-center justify-end pt-4 border-t border-border">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => toast.success('Settings saved')}
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
