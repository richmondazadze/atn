import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { useDisputes, type Dispute } from '../../../hooks/useDisputes';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

function statusBadge(status: Dispute['status']) {
  if (status === 'open')
    return (
      <Badge className="bg-surface-coral text-coral border-0 text-xs">
        <AlertCircle size={11} className="mr-1" />Open
      </Badge>
    );
  if (status === 'in-progress')
    return (
      <Badge className="bg-surface-amber text-amber-600 border-0 text-xs">
        <Clock size={11} className="mr-1" />In Review
      </Badge>
    );
  if (status === 'resolved' || status === 'closed')
    return (
      <Badge className="bg-surface-green text-status-green border-0 text-xs">
        <CheckCircle size={11} className="mr-1" />Resolved
      </Badge>
    );
  return null;
}

const STATUS_BORDER: Record<string, string> = {
  open: 'border-l-4 border-l-coral',
  'in-progress': 'border-l-4 border-l-amber-400',
  resolved: 'border-l-4 border-l-status-green',
  closed: 'border-l-4 border-l-status-green',
};

const STAGGER = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-600', 'delay-700'];

export default function DisputesPage() {
  const { disputes, loading, setDisputes } = useDisputes();
  const [statusFilter, setStatusFilter] = useState('all');
  const [resolutionText, setResolutionText] = useState('');
  const [resolutionAction, setResolutionAction] = useState('');

  const filteredDisputes = statusFilter === 'all' ? disputes : disputes.filter(d => d.status === statusFilter);

  async function handleResolve(id: string) {
    if (!resolutionText.trim()) { toast.error('Please enter resolution notes'); return; }
    const { error } = await supabase
      .from('disputes')
      .update({ status: 'resolved', resolution: resolutionText.trim() })
      .eq('id', id);
    if (error) { toast.error('Failed to submit resolution'); return; }
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' as const, resolution: resolutionText.trim() } : d));
    setResolutionText('');
    setResolutionAction('');
    toast.success('Resolution submitted');
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-7xl mx-auto animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-coral flex items-center justify-center shrink-0">
                <AlertCircle size={22} className="text-coral" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="label-pill bg-surface-coral text-coral">Admin</span>
                </div>
                <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Dispute Management</h1>
                <p className="text-sm text-muted mt-0.5">Review and resolve customer disputes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {disputes.filter(d => d.status === 'open').length > 0 && (
                <span className="label-pill bg-surface-coral text-coral animate-scale-in">
                  <AlertCircle size={11} />
                  {disputes.filter(d => d.status === 'open').length} Open
                </span>
              )}
              {disputes.filter(d => d.status === 'in-progress').length > 0 && (
                <span className="label-pill bg-surface-amber text-amber-600 animate-scale-in delay-100">
                  <Clock size={11} />
                  {disputes.filter(d => d.status === 'in-progress').length} In Review
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: disputes.length, surface: 'bg-secondary', text: '' },
              { label: 'Open', value: disputes.filter(d => d.status === 'open').length, surface: 'bg-surface-coral', text: 'text-coral' },
              { label: 'In Progress', value: disputes.filter(d => d.status === 'in-progress').length, surface: 'bg-surface-amber', text: 'text-amber-600' },
              { label: 'Resolved', value: disputes.filter(d => d.status === 'resolved' || d.status === 'closed').length, surface: 'bg-surface-green', text: 'text-status-green' },
            ].map((s, i) => (
              <Card
                key={s.label}
                className={`border-border p-4 card-lift animate-fade-up ${STAGGER[i]}`}
              >
                <div className={`inline-flex items-center justify-center w-8 h-8 ${s.surface} mb-2`}>
                  <span className={`text-xs font-bold ${s.text || 'text-muted'}`}>#</span>
                </div>
                <p className="text-xs text-muted mb-1">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.text}`}>{s.value}</p>
              </Card>
            ))}
          </div>

          {/* Filter */}
          <Card className="border-border p-4 mb-6 animate-fade-up delay-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disputes</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted">
                Showing <span className="font-semibold text-foreground">{filteredDisputes.length}</span> of{' '}
                <span className="font-semibold text-foreground">{disputes.length}</span> disputes
              </p>
            </div>
          </Card>

          {/* Disputes list */}
          <div className="space-y-4">
            {filteredDisputes.map((dispute, idx) => (
              <Card
                key={dispute.id}
                className={`border-border p-5 lg:p-6 card-lift rounded-2xl animate-fade-up ${STAGGER[Math.min(idx, 7)]} ${STATUS_BORDER[dispute.status] ?? ''}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">#{dispute.id.slice(0, 8)}</h3>
                      {statusBadge(dispute.status)}
                      {dispute.priority === 'high' && (
                        <Badge className="bg-surface-amber text-amber-600 border-0 text-xs">High Priority</Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted mb-4">{dispute.issue}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
                      {[
                        { label: 'Customer', value: dispute.customer_name || '—' },
                        { label: 'Provider', value: dispute.provider_name || '—' },
                        { label: 'Service', value: dispute.listing_title },
                      ].map(item => (
                        <div key={item.label} className="p-2 bg-secondary">
                          <p className="text-xs text-muted mb-0.5">{item.label}</p>
                          <p className="font-medium text-sm">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-secondary border border-border text-sm text-muted">
                      <strong className="text-foreground">Details:</strong> {dispute.description}
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0">
                    <p className="text-xs text-muted">
                      {new Date(dispute.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <Dialog onOpenChange={open => { if (!open) { setResolutionText(''); setResolutionAction(''); } }}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                          Review Dispute
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 bg-surface-coral flex items-center justify-center">
                              <AlertCircle size={16} className="text-coral" />
                            </div>
                            <div>
                              <DialogTitle>Dispute #{dispute.id.slice(0, 8)}</DialogTitle>
                              <DialogDescription>Review details and take action on this dispute</DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'Customer', value: dispute.customer_name || '—' },
                              { label: 'Provider', value: dispute.provider_name || '—' },
                              { label: 'Service', value: dispute.listing_title },
                            ].map(item => (
                              <div key={item.label} className="p-3 bg-secondary border border-border">
                                <p className="text-xs text-muted mb-0.5">{item.label}</p>
                                <p className="font-medium text-sm">{item.value}</p>
                              </div>
                            ))}
                          </div>
                          <div>
                            <Label className="mb-1.5 block">Resolution Notes</Label>
                            <Textarea
                              value={resolutionText}
                              onChange={e => setResolutionText(e.target.value)}
                              placeholder="Document your decision and reasoning..."
                              className="min-h-[100px] bg-secondary border-border focus:border-primary"
                            />
                          </div>
                          <div>
                            <Label className="mb-1.5 block">Action</Label>
                            <Select value={resolutionAction} onValueChange={setResolutionAction}>
                              <SelectTrigger className="border-border"><SelectValue placeholder="Select resolution" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="refund-full">Full Refund to Customer</SelectItem>
                                <SelectItem value="refund-partial">Partial Refund</SelectItem>
                                <SelectItem value="favor-provider">Favor Provider</SelectItem>
                                <SelectItem value="mediation">Require Mediation</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2 border-t border-border">
                            <div className="flex gap-2">
                              {dispute.customer_email && (
                                <Button variant="outline" size="sm" className="border-border" asChild>
                                  <a href={`mailto:${dispute.customer_email}`}>
                                    <MessageSquare size={14} className="mr-1.5" /> Email Customer
                                  </a>
                                </Button>
                              )}
                              {dispute.provider_email && (
                                <Button variant="outline" size="sm" className="border-border" asChild>
                                  <a href={`mailto:${dispute.provider_email}`}>
                                    <MessageSquare size={14} className="mr-1.5" /> Email Provider
                                  </a>
                                </Button>
                              )}
                            </div>
                            <Button
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => handleResolve(dispute.id)}
                            >
                              Submit Resolution
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}

            {filteredDisputes.length === 0 && (
              <Card className="border-border p-12 text-center animate-scale-in">
                <div className="w-14 h-14 bg-surface-green flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-status-green" />
                </div>
                <p className="font-medium mb-1">All clear!</p>
                <p className="text-muted text-sm">No disputes found for the selected filter</p>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
