import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { EmptyState } from '../../components/EmptyState';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type PaymentInfo = {
  bankName: string;
  lastFour: string;
  verified: boolean;
  payoutSchedule: string;
};

type Transaction = {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: string;
  customer: string;
};

export default function Payouts() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [bookingsRes, providerRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, date, status, price, listings(title), profiles!bookings_customer_id_fkey(name)')
          .eq('provider_id', user.id)
          .in('status', ['completed', 'confirmed'])
          .order('date', { ascending: false }),
        supabase
          .from('providers')
          .select('payment_info')
          .eq('id', user.id)
          .single(),
      ]);

      if (bookingsRes.data) {
        setTransactions(bookingsRes.data.map((b: Record<string, unknown>) => {
          const listing = b.listings as { title: string } | null;
          const profile = b.profiles as { name: string } | null;
          return {
            id: b.id as string,
            date: b.date as string,
            service: listing?.title ?? 'Service',
            amount: b.price as number,
            status: (b.status as string) === 'completed' ? 'paid' : 'processing',
            customer: profile?.name ?? 'Customer',
          };
        }));
      }

      if (providerRes.data?.payment_info) {
        setPaymentInfo(providerRes.data.payment_info as PaymentInfo);
      }

      setLoading(false);
    }
    load();
  }, [user.id]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTotal = transactions
      .filter(t => new Date(t.date) >= monthStart)
      .reduce((s, t) => s + t.amount, 0);
    const processing = transactions
      .filter(t => t.status === 'processing')
      .reduce((s, t) => s + t.amount, 0);
    const totalEarned = transactions.reduce((s, t) => s + t.amount, 0);

    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));

    return { monthTotal, processing, totalEarned, nextPayout: nextMonday };
  }, [transactions]);

  const scheduleLabel = paymentInfo?.payoutSchedule === 'daily'
    ? 'Daily'
    : paymentInfo?.payoutSchedule === 'monthly'
    ? 'Monthly (1st)'
    : 'Weekly (Mondays)';

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl lg:text-[32px] font-semibold mb-6 lg:mb-8">Payouts</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><DollarSign size={16} /> Available Balance</div>
            <div className="text-2xl lg:text-[32px] font-semibold chewy-regular">${stats.processing}</div>
            <Button
              className="mt-3 bg-primary text-primary-foreground text-sm"
              size="sm"
              disabled={stats.processing === 0}
              onClick={() => toast.success('Payout requested — typically 2–3 business days')}
            >
              Request payout
            </Button>
          </Card>

          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><TrendingUp size={16} /> This Month</div>
            <div className="text-2xl lg:text-[32px] font-semibold chewy-regular">${stats.monthTotal}</div>
          </Card>

          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><Calendar size={16} /> Next Payout</div>
            <div className="font-medium">
              {stats.nextPayout.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <p className="text-xs text-muted mt-0.5">{scheduleLabel} schedule</p>
          </Card>
        </div>

        {/* Transaction history */}
        <Card className="border-border p-5 lg:p-6 mb-6">
          <h2 className="text-lg font-medium mb-5">Transaction History</h2>

          {transactions.length === 0 ? (
            <EmptyState
              icon={<DollarSign size={40} />}
              title="No transactions yet"
              description="Completed bookings will appear here with their payment status."
            />
          ) : (
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
                      <TableCell className="font-medium chewy-regular">${t.amount}</TableCell>
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
          )}
        </Card>

        {/* Payout method */}
        <Card className="border-border p-5 lg:p-6">
          <h2 className="text-lg font-medium mb-2">Payout Method</h2>
          {paymentInfo?.bankName ? (
            <div className="flex items-center justify-between p-4 bg-background rounded mt-3">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-muted" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{paymentInfo.bankName}</p>
                    {paymentInfo.verified && <Badge className="bg-primary/10 text-primary border-0 text-xs">Verified</Badge>}
                  </div>
                  <p className="text-xs text-muted">Account ending in {paymentInfo.lastFour}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted mb-4">Add your payment method in Settings to receive payouts automatically.</p>
              <Button variant="outline" className="border-border" onClick={() => toast.info('Go to Settings → Payment Information to add your bank account')}>
                Set up payout method
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
