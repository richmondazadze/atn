import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Users, FileText, DollarSign, AlertCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminStats } from '../../../hooks/useAdminStats';

function statusBadge(status: string) {
  if (status === 'pending') return <Badge className="bg-primary/20 text-primary border-0">Pending</Badge>;
  if (status === 'urgent') return <Badge variant="destructive">Urgent</Badge>;
  if (status === 'review') return <Badge className="bg-amber-100 text-amber-700 border-0">Review</Badge>;
  return <Badge className="bg-primary/10 text-primary border-0">Complete</Badge>;
}

export default function AdminOverview() {
  const { stats, activity, revenueTrend, categoryBreakdown, loading } = useAdminStats();

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );

  const s = stats!;
  const metrics = [
    { icon: Users, label: 'Active Providers', value: String(s.providerCount), trend: `${s.providerCountPending} pending review`, up: s.providerCountPending === 0 },
    { icon: FileText, label: 'Total Bookings', value: s.bookingCount.toLocaleString(), trend: 'All time', up: true },
    { icon: DollarSign, label: 'Revenue (MTD)', value: `$${s.revenueMtd.toLocaleString()}`, trend: 'This month', up: true },
    { icon: AlertCircle, label: 'Active Disputes', value: String(s.disputeCountOpen), trend: `${s.disputeCountUrgent} require attention`, up: s.disputeCountUrgent === 0 },
  ];

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Admin Dashboard</h1>
            <p className="text-sm text-muted">Jonesboro, AR marketplace overview</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-0 px-3 py-1.5 self-start sm:self-auto">
            <Activity size={13} className="mr-1.5" />
            All systems operational
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {metrics.map(({ icon: Icon, label, value, trend, up }) => (
            <Card key={label} className="border-border p-5 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-muted" />
                  <span className="text-sm text-muted">{label}</span>
                </div>
                {up ? <TrendingUp size={15} className="text-primary" /> : <TrendingDown size={15} className="text-destructive" />}
              </div>
              <div className="text-2xl lg:text-[32px] font-semibold mb-1">{value}</div>
              <p className={`text-sm ${up ? 'text-primary' : 'text-muted'}`}>{trend}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueTrend.length > 0 ? revenueTrend : [{ month: '-', revenue: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">Bookings by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryBreakdown.length > 0 ? categoryBreakdown : [{ name: '-', bookings: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid var(--border)' }} />
                <Bar dataKey="bookings" fill="var(--primary)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="border-border p-5 lg:p-6 mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium">Recent Activity</h2>
            <Link to="/admin/analytics">
              <Button variant="ghost" className="text-primary text-sm">View all</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {activity.length === 0 ? (
              <p className="text-sm text-muted py-4 text-center">No recent activity</p>
            ) : (
              activity.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-background rounded gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{a.message}</p>
                    <p className="text-xs text-muted">{a.time}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusBadge(a.status)}
                    <Link to={a.link ?? '#'}>
                      <Button variant="outline" size="sm" className="border-border text-xs">View</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <Link to="/admin/providers">
            <Card className="border-border p-5 lg:p-6 hover:border-primary transition-colors cursor-pointer">
              <Users size={22} className="text-primary mb-3" />
              <h3 className="font-medium mb-1">Review Providers</h3>
              <p className="text-sm text-muted">{s.providerCountPending} pending application{s.providerCountPending !== 1 ? 's' : ''}</p>
            </Card>
          </Link>
          <Link to="/admin/disputes">
            <Card className="border-border p-5 lg:p-6 hover:border-destructive transition-colors cursor-pointer">
              <AlertCircle size={22} className="text-destructive mb-3" />
              <h3 className="font-medium mb-1">Handle Disputes</h3>
              <p className="text-sm text-muted">{s.disputeCountUrgent} urgent case{s.disputeCountUrgent !== 1 ? 's' : ''} require attention</p>
            </Card>
          </Link>
          <Link to="/admin/listings">
            <Card className="border-border p-5 lg:p-6 hover:border-primary transition-colors cursor-pointer">
              <FileText size={22} className="text-primary mb-3" />
              <h3 className="font-medium mb-1">Moderate Listings</h3>
              <p className="text-sm text-muted">{s.listingCountFlagged} suspended listing{s.listingCountFlagged !== 1 ? 's' : ''} to review</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
