import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { DollarSign, TrendingUp, Calendar, CreditCard, CheckCircle2, Clock } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 animate-fade-up">
          <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
            <DollarSign size={20} className="text-status-green" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Payouts</h1>
            <p className="text-sm text-muted mt-0.5">Track your earnings and payment schedule</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Available Balance — prominent card */}
            <Card className="card-lift rounded-2xl border-primary/20 bg-surface-teal p-5 lg:p-6 animate-fade-up delay-100">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                <DollarSign size={16} className="text-primary" />
                Available Balance
              </div>
              <div className="text-4xl font-bold text-primary mb-3">${stats.processing}</div>
              <Button
                className="bg-primary text-primary-foreground text-sm rounded-xl hover:bg-primary/90 w-full sm:w-auto"
                size="sm"
                disabled={stats.processing === 0}
                onClick={() => toast.success('Payout requested — typically 2–3 business days')}
              >
                Request Payout
              </Button>
            </Card>

            <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 animate-fade-up delay-200">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                <TrendingUp size={16} />
                This Month
              </div>
              <div className="text-4xl font-bold text-foreground">${stats.monthTotal}</div>
              <p className="text-xs text-muted mt-1.5">Total earned this month</p>
            </Card>

            <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 animate-fade-up delay-300">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                <Calendar size={16} />
                Next Payout
              </div>
              <div className="font-bold text-lg text-foreground">
                {stats.nextPayout.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <p className="text-xs text-muted mt-0.5">{scheduleLabel} schedule</p>
            </Card>
          </div>

          {/* Transaction history */}
          <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 mb-6 animate-fade-up delay-200">
            <h2 className="text-lg font-semibold mb-5">Transaction History</h2>

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
                    <TableRow className="border-border">
                      <TableHead className="text-xs font-semibold text-muted uppercase tracking-wide">Date</TableHead>
                      <TableHead className="text-xs font-semibold text-muted uppercase tracking-wide">Service</TableHead>
                      <TableHead className="hidden sm:table-cell text-xs font-semibold text-muted uppercase tracking-wide">Customer</TableHead>
                      <TableHead className="text-xs font-semibold text-muted uppercase tracking-wide">Amount</TableHead>
                      <TableHead className="text-xs font-semibold text-muted uppercase tracking-wide">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(t => (
                      <TableRow key={t.id} className="border-border/50 hover:bg-secondary/40 transition-colors">
                        <TableCell className="text-sm text-muted">
                          {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{t.service}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted">{t.customer}</TableCell>
                        <TableCell className="font-bold text-primary">${t.amount}</TableCell>
                        <TableCell>
                          {t.status === 'paid' ? (
                            <Badge className="bg-surface-green text-status-green border-0 gap-1 font-medium">
                              <CheckCircle2 size={11} />
                              Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-surface-amber text-amber-700 border-0 gap-1 font-medium">
                              <Clock size={11} />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>

          {/* Payout method */}
          <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 animate-fade-up delay-300">
            <h2 className="text-lg font-semibold mb-2">Payout Method</h2>
            {paymentInfo?.bankName ? (
              <div className="flex items-center justify-between p-4 bg-secondary/40 rounded-xl mt-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-teal flex items-center justify-center">
                    <CreditCard size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{paymentInfo.bankName}</p>
                      {paymentInfo.verified && (
                        <Badge className="bg-surface-green text-status-green border-0 text-xs font-medium gap-1">
                          <CheckCircle2 size={10} />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted">Account ending in {paymentInfo.lastFour}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted mb-4 mt-1">
                  Add your payment method in Settings to receive payouts automatically.
                </p>
                <Button
                  variant="outline"
                  className="border-border rounded-xl hover:bg-surface-teal hover:border-primary hover:text-primary transition-all"
                  onClick={() => toast.info('Go to Settings → Payment Information to add your bank account')}
                >
                  Set up payout method
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
