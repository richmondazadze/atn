import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { TrendingUp, Users, DollarSign, Calendar, Star } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const TOOLTIP_STYLE = { borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px' };
const PERIOD_DAYS: Record<string, number> = { '7': 7, '30': 30, '90': 90, '365': 365 };

export default function Analytics() {
  const [periodKey, setPeriodKey] = useState('30');
  const periodDays = PERIOD_DAYS[periodKey] ?? 30;
  const { data, loading } = useAnalytics(periodDays);

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  const d = data!;
  const metrics = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${d.totalRevenue.toLocaleString()}`, trend: 'Period' },
    { icon: Calendar, label: 'Total Bookings', value: d.totalBookings.toLocaleString(), trend: 'Completed' },
    { icon: Users, label: 'Active Users', value: d.activeUsers.toLocaleString(), trend: 'In period' },
    { icon: Star, label: 'Avg Rating', value: d.avgRating, trend: 'All reviews' },
  ];
  const revenueData = d.revenueData.length > 0 ? d.revenueData : [{ month: '-', revenue: 0, bookings: 0 }];
  const categoryBreakdown = d.categoryBreakdown.length > 0 ? d.categoryBreakdown : [{ name: 'No data', value: 1, color: '#94A3B8' }];
  const userGrowth = d.userGrowth.length > 0 ? d.userGrowth : [{ month: '-', providers: 0, customers: 0 }];
  const topProviders = d.topProviders;

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Analytics</h1>
            <p className="text-sm text-muted">Platform performance and insights</p>
          </div>
          <Select value={periodKey} onValueChange={setPeriodKey}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
          {metrics.map(({ icon: Icon, label, value, trend }, i) => (
            <Card key={label} className="border-border p-5 animate-fade-up" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon size={16} className="text-primary" />
                  <span className="text-xs text-muted">{label}</span>
                </div>
                <TrendingUp size={14} className="text-primary" />
              </div>
              <div className="text-2xl lg:text-[32px] font-semibold mb-0.5 chewy-regular">{value}</div>
              <p className="text-xs text-primary">{trend} vs last period</p>
            </Card>
          ))}
        </div>

        {/* Revenue & Bookings Trend */}
        <Card className="border-border p-5 lg:p-6 mb-5 animate-fade-up delay-300">
          <h2 className="text-lg font-medium mb-5">Revenue & Booking Trends</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#1A6B6B" strokeWidth={2} name="Revenue ($)" dot={{ r: 3, fill: '#1A6B6B' }} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#D4A853" strokeWidth={2} name="Bookings" dot={{ r: 3, fill: '#D4A853' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Category Breakdown */}
          <Card className="border-border p-5 lg:p-6 animate-fade-up delay-400">
            <h2 className="text-lg font-medium mb-5">Bookings by Category</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* User Growth */}
          <Card className="border-border p-5 lg:p-6 animate-fade-up delay-500">
            <h2 className="text-lg font-medium mb-5">User Growth</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="providers" fill="#1A6B6B" name="Providers" radius={[2, 2, 0, 0]} />
                <Bar dataKey="customers" fill="#D4A853" name="Customers" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="border-border p-5 lg:p-6 animate-fade-up delay-500">
          <h2 className="text-lg font-medium mb-5">Top Performing Providers</h2>
          <div className="space-y-3">
            {topProviders.map((provider, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-background rounded transition-colors hover:">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0 chewy-regular">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{provider.name}</p>
                    <p className="text-xs text-muted">{provider.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-8 text-sm pl-10 sm:pl-0">
                  <div>
                    <p className="text-xs text-muted">Bookings</p>
                    <p className="font-medium chewy-regular">{provider.bookings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Revenue</p>
                    <p className="font-medium chewy-regular">{provider.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Rating</p>
                    <p className="font-medium flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="chewy-regular">{provider.rating}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
