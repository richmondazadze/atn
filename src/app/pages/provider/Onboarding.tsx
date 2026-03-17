import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Separator } from '../../components/ui/separator';
import { CheckCircle2, Upload, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { categories } from '../../data/mockData';
import { toast } from 'sonner';

export default function ProviderOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    zipCodes: [''],
    selectedCategories: [] as string[],
    socialInstagram: '',
    socialFacebook: '',
    agreeTOS: false,
    agreeBackgroundCheck: false,
  });

  const steps = [
    { number: 1, title: 'Profile', description: 'Tell customers about yourself' },
    { number: 2, title: 'Categories', description: 'What services do you offer?' },
    { number: 3, title: 'Payment', description: 'Set up your payouts' },
    { number: 4, title: 'Verification', description: 'Complete your profile' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success('Profile setup complete! Welcome to ATN.');
      navigate('/provider');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter(c => c !== id)
        : [...prev.selectedCategories, id],
    }));
  };

  const addZipCode = () => setFormData(prev => ({ ...prev, zipCodes: [...prev.zipCodes, ''] }));

  const removeZipCode = (index: number) =>
    setFormData(prev => ({ ...prev, zipCodes: prev.zipCodes.filter((_, i) => i !== index) }));

  const updateZipCode = (index: number, value: string) => {
    const next = [...formData.zipCodes];
    next[index] = value;
    setFormData(prev => ({ ...prev, zipCodes: next }));
  };

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Welcome to Access Terrain Network</h1>
          <p className="text-sm text-muted">Let's get your provider profile set up</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 text-sm font-medium transition-colors ${
                    step.number <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-border text-muted'
                  }`}>
                    {step.number < currentStep ? <CheckCircle2 size={18} /> : step.number}
                  </div>
                  <p className={`text-xs font-medium hidden sm:block ${step.number === currentStep ? 'text-foreground' : 'text-muted'}`}>
                    {step.title}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-5 ${step.number < currentStep ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Profile */}
        {currentStep === 1 && (
          <Card className="border-border p-5 lg:p-8">
            <h2 className="text-xl font-semibold mb-5">Tell us about yourself</h2>
            <div className="space-y-5">
              <div>
                <Label htmlFor="ob-bio">Bio</Label>
                <Textarea
                  id="ob-bio"
                  value={formData.bio}
                  onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Share your experience, certifications, and what makes you great at what you do..."
                  className="mt-1 min-h-[120px]"
                />
                <p className="text-xs text-muted mt-1">A good bio increases bookings. Mention years of experience, training, and what you're passionate about.</p>
              </div>

              <div>
                <Label>Service Areas (ZIP codes)</Label>
                <div className="space-y-2 mt-1">
                  {formData.zipCodes.map((zip, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={zip}
                        onChange={e => updateZipCode(i, e.target.value)}
                        placeholder="72401"
                        maxLength={5}
                        className="flex-1"
                      />
                      {formData.zipCodes.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => removeZipCode(i)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" className="mt-2 border-border" onClick={addZipCode}>
                  + Add another ZIP code
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="ob-instagram">Instagram (optional)</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                    <Input
                      id="ob-instagram"
                      value={formData.socialInstagram}
                      onChange={e => setFormData(p => ({ ...p, socialInstagram: e.target.value }))}
                      placeholder="yourusername"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ob-facebook">Facebook (optional)</Label>
                  <Input
                    id="ob-facebook"
                    value={formData.socialFacebook}
                    onChange={e => setFormData(p => ({ ...p, socialFacebook: e.target.value }))}
                    placeholder="Your Business Page"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Profile Photo</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded p-8 text-center">
                  <Upload size={30} className="mx-auto mb-3 text-muted" aria-hidden="true" />
                  <p className="text-sm text-muted mb-3">Upload a professional, friendly photo</p>
                  <Button type="button" variant="outline" className="border-border" onClick={() => toast.info('Photo upload coming soon')}>
                    Choose photo
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Categories */}
        {currentStep === 2 && (
          <Card className="border-border p-5 lg:p-8">
            <h2 className="text-xl font-semibold mb-1">What services do you offer?</h2>
            <p className="text-sm text-muted mb-5">Select all that apply. You can add specific listings later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map(category => {
                const isSelected = formData.selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-pressed={isSelected}
                    className={`p-4 border rounded text-left transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{category.name}</p>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {isSelected && <CheckCircle2 size={14} className="text-primary-foreground" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {formData.selectedCategories.length > 0 && (
              <div className="mt-5 p-3 bg-primary/10 rounded text-sm font-medium">
                {formData.selectedCategories.length} {formData.selectedCategories.length === 1 ? 'category' : 'categories'} selected
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <Card className="border-border p-5 lg:p-8">
            <h2 className="text-xl font-semibold mb-1">Payment information</h2>
            <p className="text-sm text-muted mb-5">Where should we send your earnings?</p>
            <div className="space-y-5">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm">
                  Your banking information is encrypted and secure. We use Stripe for all payments.
                  Bank account setup will be completed through Stripe's secure onboarding flow.
                </p>
              </div>
              <div className="p-5 border border-dashed border-border rounded text-center">
                <p className="text-sm text-muted mb-3">Connect your bank account to receive payouts</p>
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={() => toast.info('Stripe onboarding will be available at launch')}
                >
                  Connect Bank Account via Stripe
                </Button>
              </div>
              <div className="p-4 bg-secondary rounded text-sm text-muted">
                <strong className="text-foreground">Payment schedule:</strong> Earnings are deposited weekly on Mondays. You can change this in Settings → Payment Information.
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Verification */}
        {currentStep === 4 && (
          <Card className="border-border p-5 lg:p-8">
            <h2 className="text-xl font-semibold mb-1">Almost done!</h2>
            <p className="text-sm text-muted mb-5">Just a few final items to complete your profile</p>
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-4 border border-border rounded">
                <Checkbox
                  id="ob-tos"
                  checked={formData.agreeTOS}
                  onCheckedChange={checked => setFormData(p => ({ ...p, agreeTOS: checked as boolean }))}
                />
                <div className="flex-1">
                  <Label htmlFor="ob-tos" className="cursor-pointer font-medium">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                  <p className="text-xs text-muted mt-1">
                    By checking this box, you agree to ATN's provider terms and community guidelines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border border-border rounded">
                <Checkbox
                  id="ob-background"
                  checked={formData.agreeBackgroundCheck}
                  onCheckedChange={checked => setFormData(p => ({ ...p, agreeBackgroundCheck: checked as boolean }))}
                />
                <div className="flex-1">
                  <Label htmlFor="ob-background" className="cursor-pointer font-medium">
                    I authorize a background check
                  </Label>
                  <p className="text-xs text-muted mt-1">
                    Background checks help build trust with customers. Results typically available in 2–3 business days.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="p-5 bg-primary/5 border border-primary/20 rounded">
                <h3 className="font-medium mb-3">Next Steps</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    'Create your first service listing',
                    'Set your weekly availability',
                    'Complete background check (2–3 days)',
                    'Start accepting bookings!',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/provider')}>
              Skip for now
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={currentStep === 4 && (!formData.agreeTOS || !formData.agreeBackgroundCheck)}
            >
              {currentStep === steps.length ? 'Complete setup' : 'Continue'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
