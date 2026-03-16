import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Users, FileText, DollarSign, AlertCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const revenueData = [
  { month: 'Oct', revenue: 12400 },
  { month: 'Nov', revenue: 15200 },
  { month: 'Dec', revenue: 18900 },
  { month: 'Jan', revenue: 21300 },
  { month: 'Feb', revenue: 24100 },
  { month: 'Mar', revenue: 28500 },
];

const categoryData = [
  { name: 'Cleaning', bookings: 234 },
  { name: 'Hair & Braiding', bookings: 189 },
  { name: 'Tutoring', bookings: 156 },
  { name: 'Nails & Beauty', bookings: 142 },
  { name: 'Home Repair', bookings: 98 },
];

const recentActivity = [
  { id: 1, message: 'New provider application: Sarah Williams', time: '5 min ago', status: 'pending' },
  { id: 2, message: 'Dispute #D-1043 requires review', time: '12 min ago', status: 'urgent' },
  { id: 3, message: 'Listing flagged for review: Deep House Cleaning', time: '28 min ago', status: 'review' },
  { id: 4, message: 'Monica Hayes updated profile', time: '1 hour ago', status: 'complete' },
];

function statusBadge(status: string) {
  if (status === 'pending') return <Badge className="bg-primary/20 text-primary border-0">Pending</Badge>;
  if (status === 'urgent') return <Badge variant="destructive">Urgent</Badge>;
  if (status === 'review') return <Badge className="bg-amber-100 text-amber-700 border-0">Review</Badge>;
  return <Badge className="bg-primary/10 text-primary border-0">Complete</Badge>;
}

export default function AdminOverview() {
  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {[
            { icon: Users, label: 'Active Providers', value: '142', trend: '+12 this month', up: true },
            { icon: FileText, label: 'Total Bookings', value: '3,287', trend: '+18% vs last month', up: true },
            { icon: DollarSign, label: 'Revenue (MTD)', value: '$28,540', trend: '+24% vs last month', up: true },
            { icon: AlertCircle, label: 'Active Disputes', value: '7', trend: '2 require attention', up: false },
          ].map(({ icon: Icon, label, value, trend, up }) => (
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="revenue" stroke="#7BC950" strokeWidth={2} dot={{ fill: '#7BC950', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">Bookings by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="bookings" fill="#7BC950" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-border p-5 lg:p-6 mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium">Recent Activity</h2>
            <Link to="/admin/analytics">
              <Button variant="ghost" className="text-primary text-sm">View all</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-background rounded gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.message}</p>
                  <p className="text-xs text-muted">{activity.time}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {statusBadge(activity.status)}
                  <Button variant="outline" size="sm" className="border-border text-xs" onClick={() => toast.info('Coming soon')}>
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <Link to="/admin/providers">
            <Card className="border-border p-5 lg:p-6 hover:border-primary transition-colors cursor-pointer">
              <Users size={22} className="text-primary mb-3" />
              <h3 className="font-medium mb-1">Review Providers</h3>
              <p className="text-sm text-muted">3 pending applications</p>
            </Card>
          </Link>
          <Link to="/admin/disputes">
            <Card className="border-border p-5 lg:p-6 hover:border-destructive transition-colors cursor-pointer">
              <AlertCircle size={22} className="text-destructive mb-3" />
              <h3 className="font-medium mb-1">Handle Disputes</h3>
              <p className="text-sm text-muted">2 urgent cases require attention</p>
            </Card>
          </Link>
          <Link to="/admin/listings">
            <Card className="border-border p-5 lg:p-6 hover:border-primary transition-colors cursor-pointer">
              <FileText size={22} className="text-primary mb-3" />
              <h3 className="font-medium mb-1">Moderate Listings</h3>
              <p className="text-sm text-muted">5 flagged listings to review</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
