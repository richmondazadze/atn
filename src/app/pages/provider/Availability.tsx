import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Calendar } from '../../components/ui/calendar';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Clock, Info, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

type Day = typeof DAYS[number];
type DaySchedule = { enabled: boolean; start: string; end: string };

const DEFAULT_SCHEDULE: Record<Day, DaySchedule> = {
  Monday:    { enabled: true,  start: '09:00', end: '17:00' },
  Tuesday:   { enabled: true,  start: '09:00', end: '17:00' },
  Wednesday: { enabled: true,  start: '09:00', end: '17:00' },
  Thursday:  { enabled: true,  start: '09:00', end: '17:00' },
  Friday:    { enabled: true,  start: '09:00', end: '17:00' },
  Saturday:  { enabled: true,  start: '10:00', end: '15:00' },
  Sunday:    { enabled: false, start: '09:00', end: '17:00' },
};

export default function Availability() {
  const { user } = useAuth();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState(DEFAULT_SCHEDULE);
  const [bufferTime, setBufferTime] = useState('30');
  const [noticeHours, setNoticeHours] = useState('4');
  const [instantBooking, setInstantBooking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from('providers')
      .select('availability')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const avail = data?.availability as Record<string, unknown> | null;
        if (avail) {
          if (avail.weeklySchedule) setWeeklySchedule(avail.weeklySchedule as typeof DEFAULT_SCHEDULE);
          if (avail.blockedDates) setBlockedDates((avail.blockedDates as string[]).map(d => new Date(d)));
          if (avail.bufferTime != null) setBufferTime(String(avail.bufferTime));
          if (avail.noticeHours != null) setNoticeHours(String(avail.noticeHours));
          if (avail.instantBooking != null) setInstantBooking(avail.instantBooking as boolean);
        }
        setLoaded(true);
      });
  }, [user.id]);

  function updateDay(day: Day, patch: Partial<DaySchedule>) {
    setWeeklySchedule(prev => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  if (!loaded) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-violet flex items-center justify-center shrink-0">
              <Clock size={20} className="text-violet" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Availability</h1>
              <p className="text-sm text-muted mt-0.5">Set your weekly hours and block specific dates</p>
            </div>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl w-full sm:w-auto"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              const { error } = await supabase.from('providers').update({
                availability: {
                  weeklySchedule,
                  blockedDates: blockedDates.map(d => d.toISOString()),
                  bufferTime: parseInt(bufferTime),
                  noticeHours: parseInt(noticeHours),
                  instantBooking,
                },
              }).eq('id', user.id);
              setSaving(false);
              if (error) { toast.error('Failed to save availability'); return; }
              toast.success('Availability saved');
            }}
          >
            <Save size={15} className="mr-2" />
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Weekly Schedule */}
            <div className="space-y-4">
              <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 animate-fade-up delay-100">
                <h2 className="text-lg font-semibold mb-1">Weekly Schedule</h2>
                <p className="text-sm text-muted mb-5">Set your regular availability for each day of the week</p>

                <div className="space-y-2.5">
                  {DAYS.map(day => {
                    const schedule = weeklySchedule[day];
                    return (
                      <div
                        key={day}
                        className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${
                          schedule.enabled
                            ? 'border-primary bg-surface-teal/30'
                            : 'border-border bg-secondary/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 w-28 shrink-0">
                          <Switch
                            checked={schedule.enabled}
                            onCheckedChange={checked => updateDay(day, { enabled: checked })}
                            aria-label={`Enable ${day}`}
                          />
                          <Label
                            className={`font-semibold text-sm cursor-pointer ${
                              schedule.enabled ? 'text-foreground' : 'text-muted'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </Label>
                        </div>

                        {schedule.enabled ? (
                          <div className="flex items-center gap-2 flex-1 flex-wrap">
                            <Select value={schedule.start} onValueChange={v => updateDay(day, { start: v })}>
                              <SelectTrigger className="h-8 text-xs flex-1 min-w-[80px] rounded-lg border-border focus:border-primary focus:ring-primary/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <span className="text-muted text-xs shrink-0 font-medium">to</span>
                            <Select value={schedule.end} onValueChange={v => updateDay(day, { end: v })}>
                              <SelectTrigger className="h-8 text-xs flex-1 min-w-[80px] rounded-lg border-border focus:border-primary focus:ring-primary/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <span className="text-xs text-muted italic">Unavailable</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="rounded-2xl border-primary/20 bg-surface-teal p-5 animate-fade-up delay-200">
                <div className="flex gap-3">
                  <Info size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-primary">Booking Window</h3>
                    <p className="text-sm text-muted">
                      Customers can book up to 30 days in advance. You'll receive booking requests at least {noticeHours} hours before the service time.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Blocked Dates */}
            <div className="space-y-4 animate-fade-up delay-200">
              <Card className="card-lift rounded-2xl border-border p-5 lg:p-6">
                <h2 className="text-lg font-semibold mb-1">Block Specific Dates</h2>
                <p className="text-sm text-muted mb-5">Select dates when you're unavailable (vacations, holidays, etc.)</p>

                <Calendar
                  mode="multiple"
                  selected={blockedDates}
                  onSelect={dates => setBlockedDates(dates || [])}
                  className="border border-border rounded-xl p-3 w-full [&_.rdp-day_selected]:bg-coral [&_.rdp-day_selected]:text-white"
                  disabled={date => date < new Date()}
                />

                {blockedDates.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      Blocked Dates
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-coral text-coral text-xs font-bold">
                        {blockedDates.length}
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[...blockedDates].sort((a, b) => a.getTime() - b.getTime()).map((date, i) => (
                        <Badge
                          key={i}
                          className="bg-surface-coral text-coral border-0 text-xs rounded-full gap-1.5 pl-2.5 pr-1.5 py-1 font-medium cursor-pointer hover:bg-coral/20 transition-colors"
                          onClick={() => setBlockedDates(prev => prev.filter((_, idx) => idx !== i))}
                        >
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          <X size={11} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Advanced Settings */}
          <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 mt-6 lg:mt-8 animate-fade-up delay-300">
            <h2 className="text-lg font-semibold mb-5">Advanced Settings</h2>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">Buffer Time Between Bookings</p>
                  <p className="text-xs text-muted mt-0.5">Add time between appointments for travel or preparation</p>
                </div>
                <Select value={bufferTime} onValueChange={setBufferTime}>
                  <SelectTrigger className="w-full sm:w-44 rounded-xl border-border focus:border-primary focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-border">
                <div>
                  <p className="font-semibold text-sm">Minimum Notice Period</p>
                  <p className="text-xs text-muted mt-0.5">Require bookings to be made at least this far in advance</p>
                </div>
                <Select value={noticeHours} onValueChange={setNoticeHours}>
                  <SelectTrigger className="w-full sm:w-44 rounded-xl border-border focus:border-primary focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-border">
                <div>
                  <p className="font-semibold text-sm">Instant Booking</p>
                  <p className="text-xs text-muted mt-0.5">Allow customers to book without your approval</p>
                </div>
                <Switch
                  checked={instantBooking}
                  onCheckedChange={setInstantBooking}
                  aria-label="Instant booking"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
