import { useRef, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Bot, Send, Lightbulb, DollarSign, FileText, TrendingUp, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Message = { role: 'user' | 'assistant'; content: string; timestamp: Date };

const TOOLS = [
  { id: 'pricing',      name: 'Pricing Suggestions',  icon: DollarSign, description: 'Get market-based pricing recommendations' },
  { id: 'description',  name: 'Description Writer',   icon: FileText, description: 'Generate compelling service descriptions' },
  { id: 'promo',        name: 'Promotional Ideas',    icon: Lightbulb, description: 'Create seasonal offers and campaigns' },
  { id: 'hours',        name: 'Best Hours Analysis',  icon: TrendingUp, description: 'Find your most profitable time slots' },
  { id: 'review-reply', name: 'Review Reply Helper',  icon: MessageSquare, description: 'Draft professional review responses' },
] as const;

const WELCOME_MESSAGES: Record<string, string> = {
  pricing: 'I can help you set competitive prices for your services. Tell me what service you offer, your experience level, and your area.',
  description: 'I\'ll write compelling service descriptions that highlight your strengths and attract customers. What service would you like to describe?',
  promo: 'Looking for promotional ideas? I can suggest seasonal offers, bundle deals, and marketing campaigns tailored to your business.',
  hours: 'I can analyze your booking patterns and suggest the best hours to maximize your earnings. What\'s your current availability?',
  'review-reply': 'I\'ll help you craft professional, authentic responses to customer reviews. Share the review you received and I\'ll draft a reply.',
};

const QUICK_PROMPTS: Record<string, { label: string; text: string }[]> = {
  pricing: [
    { label: 'Pricing check', text: 'What should I charge for deep house cleaning in Jonesboro with 3 years experience?' },
    { label: 'Compare rates', text: 'How do my prices compare to other cleaners in my area?' },
  ],
  description: [
    { label: 'Write description', text: 'Write a compelling description for my deep cleaning service. I bring all supplies and have 5 years experience.' },
    { label: 'Improve listing', text: 'Help me improve this description: "I clean houses. Contact me for booking."' },
  ],
  promo: [
    { label: 'Spring special', text: 'Suggest a spring cleaning promotion that will attract new customers' },
    { label: 'Referral idea', text: 'What\'s a good referral incentive for my existing customers?' },
  ],
  hours: [
    { label: 'Best times', text: 'What are the most popular booking times for house cleaning in my area?' },
    { label: 'Gap filling', text: 'How can I fill gaps in my schedule between appointments?' },
  ],
  'review-reply': [
    { label: 'Positive review', text: 'Help me reply to: "Amazing service! My house has never been this clean. Will definitely book again!"' },
    { label: 'Mixed review', text: 'Help me reply to: "Great cleaning but arrived 20 minutes late"' },
  ],
};

export default function AICoach() {
  const { user } = useAuth();
  const [selectedTool, setSelectedTool] = useState<string>('pricing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when tool changes
  useEffect(() => {
    const welcomeContent = WELCOME_MESSAGES[selectedTool];
    setMessages([
      { role: 'assistant', content: `Hi ${user.name.split(' ')[0]}! ${welcomeContent}`, timestamp: new Date() },
    ]);
  }, [selectedTool, user.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function generateResponse(userMessage: string, tool: string): string {
    const lowerMsg = userMessage.toLowerCase();
    
    switch (tool) {
      case 'pricing':
        if (lowerMsg.includes('cleaning') || lowerMsg.includes('house')) {
          return 'Based on Jonesboro market rates, I recommend:\n\n• Standard deep cleaning (2-3 hours): $75-95\n• Move-out cleaning (3-4 hours): $120-150\n• Light cleaning (1-2 hours): $50-65\n\nYour 3 years of experience justifies pricing in the middle-to-upper range. Consider offering a first-time customer discount of 10-15% to build your client base.';
        }
        return 'To give you accurate pricing guidance, could you tell me more about:\n\n1. What specific service you offer\n2. How long it typically takes\n3. Your experience level\n4. Any special qualifications or certifications\n\nThis will help me suggest competitive rates for the Jonesboro market.';
        
      case 'description':
        return 'Here\'s a compelling service description:\n\n"Transform your home with professional deep cleaning that goes beyond surface-level tidying. I bring eco-friendly supplies and 5 years of experience to every job.\n\n✓ Kitchens: Appliances, counters, cabinets, floors\n✓ Bathrooms: Deep sanitize tubs, showers, sinks, toilets\n✓ Living spaces: Dust, vacuum, mop, detail work\n✓ Bedrooms: Under-bed cleaning, closet organization\n\nBackground-checked, insured, and committed to your satisfaction. Book today and come home to sparkling clean!"\n\nThis highlights your strengths, builds trust with credentials, and uses clear formatting for easy reading.';
        
      case 'promo':
        return 'Here are some effective promotion ideas:\n\n🌸 Spring Refresh Special\n"Spring Cleaning Package" - 20% off deep cleans booked in March/April. Market as "Clear the winter clutter, welcome spring freshness."\n\n👥 Referral Program\n"Give $20, Get $20" - Both referrer and new customer get $20 off next booking.\n\n📅 Loyalty Discount\n"Frequent Cleaner Program" - 10% off for customers who book 3+ times within 6 months.\n\n🎁 First-Time Offer\n"New Customer Special" - $25 off first deep clean to reduce trial barrier.\n\nWhich one fits your business model best?';
        
      case 'hours':
        return 'Based on service provider patterns in Jonesboro, here are the most profitable time slots:\n\n🔥 Peak Demand (highest booking rates):\n• Saturday mornings (8am-12pm)\n• Sunday afternoons (1pm-5pm)\n• Weekday evenings (5pm-8pm)\n\n💰 Premium Pricing Opportunities:\n• Weekend slots can command 15-20% higher rates\n• Same-day/urgent bookings: add $25-40 rush fee\n• Early morning (7-9am) appeals to working professionals\n\n📊 Gap-Filling Strategy:\nOffer a "Midweek Special" (Tue-Thu 10am-2pm) at 10% off to build consistent weekday volume between peak times.';
        
      case 'review-reply':
        if (lowerMsg.includes('late') || lowerMsg.includes('mix')) {
          return 'Here\'s a professional reply for a mixed review:\n\n"Thank you so much for the kind words about the cleaning quality! I sincerely apologize for running behind schedule—I should have communicated better about the delay. Punctuality is important to me, and I\'m implementing better time buffers between appointments. I truly appreciate your understanding and would love the opportunity to serve you again with on-time service. Please reach out directly for priority scheduling on your next booking!"\n\nThis acknowledges the positive, owns the mistake, explains the fix, and invites future business.';
        }
        return 'Here\'s a warm reply for a positive review:\n\n"Thank you so much for this wonderful review! It was a pleasure cleaning your home, and I\'m thrilled you loved the results. Clients like you make this work so rewarding. I\'ve noted your preferences for next time and look forward to serving you again soon. Thanks for being part of the ATN community! 🌟"\n\nThis is personal, specific, and builds ongoing relationship.';
        
      default:
        return 'I\'m here to help with your business! Could you share more details about what you need assistance with?';
    }
  }

  function handleSend() {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date() },
    ]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking/typing delay
    setTimeout(() => {
      const response = generateResponse(userMessage, selectedTool);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response, timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }

  const currentTool = TOOLS.find(t => t.id === selectedTool);
  const quickPrompts = QUICK_PROMPTS[selectedTool] || [];

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-2xl lg:text-[32px] font-semibold">AI Business Coach</h1>
              <p className="text-sm text-muted">Get personalized guidance to grow your service business</p>
            </div>
          </div>
        </div>

        <Alert className="border-primary/20 bg-primary/5 mb-6">
          <AlertCircle size={16} className="text-foreground" />
          <AlertDescription>
            <strong>Guidance only:</strong> Business suggestions based on Jonesboro market patterns — not legal, financial, or tax advice.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Tools sidebar */}
          <div className="lg:col-span-3">
            <Card className="border-border p-4">
              <p className="text-xs font-medium text-muted uppercase tracking-wide mb-3">Coaching Tools</p>
              <div className="flex flex-row lg:flex-col gap-2 flex-wrap">
                {TOOLS.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        selectedTool === tool.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <Icon size={18} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${selectedTool === tool.id ? 'text-primary-foreground' : ''}`}>
                          {tool.name}
                        </p>
                        <p className={`text-xs truncate ${selectedTool === tool.id ? 'text-primary-foreground/80' : 'text-muted'}`}>
                          {tool.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-9 flex flex-col" style={{ minHeight: 'min(calc(100vh - 280px), 600px)' }}>
            <Card className="border-border flex flex-col flex-1 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5" style={{ maxHeight: '500px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                        <Bot size={18} className="text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted/50 text-foreground border border-border rounded-bl-md'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                      <Bot size={18} className="text-primary-foreground" />
                    </div>
                    <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-md bg-muted/50 border border-border">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-4 bg-white">
                <div className="flex gap-3">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Ask about ${currentTool?.name.toLowerCase() ?? 'your business'}...`}
                    className="min-h-[60px] resize-none text-sm bg-muted/30 border-0 focus-visible:ring-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 shrink-0 self-end h-[60px]"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </Button>
                </div>
                
                {/* Quick prompts */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {quickPrompts.map(p => (
                    <button
                      key={p.label}
                      onClick={() => setInput(p.text)}
                      disabled={isTyping}
                      className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-muted/80 text-muted-foreground transition-colors border border-border"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
