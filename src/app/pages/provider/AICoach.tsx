import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRef, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Bot, Send, Lightbulb, DollarSign, FileText, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';
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
  const assistantIndexRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const welcomeContent = WELCOME_MESSAGES[selectedTool];
    setMessages([
      { role: 'assistant', content: `Hi ${user.name.split(' ')[0]}! ${welcomeContent}`, timestamp: new Date() },
    ]);
  }, [selectedTool, user.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchAIResponse(
    userMessage: string,
    onToken: (token: string) => void,
    signal: AbortSignal
  ): Promise<string> {
    const apiKey = (import.meta as unknown as { env: { VITE_OPENROUTER_API_KEY?: string } })
      .env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      return 'AI Coach is not configured. Add VITE_OPENROUTER_API_KEY to your environment. Get a key at openrouter.ai';
    }

    const toolDesc = TOOLS.find(t => t.id === selectedTool)?.name ?? 'business';
    const systemPrompt = `You are an AI Business Coach for ATN (Access Terrain Network), a local service marketplace in Jonesboro, AR. You help service providers grow their business. The user is currently using the "${toolDesc}" tool. Give practical, actionable advice. Be concise and friendly. Focus on Jonesboro/local market when relevant. This is guidance only—not legal, financial, or tax advice.`;

    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: userMessage },
    ];

    // Pick smaller models first to reduce the chance of upstream 429s.
    // These are OpenRouter "free" models that were eligible for this API key
    // via `GET /models/user`.
    const modelCandidates = [
      'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemma-3-4b-it:free',
      'arcee-ai/trinity-mini:free',
      'nvidia/nemotron-nano-9b-v2:free',
    ];

    async function callModelNonStream(model: string): Promise<string> {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          max_tokens: 1024,
        }),
        signal,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `API error: ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      return text?.trim() || 'Sorry, I could not generate a response. Please try again.';
    }

    async function callModelStream(model: string): Promise<string> {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          max_tokens: 1024,
          stream: true,
        }),
        signal,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `API error: ${res.status}`);
      }

      if (!res.body) throw new Error('OpenRouter stream had no response body.');
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let full = '';
      let buffer = '';

      // OpenRouter returns SSE. We parse `data:` lines and append `delta.content`.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        buffer = buffer.replace(/\r/g, '');

        let sepIndex: number;
        while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
          const chunk = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);

          const lines = chunk.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;

            const dataStr = trimmed.slice('data:'.length).trim();
            if (!dataStr || dataStr === '[DONE]') {
              if (dataStr === '[DONE]') return full;
              continue;
            }

            try {
              const parsed = JSON.parse(dataStr) as unknown;
              const delta =
                (parsed as any)?.choices?.[0]?.delta?.content ??
                (parsed as any)?.choices?.[0]?.message?.content ??
                (parsed as any)?.choices?.[0]?.text;

              if (typeof delta === 'string' && delta.length > 0) {
                full += delta;
                onToken(delta);
              }
            } catch {
              // Ignore malformed JSON chunks.
            }
          }
        }
      }

      return full.trim();
    }

    async function getEligibleModelIds(): Promise<Set<string> | null> {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models/user', {
          method: 'GET',
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        const ids: string[] = (data?.data ?? []).map((m: unknown) => String((m as { id?: unknown }).id ?? ''));
        return new Set(ids.filter(Boolean));
      } catch {
        return null;
      }
    }

    try {
      const eligibleModelIds = await getEligibleModelIds();
      const orderedModels = eligibleModelIds
        ? modelCandidates.filter((m) => eligibleModelIds.has(m))
        : modelCandidates;

      if (orderedModels.length === 0) {
        throw new Error(
          'No eligible OpenRouter endpoints found for the selected models due to guardrail/privacy settings. Configure: https://openrouter.ai/settings/privacy'
        );
      }

      let lastErr: unknown;
      for (const model of orderedModels.slice(0, 3)) {
        try {
          return await callModelStream(model);
        } catch (e) {
          lastErr = e;
          try {
            const full = await callModelNonStream(model);
            onToken(full);
            return full;
          } catch (fallbackErr) {
            lastErr = fallbackErr;
          }
        }
      }
      const msg = lastErr instanceof Error ? lastErr.message : 'Failed to get AI response';
      throw new Error(msg);
    } catch (err) {
      // If both models fail, surface the real OpenRouter message.
      const msg = err instanceof Error ? err.message : 'Failed to get AI response';
      throw new Error(msg);
    }
  }

  async function handleSend() {
    if (isTyping) return;
    if (!input.trim()) return;

    const userMessage = input.trim();
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    assistantIndexRef.current = null;

    // Append the user message + an empty assistant message placeholder,
    // then stream into the placeholder.
    setMessages(prev => {
      const next: Message[] = [
        ...prev,
        { role: 'user' as const, content: userMessage, timestamp: new Date() },
        { role: 'assistant' as const, content: '', timestamp: new Date() },
      ];
      assistantIndexRef.current = next.length - 1;
      return next;
    });
    setInput('');
    setIsTyping(true);

    try {
      await fetchAIResponse(
        userMessage,
        (token) => {
          setMessages(prev => {
            const idx = assistantIndexRef.current;
            if (idx == null) return prev;
            const target = prev[idx];
            if (!target || target.role !== 'assistant') return prev;

            const next = prev.slice();
            next[idx] = { ...target, content: target.content + token };
            return next;
          });
        },
        controller.signal
      );
    } catch (err) {
      const errorText = `Error: ${err instanceof Error ? err.message : 'Failed to get AI response'}. Please check your API key and try again.`;
      setMessages(prev => {
        const idx = assistantIndexRef.current;
        if (idx == null) return prev;
        const target = prev[idx];
        if (!target || target.role !== 'assistant') return prev;

        const next = prev.slice();
        next[idx] = { ...target, content: errorText };
        return next;
      });
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
      assistantIndexRef.current = null;
    }
  }

  const currentTool = TOOLS.find(t => t.id === selectedTool);
  const quickPrompts = QUICK_PROMPTS[selectedTool] || [];

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">AI Business Coach</h1>
          <p className="text-sm text-muted">Get personalized guidance to grow your service business</p>
        </div>

        <Alert className="border-primary/20 bg-primary/5 mb-6">
          <AlertCircle size={16} className="text-foreground" />
          <AlertDescription>
            <strong>Guidance only:</strong> Business suggestions based on Jonesboro market patterns — not legal, financial, or tax advice.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Tools sidebar */}
          <div className="lg:w-64 shrink-0">
            <Card className="border-border p-3 lg:p-4">
              <p className="text-xs font-medium text-muted uppercase tracking-wide mb-3 px-1">Coaching Tools</p>

              {/* Horizontal scroll on mobile, vertical list on desktop */}
              <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 -mx-1 px-1 snap-x snap-mandatory lg:snap-none">
                {TOOLS.map(tool => {
                  const Icon = tool.icon;
                  const active = selectedTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      aria-pressed={active}
                      className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all shrink-0 snap-start w-56 lg:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">{tool.name}</p>
                        <p className={`text-xs leading-tight mt-0.5 ${active ? 'text-primary-foreground/80' : 'text-muted'}`}>
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
          <div className="flex-1 min-w-0 flex flex-col">
            <Card className="border-border flex flex-col flex-1 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4" style={{ minHeight: '320px', maxHeight: 'calc(100vh - 420px)' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={16} className="text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[80%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-secondary text-foreground border border-border rounded-bl-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          skipHtml
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start" aria-live="polite" aria-busy="true">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} className="text-primary-foreground" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-secondary border border-border">
                      <div className="flex gap-1.5 items-center h-5">
                        <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-border p-3 sm:p-4 bg-background">
                <div className="flex gap-2 sm:gap-3 items-end">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Ask about ${currentTool?.name.toLowerCase() ?? 'your business'}...`}
                    rows={1}
                    className="flex-1 min-h-[44px] max-h-32 resize-none rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-shadow"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    onInput={e => {
                      const el = e.currentTarget;
                      el.style.height = 'auto';
                      el.style.height = Math.min(el.scrollHeight, 128) + 'px';
                    }}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="h-11 w-11 shrink-0 rounded-lg"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </Button>
                </div>

                {/* Quick prompts */}
                {quickPrompts.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
                    {quickPrompts.map(p => (
                      <button
                        key={p.label}
                        onClick={() => setInput(p.text)}
                        disabled={isTyping}
                        className="px-3 py-2 rounded-full text-xs font-medium bg-secondary hover:bg-border text-muted-foreground transition-colors border border-border whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
