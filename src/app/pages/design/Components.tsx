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
    <div className="min-h-screen bg-white p-16" style={{ width: '1440px', margin: '0 auto' }}>
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '72px', paddingRight: '72px' }}>
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[32px] leading-[40px] font-semibold mb-2">01 • Components</h1>
          <p className="text-[#4B5563]">Reusable UI components for Access Terrain Network</p>
        </div>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button className="bg-[#7BC950] hover:bg-[#6BA840] text-white">
              Primary Button
            </Button>
            <Button variant="outline" className="border-[#E5E7EB] text-[#111111] hover:bg-[#F9FAFB]">
              Secondary Button
            </Button>
            <Button variant="ghost" className="text-[#111111] hover:bg-[#F9FAFB]">
              Ghost Button
            </Button>
            <Button variant="destructive" className="bg-[#DA291C] hover:bg-[#C01810] text-white">
              Destructive
            </Button>
            <Button disabled className="bg-[#E5E7EB] text-[#4B5563]">
              Disabled
            </Button>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Form Inputs</h2>
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label>Default Input</Label>
              <Input placeholder="Enter text here" className="border-[#E5E7EB]" />
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
              <Input disabled placeholder="Disabled field" className="bg-[#F9FAFB]" />
            </div>
            <div className="space-y-2">
              <Label>Textarea</Label>
              <Textarea placeholder="Enter description" className="border-[#E5E7EB] min-h-24" />
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-[#7BC950] text-white border-0">Active</Badge>
            <Badge className="bg-[#7CE577] text-[#111111] border-0">Featured</Badge>
            <Badge className="bg-[#A0CCDA] text-[#111111] border-0">Test Mode</Badge>
            <Badge variant="outline" className="border-[#E5E7EB] text-[#4B5563]">
              Verified
            </Badge>
            <Badge className="bg-[#DA291C] text-white border-0">Flagged</Badge>
            <Badge className="bg-[#E5E7EB] text-[#4B5563] border-0">Inactive</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Cards</h2>
          <div className="grid grid-cols-3 gap-6">
            <Card className="border-[#E5E7EB] p-6">
              <h3 className="font-medium mb-2">Standard Card</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563]">
                Basic card with subtle border and minimal styling.
              </p>
            </Card>
            <Card className="border-[#7BC950] p-6 bg-[#F9FAFB]">
              <h3 className="font-medium mb-2">Highlighted Card</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563]">
                Card with primary border for emphasis.
              </p>
            </Card>
            <Card className="border-[#E5E7EB] p-6 hover:border-[#7BC950] transition-colors">
              <h3 className="font-medium mb-2">Interactive Card</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563]">
                Hover to see border color change.
              </p>
            </Card>
          </div>
        </section>

        {/* Alerts */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Alerts & Banners</h2>
          <div className="space-y-4">
            <Alert className="border-[#A0CCDA] bg-[#A0CCDA]/10">
              <Info size={16} className="text-[#111111]" />
              <AlertDescription className="text-[#111111]">
                Test Mode — no real charges in V1. All payments are simulated.
              </AlertDescription>
            </Alert>
            <Alert className="border-[#7BC950] bg-[#B6EFD4]/30">
              <CheckCircle2 size={16} className="text-[#7BC950]" />
              <AlertDescription className="text-[#111111]">
                Your listing has been published successfully!
              </AlertDescription>
            </Alert>
            <Alert className="border-[#DA291C] bg-[#DA291C]/10">
              <AlertCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">
                Payment failed. Please check your card details and try again.
              </AlertDescription>
            </Alert>
            <Alert className="border-[#E5E7EB] bg-[#F9FAFB]">
              <Bell size={16} className="text-[#4B5563]" />
              <AlertDescription className="text-[#4B5563]">
                You have 3 new booking requests pending review.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Star Rating */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Star Rating</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-[#7BC950] text-[#7BC950]" />
              ))}
              <span className="text-[14px] leading-[20px] ml-2 text-[#4B5563]">5.0</span>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={20} className="fill-[#7BC950] text-[#7BC950]" />
              ))}
              <Star size={20} className="text-[#E5E7EB]" />
              <span className="text-[14px] leading-[20px] ml-2 text-[#4B5563]">4.0</span>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={20} className="fill-[#7BC950] text-[#7BC950]" />
              ))}
              {[...Array(2)].map((_, i) => (
                <Star key={i} size={20} className="text-[#E5E7EB]" />
              ))}
              <span className="text-[14px] leading-[20px] ml-2 text-[#4B5563]">3.0</span>
            </div>
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
              <Label className="text-[#4B5563]">Disabled option</Label>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Icon Style</h2>
          <div className="bg-white border border-[#E5E7EB] rounded p-6">
            <p className="text-[14px] leading-[20px] text-[#4B5563] mb-4">
              Thin-line icons from Lucide React. Size: 16-20px for inline, 24px for standalone.
            </p>
            <div className="flex gap-4 items-center">
              <Star size={20} />
              <CheckCircle2 size={20} />
              <AlertCircle size={20} />
              <Info size={20} />
              <Bell size={20} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
