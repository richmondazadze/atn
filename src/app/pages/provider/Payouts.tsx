import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const transactions = [
  { id: 't1', date: '2026-03-10', service: 'Deep House Cleaning', amount: 75, status: 'paid', customer: 'Sarah Williams' },
  { id: 't2', date: '2026-03-08', service: 'Move-Out Cleaning', amount: 120, status: 'paid', customer: 'Jessica Martinez' },
  { id: 't3', date: '2026-03-05', service: 'Deep House Cleaning', amount: 75, status: 'processing', customer: 'Lauren Parker' },
];

export default function Payouts() {
  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl lg:text-[32px] font-semibold mb-6 lg:mb-8">Payouts</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><DollarSign size={16} /> Available Balance</div>
            <div className="text-2xl lg:text-[32px] font-semibold">$270</div>
            <Button className="mt-3 bg-primary text-primary-foreground text-sm" size="sm" onClick={() => toast.success('Payout requested — typically 2–3 business days')}>
              Request payout
            </Button>
          </Card>

          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><TrendingUp size={16} /> This Month</div>
            <div className="text-2xl lg:text-[32px] font-semibold">$825</div>
          </Card>

          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><Calendar size={16} /> Next Payout</div>
            <div className="font-medium">Mar 17, 2026</div>
            <p className="text-xs text-muted mt-0.5">$270 estimated</p>
          </Card>
        </div>

        {/* Transaction history */}
        <Card className="border-border p-5 lg:p-6 mb-6">
          <h2 className="text-lg font-medium mb-5">Transaction History</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden sm:table-cell">Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                    <TableCell className="text-sm">{t.service}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{t.customer}</TableCell>
                    <TableCell className="font-medium">${t.amount}</TableCell>
                    <TableCell>
                      {t.status === 'paid'
                        ? <Badge className="bg-primary/10 text-primary border-0">Paid</Badge>
                        : <Badge variant="secondary">Processing</Badge>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Payout method */}
        <Card className="border-border p-5 lg:p-6">
          <h2 className="text-lg font-medium mb-2">Payout Method</h2>
          <p className="text-sm text-muted mb-4">Connect your bank account or debit card to receive payouts automatically.</p>
          <Button variant="outline" className="border-border">Set up payout method</Button>
        </Card>
      </div>
    </div>
  );
}
