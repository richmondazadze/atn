import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { TrendingUp, Users, DollarSign, Calendar, Star } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const revenueData = [
  { month: 'Sep', revenue: 10200, bookings: 187 },
  { month: 'Oct', revenue: 12400, bookings: 221 },
  { month: 'Nov', revenue: 15200, bookings: 268 },
  { month: 'Dec', revenue: 18900, bookings: 312 },
  { month: 'Jan', revenue: 21300, bookings: 351 },
  { month: 'Feb', revenue: 24100, bookings: 398 },
  { month: 'Mar', revenue: 28500, bookings: 441 },
];

const categoryBreakdown = [
  { name: 'Cleaning', value: 234, color: '#7BC950' },
  { name: 'Hair & Braiding', value: 189, color: '#A0CCDA' },
  { name: 'Tutoring', value: 156, color: '#9CFFD9' },
  { name: 'Nails & Beauty', value: 142, color: '#B6EFD4' },
  { name: 'Home Repair', value: 98, color: '#7CE577' },
  { name: 'Other', value: 62, color: '#ccc' },
];

const userGrowth = [
  { month: 'Sep', providers: 98, customers: 542 },
  { month: 'Oct', providers: 107, customers: 634 },
  { month: 'Nov', providers: 118, customers: 721 },
  { month: 'Dec', providers: 126, customers: 809 },
  { month: 'Jan', providers: 134, customers: 923 },
  { month: 'Feb', providers: 139, customers: 1038 },
  { month: 'Mar', providers: 142, customers: 1156 },
];

const TOP_PROVIDERS = [
  { name: 'Tasha Miles', category: 'Hair & Braiding', bookings: 89, revenue: '$14,240', rating: 5.0 },
  { name: 'Alana Brooks', category: 'Tutoring', bookings: 103, revenue: '$3,605', rating: 5.0 },
  { name: 'Monica Hayes', category: 'Wellness', bookings: 71, revenue: '$3,550', rating: 4.9 },
  { name: 'Deja Johnson', category: 'Cleaning', bookings: 47, revenue: '$3,525', rating: 4.9 },
];

const TOOLTIP_STYLE = { borderRadius: '4px', border: '1px solid hsl(var(--border))', fontSize: '12px' };

export default function Analytics() {
  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Analytics</h1>
            <p className="text-sm text-muted">Platform performance and insights</p>
          </div>
          <Select defaultValue="30">
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
          {[
            { icon: DollarSign, label: 'Total Revenue', value: '$130.5K', trend: '+24.3%' },
            { icon: Calendar, label: 'Total Bookings', value: '2,068', trend: '+18.7%' },
            { icon: Users, label: 'Active Users', value: '1,298', trend: '+12.4%' },
            { icon: Star, label: 'Avg Rating', value: '4.82', trend: '+0.08' },
          ].map(({ icon: Icon, label, value, trend }) => (
            <Card key={label} className="border-border p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon size={16} className="text-primary" />
                  <span className="text-xs text-muted">{label}</span>
                </div>
                <TrendingUp size={14} className="text-primary" />
              </div>
              <div className="text-2xl lg:text-[32px] font-semibold mb-0.5">{value}</div>
              <p className="text-xs text-primary">{trend} vs last period</p>
            </Card>
          ))}
        </div>

        {/* Revenue & Bookings Trend */}
        <Card className="border-border p-5 lg:p-6 mb-5">
          <h2 className="text-lg font-medium mb-5">Revenue & Booking Trends</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#7BC950" strokeWidth={2} name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#A0CCDA" strokeWidth={2} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Category Breakdown */}
          <Card className="border-border p-5 lg:p-6">
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
          <Card className="border-border p-5 lg:p-6">
            <h2 className="text-lg font-medium mb-5">User Growth</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="providers" fill="#7BC950" name="Providers" />
                <Bar dataKey="customers" fill="#A0CCDA" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="border-border p-5 lg:p-6">
          <h2 className="text-lg font-medium mb-5">Top Performing Providers</h2>
          <div className="space-y-3">
            {TOP_PROVIDERS.map((provider, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-background rounded">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
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
                    <p className="font-medium">{provider.bookings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Revenue</p>
                    <p className="font-medium">{provider.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Rating</p>
                    <p className="font-medium flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {provider.rating}
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
