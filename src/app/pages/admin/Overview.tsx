import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Users, FileText, DollarSign, AlertCircle, TrendingUp, TrendingDown, Activity, ArrowRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminStats } from '../../../hooks/useAdminStats';
import { LoadingSpinner } from '../../components/LoadingSpinner';

function statusBadge(status: string) {
  if (status === 'pending') return <Badge className="bg-primary/20 text-primary border-0">Pending</Badge>;
  if (status === 'urgent') return <Badge variant="destructive">Urgent</Badge>;
  if (status === 'review') return <Badge className="bg-amber-100 text-amber-700 border-0">Review</Badge>;
  return <Badge className="bg-primary/10 text-primary border-0">Complete</Badge>;
}

const ACTIVITY_BORDER: Record<string, string> = {
  pending: 'border-l-4 border-l-primary',
  urgent: 'border-l-4 border-l-coral',
  review: 'border-l-4 border-l-amber',
  complete: 'border-l-4 border-l-status-green',
};

export default function AdminOverview() {
  const { stats, activity, revenueTrend, categoryBreakdown, loading } = useAdminStats();

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  const s = stats!;
  const metrics = [
    {
      icon: DollarSign,
      label: 'Revenue (MTD)',
      value: `$${s.revenueMtd.toLocaleString()}`,
      trend: 'This month',
      up: true,
      surface: 'bg-surface-green',
      iconColor: 'text-status-green',
      delay: 'delay-100',
    },
    {
      icon: FileText,
      label: 'Total Bookings',
      value: s.bookingCount.toLocaleString(),
      trend: 'All time',
      up: true,
      surface: 'bg-surface-teal',
      iconColor: 'text-primary',
      delay: 'delay-200',
    },
    {
      icon: Users,
      label: 'Active Providers',
      value: String(s.providerCount),
      trend: `${s.providerCountPending} pending review`,
      up: s.providerCountPending === 0,
      surface: 'bg-surface-violet',
      iconColor: 'text-violet',
      delay: 'delay-300',
    },
    {
      icon: AlertCircle,
      label: 'Active Disputes',
      value: String(s.disputeCountOpen),
      trend: `${s.disputeCountUrgent} require attention`,
      up: s.disputeCountUrgent === 0,
      surface: 'bg-surface-coral',
      iconColor: 'text-coral',
      delay: 'delay-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/50 px-4 md:px-6 lg:px-[72px] py-8 lg:py-10 animate-fade-up">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 label-pill bg-surface-teal text-primary mb-4">
              <Activity size={11} />
              Admin
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-1">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground font-medium">Jonesboro, AR • Platform Overview</p>
          </div>
          <Badge className="bg-surface-green text-status-green border-0 px-4 py-2 self-start sm:self-auto font-bold text-xs uppercase tracking-wider gap-2">
            <Activity size={12} />
            Operational
          </Badge>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
      <div className="max-w-7xl mx-auto">

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-16">
          {metrics.map(({ icon: Icon, label, value, trend, up, iconColor, delay }) => (
            <Card
              key={label}
              className={`p-3 sm:p-5 lg:p-6 animate-fade-up ${delay} relative group hover:border-primary/40 transition-colors`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center">
                  <Icon size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center gap-1">
                  {up
                    ? <TrendingUp size={12} className="text-status-green" />
                    : <TrendingDown size={12} className="text-coral" />}
                  <span className={`text-[10px] font-bold uppercase tracking-tighter ${up ? 'text-status-green' : 'text-coral'}`}>{up ? '+12%' : '-2%'}</span>
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
              <div className="text-3xl lg:text-4xl font-bold mb-1 chewy-regular">{value}</div>
              <p className="text-[11px] text-muted-foreground font-medium">{trend}</p>
            </Card>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-10 lg:mb-16">
          <Card className="p-6 animate-fade-up delay-300">
            <h2 className="text-lg font-bold mb-6 tracking-tight">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueTrend.length > 0 ? revenueTrend : [{ month: '-', revenue: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '0', border: '1px solid var(--border)', boxShadow: 'none', fontWeight: 'bold' }} 
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 animate-fade-up delay-400">
            <h2 className="text-lg font-bold mb-6 tracking-tight">Bookings by Category</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryBreakdown.length > 0 ? categoryBreakdown : [{ name: '-', bookings: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '0', border: '1px solid var(--border)', boxShadow: 'none', fontWeight: 'bold' }} 
                />
                <Bar dataKey="bookings" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Recent Activity ── */}
        <div className="grid grid-cols-1 gap-6 mb-10 lg:mb-16">
          <Card className="p-6 animate-fade-up delay-400">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Recent Activity</h2>
              <Link to="/admin/analytics">
                <Button variant="ghost" className="text-primary font-bold text-sm gap-1.5 px-0 hover:bg-transparent hover:underline">
                  View audit log <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {activity.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <Activity size={32} className="text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">No recent system events</p>
                </div>
              ) : (
                activity.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-4 bg-background border border-border/40 hover:border-border transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        a.status === 'urgent' ? 'bg-coral' : 
                        a.status === 'pending' ? 'bg-primary' : 
                        a.status === 'review' ? 'bg-amber-500' : 'bg-status-green'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-foreground truncate">{a.message}</p>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{a.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {statusBadge(a.status)}
                      <Link to={a.link ?? '#'}>
                        <Button variant="outline" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest border-border">Details</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 animate-fade-up delay-500">
          <Link to="/admin/providers">
            <Card className="p-6 h-full hover:border-violet/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-start mb-6">
                <Users size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-2">Review Providers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.providerCountPending} pending applications to review.</p>
            </Card>
          </Link>
          <Link to="/admin/disputes">
            <Card className="p-6 h-full hover:border-coral/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-start mb-6">
                <AlertCircle size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-2">Handle Disputes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.disputeCountUrgent} urgent cases require attention.</p>
            </Card>
          </Link>
          <Link to="/admin/listings">
            <Card className="p-6 h-full hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-start mb-6">
                <FileText size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-2">Moderate Content</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.listingCountFlagged} suspended listings to moderate.</p>
            </Card>
          </Link>
        </div>

      </div>
      </div>
    </div>
  );
}
