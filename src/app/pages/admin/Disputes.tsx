import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

type Dispute = {
  id: string;
  customer: string;
  provider: string;
  listing: string;
  reason: string;
  status: 'open' | 'in-review' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  amount: string;
  date: string;
  description: string;
};

const DISPUTES: Dispute[] = [
  { id: 'D-1043', customer: 'Sarah Martinez', provider: 'Deja Johnson', listing: 'Deep House Cleaning', reason: 'Service not completed as described', status: 'open', priority: 'high', amount: '$75', date: '2026-03-10', description: 'Customer reports that bathrooms were not cleaned thoroughly despite being listed in the service description.' },
  { id: 'D-1042', customer: 'Jessica Brown', provider: 'Tasha Miles', listing: 'Knotless Box Braids', reason: 'Appointment cancellation dispute', status: 'in-review', priority: 'medium', amount: '$160', date: '2026-03-09', description: 'Provider cancelled 2 hours before appointment. Customer requesting full refund.' },
  { id: 'D-1041', customer: 'Amanda Wilson', provider: 'Renee Carter', listing: 'Gel Manicure', reason: 'Payment issue', status: 'resolved', priority: 'low', amount: '$45', date: '2026-03-08', description: 'Double charge resolved - refund issued.' },
  { id: 'D-1040', customer: 'Lisa Johnson', provider: 'Kimora Reed', listing: 'Ceiling Fan Installation', reason: 'Quality of work', status: 'open', priority: 'high', amount: '$90', date: '2026-03-07', description: 'Fan is making noise and customer concerned about installation safety.' },
];

function statusBadge(status: Dispute['status']) {
  if (status === 'open') return <Badge variant="destructive" className="text-xs"><AlertCircle size={11} className="mr-1" />Open</Badge>;
  if (status === 'in-review') return <Badge variant="secondary" className="text-xs"><Clock size={11} className="mr-1" />In Review</Badge>;
  return <Badge className="bg-primary/10 text-primary border-0 text-xs"><CheckCircle size={11} className="mr-1" />Resolved</Badge>;
}

export default function DisputesPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const filteredDisputes = statusFilter === 'all' ? DISPUTES : DISPUTES.filter(d => d.status === statusFilter);

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Dispute Management</h1>
          <p className="text-sm text-muted">Review and resolve customer disputes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total', value: DISPUTES.length, color: '' },
            { label: 'Open', value: DISPUTES.filter(d => d.status === 'open').length, color: 'text-destructive' },
            { label: 'In Review', value: DISPUTES.filter(d => d.status === 'in-review').length, color: 'text-amber-500' },
            { label: 'Resolved', value: DISPUTES.filter(d => d.status === 'resolved').length, color: 'text-primary' },
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
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted">Showing {filteredDisputes.length} of {DISPUTES.length} disputes</p>
          </div>
        </Card>

        {/* Disputes list */}
        <div className="space-y-4">
          {filteredDisputes.map(dispute => (
            <Card key={dispute.id} className="border-border p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{dispute.id}</h3>
                    {statusBadge(dispute.status)}
                    {dispute.priority === 'high' && (
                      <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">High Priority</Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted mb-4">{dispute.reason}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                    {[
                      { label: 'Customer', value: dispute.customer },
                      { label: 'Provider', value: dispute.provider },
                      { label: 'Service', value: dispute.listing },
                      { label: 'Amount', value: dispute.amount },
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
                    {new Date(dispute.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                        Review Dispute
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Dispute {dispute.id}</DialogTitle>
                        <DialogDescription>Review details and take action on this dispute</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="p-4 bg-secondary rounded text-sm">
                          <p><strong>Customer:</strong> {dispute.customer}</p>
                          <p><strong>Provider:</strong> {dispute.provider}</p>
                          <p><strong>Service:</strong> {dispute.listing}</p>
                          <p><strong>Amount:</strong> {dispute.amount}</p>
                        </div>
                        <div>
                          <Label className="mb-1 block">Resolution Notes</Label>
                          <Textarea placeholder="Document your decision and reasoning..." className="min-h-[100px]" />
                        </div>
                        <div>
                          <Label className="mb-1 block">Action</Label>
                          <Select>
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
                          <Button className="bg-primary text-primary-foreground" onClick={() => toast.success('Resolution submitted')}>
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
