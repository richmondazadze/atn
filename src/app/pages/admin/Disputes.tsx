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

function statusBadge(status: Dispute['status']) {
  if (status === 'open') return <Badge variant="destructive" className="text-xs"><AlertCircle size={11} className="mr-1" />Open</Badge>;
  if (status === 'in-progress') return <Badge variant="secondary" className="text-xs"><Clock size={11} className="mr-1" />In Review</Badge>;
  if (status === 'resolved' || status === 'closed') return <Badge className="bg-primary/10 text-primary border-0 text-xs"><CheckCircle size={11} className="mr-1" />Resolved</Badge>;
  return null;
}

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
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Dispute Management</h1>
          <p className="text-sm text-muted">Review and resolve customer disputes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total', value: disputes.length, color: '' },
            { label: 'Open', value: disputes.filter(d => d.status === 'open').length, color: 'text-destructive' },
            { label: 'In Progress', value: disputes.filter(d => d.status === 'in-progress').length, color: 'text-amber-500' },
            { label: 'Resolved', value: disputes.filter(d => d.status === 'resolved' || d.status === 'closed').length, color: 'text-primary' },
          ].map(s => (
            <Card key={s.label} className="border-border p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <Card className="border-border p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
            <p className="text-sm text-muted">Showing {filteredDisputes.length} of {disputes.length} disputes</p>
          </div>
        </Card>

        {/* Disputes list */}
        <div className="space-y-4">
          {filteredDisputes.map(dispute => (
            <Card key={dispute.id} className="border-border p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{dispute.id.slice(0, 8)}</h3>
                    {statusBadge(dispute.status)}
                    {dispute.priority === 'high' && (
                      <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">High Priority</Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted mb-4">{dispute.issue}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
                    {[
                      { label: 'Customer', value: dispute.customer_name || '—' },
                      { label: 'Provider', value: dispute.provider_name || '—' },
                      { label: 'Service', value: dispute.listing_title },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-muted mb-0.5">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-secondary rounded text-sm text-muted">
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
                        <DialogTitle>Dispute {dispute.id.slice(0, 8)}</DialogTitle>
                        <DialogDescription>Review details and take action on this dispute</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="p-4 bg-secondary rounded text-sm">
                          <p><strong>Customer:</strong> {dispute.customer_name || '—'}</p>
                          <p><strong>Provider:</strong> {dispute.provider_name || '—'}</p>
                          <p><strong>Service:</strong> {dispute.listing_title}</p>
                        </div>
                        <div>
                          <Label className="mb-1 block">Resolution Notes</Label>
                          <Textarea value={resolutionText} onChange={e => setResolutionText(e.target.value)} placeholder="Document your decision and reasoning..." className="min-h-[100px]" />
                        </div>
                        <div>
                          <Label className="mb-1 block">Action</Label>
                          <Select value={resolutionAction} onValueChange={setResolutionAction}>
                            <SelectTrigger><SelectValue placeholder="Select resolution" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="refund-full">Full Refund to Customer</SelectItem>
                              <SelectItem value="refund-partial">Partial Refund</SelectItem>
                              <SelectItem value="favor-provider">Favor Provider</SelectItem>
                              <SelectItem value="mediation">Require Mediation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <Button variant="outline" className="border-border" onClick={() => toast.info('Messaging coming soon')}>
                            <MessageSquare size={14} className="mr-1.5" /> Contact Parties
                          </Button>
                          <Button className="bg-primary text-primary-foreground" onClick={() => handleResolve(dispute.id)}>
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
            <Card className="border-border p-12 text-center">
              <CheckCircle size={44} className="mx-auto mb-4 text-primary" />
              <p className="text-muted text-sm">No disputes found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
