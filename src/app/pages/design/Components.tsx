import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Switch } from '../../components/ui/switch';
import { Star, AlertCircle, Info, CheckCircle2, Bell } from 'lucide-react';

export default function Components() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] p-16" style={{ width: '1440px', margin: '0 auto' }}>
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '72px', paddingRight: '72px' }}>
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[32px] leading-[40px] font-bold mb-2">01 • Components</h1>
          <p className="text-[#6B7280]">Reusable UI components for Access Terrain Network</p>
        </div>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary Button</Button>
            <Button variant="outline">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="accent">Gold Accent</Button>
            <Button variant="coral">Coral</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Form Inputs</h2>
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label>Default Input</Label>
              <Input placeholder="Enter text here" />
            </div>
            <div className="space-y-2">
              <Label>Error State</Label>
              <Input
                placeholder="Invalid email"
                className="border-[#DA291C] focus:ring-[#DA291C]"
              />
              <p className="text-[12px] leading-[16px] text-[#DA291C]">Please enter a valid email address</p>
            </div>
            <div className="space-y-2">
              <Label>Disabled Input</Label>
              <Input disabled placeholder="Disabled field" />
            </div>
            <div className="space-y-2">
              <Label>Textarea</Label>
              <Textarea placeholder="Enter description" className="min-h-24" />
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="teal">Active</Badge>
            <Badge variant="gold">Featured</Badge>
            <Badge variant="coral">Urgent</Badge>
            <Badge variant="violet">Premium</Badge>
            <Badge variant="success">Verified</Badge>
            <Badge variant="destructive">Flagged</Badge>
            <Badge variant="outline">Inactive</Badge>
            <Badge variant="secondary">Draft</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Cards</h2>
          <div className="grid grid-cols-3 gap-6">
            <Card className="border-border p-6">
              <h3 className="font-medium mb-2">Standard Card</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280]">
                Basic card with subtle teal-tinted border.
              </p>
            </Card>
            <Card className="border-primary p-6 ">
              <h3 className="font-medium mb-2">Highlighted Card</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280]">
                Card with primary teal border for emphasis.
              </p>
            </Card>
            <Card className="border-border p-6 card-interactive cursor-pointer">
              <h3 className="font-medium mb-2">Interactive Card</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280]">
                Hover to see lift effect and border change.
              </p>
            </Card>
          </div>
        </section>

        {/* Alerts */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Alerts & Banners</h2>
          <div className="space-y-4">
            <Alert className="border-primary/30 ">
              <Info size={16} className="text-primary" />
              <AlertDescription className="text-[#1A1A1A]">
                Test Mode — no real charges in V1. All payments are simulated.
              </AlertDescription>
            </Alert>
            <Alert className="border-[#7BC950]/40 bg-surface-green">
              <CheckCircle2 size={16} className="text-[#3A7A1A]" />
              <AlertDescription className="text-[#1A1A1A]">
                Your listing has been published successfully!
              </AlertDescription>
            </Alert>
            <Alert className="border-[#DA291C]/40 bg-[#DA291C]/10">
              <AlertCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">
                Payment failed. Please check your card details and try again.
              </AlertDescription>
            </Alert>
            <Alert className="border-border bg-background">
              <Bell size={16} className="text-[#6B7280]" />
              <AlertDescription className="text-[#6B7280]">
                You have 3 new booking requests pending review.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Star Rating */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Star Rating</h2>
          <div className="space-y-4">
            {[5, 4, 3].map(count => (
              <div key={count} className="flex items-center gap-2">
                {[...Array(count)].map((_, i) => (
                  <Star key={i} size={20} className="fill-[#D4A853] text-[#D4A853]" />
                ))}
                {[...Array(5 - count)].map((_, i) => (
                  <Star key={i} size={20} className="text-[#DDE8E8]" />
                ))}
                <span className="text-[14px] leading-[20px] ml-2 text-[#6B7280]">{count}.0</span>
              </div>
            ))}
          </div>
        </section>

        {/* Toggle & Switch */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Switches</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch />
              <Label>Email notifications</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch defaultChecked />
              <Label>SMS notifications</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch disabled />
              <Label className="text-[#6B7280]">Disabled option</Label>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Icon Style</h2>
          <div className=" border border-border rounded p-6">
            <p className="text-[14px] leading-[20px] text-[#6B7280] mb-4">
              Thin-line icons from Lucide React. Size: 16–20px inline, 24px standalone.
            </p>
            <div className="flex gap-4 items-center">
              <Star size={20} className="text-primary" />
              <CheckCircle2 size={20} className="text-[#3A7A1A]" />
              <AlertCircle size={20} className="text-[#DA291C]" />
              <Info size={20} className="text-primary" />
              <Bell size={20} className="text-[#6B7280]" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
