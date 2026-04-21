import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  Download,
  IndianRupee,
  Package,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { downloadElementAsPdf } from '@/lib/pdf';
import { PrintableReport, ReportRow, CategoryRow } from '@/components/reports/PrintableReport';
import { products as catalogProducts } from '@/data/products';

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'range';

interface OrderRecord {
  id: string;
  order_number: string;
  created_at: string;
  shipping_name: string;
  total: number;
}

interface OrderItemRecord {
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

const productCategoryMap = new Map(catalogProducts.map((p) => [p.id, p.category]));
const categoryDisplay: Record<string, string> = {
  bats: 'Cricket Bats',
  gloves: 'Batting Gloves',
  balls: 'Cricket Balls',
  helmets: 'Helmets',
  shoes: 'Cricket Shoes',
  bags: 'Kit Bags',
  clothing: 'Clothing',
  pads: 'Pads & Guards',
  other: 'Other',
};

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function Reports() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  const [period, setPeriod] = useState<Period>('daily');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(new Date());

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [items, setItems] = useState<OrderItemRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/auth');
  }, [authLoading, user, navigate]);

  // Compute date window from period + selections
  const { startDate, endDate, label } = useMemo(() => {
    let s: Date;
    let e: Date;
    let l: string;
    switch (period) {
      case 'daily':
        s = startOfDay(selectedDate);
        e = endOfDay(selectedDate);
        l = `Daily Report — ${format(selectedDate, 'PPP')}`;
        break;
      case 'weekly':
        s = startOfWeek(selectedDate, { weekStartsOn: 1 });
        e = endOfWeek(selectedDate, { weekStartsOn: 1 });
        l = `Weekly Report — ${format(s, 'PP')} to ${format(e, 'PP')}`;
        break;
      case 'monthly':
        s = startOfMonth(selectedDate);
        e = endOfMonth(selectedDate);
        l = `Monthly Report — ${format(selectedDate, 'MMMM yyyy')}`;
        break;
      case 'quarterly':
        s = startOfQuarter(selectedDate);
        e = endOfQuarter(selectedDate);
        l = `Quarterly Report — Q${Math.floor(selectedDate.getMonth() / 3) + 1} ${selectedDate.getFullYear()}`;
        break;
      case 'range':
      default:
        s = startOfDay(fromDate);
        e = endOfDay(toDate);
        l = `Custom Range — ${format(s, 'PP')} to ${format(e, 'PP')}`;
        break;
    }
    return { startDate: s, endDate: e, label: l };
  }, [period, selectedDate, fromDate, toDate]);

  // Fetch data when window changes
  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      setIsLoadingData(true);
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('id, order_number, created_at, shipping_name, total')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (ordersErr) {
        toast.error('Failed to load orders');
        console.error(ordersErr);
        setOrders([]);
        setItems([]);
        setIsLoadingData(false);
        return;
      }

      const orderList = ordersData ?? [];
      setOrders(orderList);

      if (orderList.length === 0) {
        setItems([]);
        setIsLoadingData(false);
        return;
      }

      const orderIds = orderList.map((o) => o.id);
      const { data: itemsData, error: itemsErr } = await supabase
        .from('order_items')
        .select('order_id, product_id, product_name, quantity, price')
        .in('order_id', orderIds);

      if (itemsErr) {
        console.error(itemsErr);
        setItems([]);
      } else {
        setItems(itemsData ?? []);
      }
      setIsLoadingData(false);
    };

    fetch();
  }, [user, startDate, endDate]);

  // Aggregations
  const totals = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const units = items.reduce((s, i) => s + i.quantity, 0);
    return {
      orders: orders.length,
      units,
      revenue,
      avgOrderValue: orders.length > 0 ? revenue / orders.length : 0,
    };
  }, [orders, items]);

  const categoryRows: CategoryRow[] = useMemo(() => {
    const map = new Map<string, { units: number; revenue: number }>();
    items.forEach((it) => {
      const slug = productCategoryMap.get(it.product_id) ?? 'other';
      const key = categoryDisplay[slug] ?? slug;
      const cur = map.get(key) ?? { units: 0, revenue: 0 };
      cur.units += it.quantity;
      cur.revenue += Number(it.price) * it.quantity;
      map.set(key, cur);
    });
    return Array.from(map.entries())
      .map(([category, v]) => ({ category, ...v }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [items]);

  const reportRows: ReportRow[] = useMemo(() => {
    const itemsByOrder = new Map<string, number>();
    items.forEach((it) => {
      itemsByOrder.set(it.order_id, (itemsByOrder.get(it.order_id) ?? 0) + it.quantity);
    });
    return orders.map((o) => ({
      order_number: o.order_number,
      date: format(new Date(o.created_at), 'dd MMM yyyy'),
      customer: o.shipping_name,
      items: itemsByOrder.get(o.id) ?? 0,
      total: Number(o.total),
    }));
  }, [orders, items]);

  // Time-series for chart (revenue per day in window)
  const timeSeries = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const day = format(new Date(o.created_at), 'dd MMM');
      map.set(day, (map.get(day) ?? 0) + Number(o.total));
    });
    // Preserve chronological order
    const entries = Array.from(map.entries()).reverse();
    return entries.map(([date, revenue]) => ({ date, revenue }));
  }, [orders]);

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#ef4444'];

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    const container = reportRef.current.parentElement as HTMLElement | null;
    const prevPos = container?.style.position;
    const prevLeft = container?.style.left;
    if (container) {
      container.style.position = 'absolute';
      container.style.left = '-99999px';
      container.style.top = '0';
      container.style.display = 'block';
    }
    try {
      const filename = `Report-${period}-${format(startDate, 'yyyy-MM-dd')}.pdf`;
      await downloadElementAsPdf(reportRef.current, filename);
      toast.success('Report downloaded');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate report PDF');
    } finally {
      if (container) {
        container.style.position = prevPos ?? '';
        container.style.left = prevLeft ?? '';
        container.style.top = '';
        container.style.display = '';
      }
      setIsDownloading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-10 max-w-md text-center">
          <h1 className="text-2xl font-display mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view Reports & Analytics.
          </p>
          <Button onClick={() => navigate('/auth')} variant="outline">Sign In</Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-background" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="container mx-auto px-4 max-w-6xl relative py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-between gap-6 flex-wrap"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Live Analytics
              </div>
              <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-none mb-3">
                REPORTS &<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ANALYTICS
                </span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl">{label}</p>
            </div>
            <Button
              onClick={handleDownload}
              disabled={isDownloading || isLoadingData}
              size="lg"
              className="gap-2 shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Generating PDF...' : 'Export PDF'}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-6 relative">
        {/* Period selector — pill style */}
        <Card className="p-5 md:p-6 mb-6 shadow-xl border-border/60 backdrop-blur-sm bg-card/95">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto p-1 bg-muted/60">
              {[
                { v: 'daily', l: 'Daily' },
                { v: 'weekly', l: 'Weekly' },
                { v: 'monthly', l: 'Monthly' },
                { v: 'quarterly', l: 'Quarterly' },
                { v: 'range', l: 'From — To' },
              ].map((t) => (
                <TabsTrigger
                  key={t.v}
                  value={t.v}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary font-semibold py-2.5 transition-all"
                >
                  {t.l}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="daily" className="mt-5">
              <DateField label="Pick a date" date={selectedDate} onChange={setSelectedDate} />
            </TabsContent>
            <TabsContent value="weekly" className="mt-5">
              <DateField label="Pick any day in the week" date={selectedDate} onChange={setSelectedDate} />
            </TabsContent>
            <TabsContent value="monthly" className="mt-5">
              <DateField label="Pick any day in the month" date={selectedDate} onChange={setSelectedDate} />
            </TabsContent>
            <TabsContent value="quarterly" className="mt-5">
              <DateField label="Pick any day in the quarter" date={selectedDate} onChange={setSelectedDate} />
            </TabsContent>
            <TabsContent value="range" className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateField label="From" date={fromDate} onChange={setFromDate} />
                <DateField label="To" date={toDate} onChange={setToDate} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Stat cards — gradient accent */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={ShoppingBag} label="Total Orders" value={String(totals.orders)} accent="from-blue-500/20 to-cyan-500/10" />
          <StatCard icon={Package} label="Items Sold" value={String(totals.units)} accent="from-amber-500/20 to-orange-500/10" />
          <StatCard icon={IndianRupee} label="Revenue" value={formatINR(totals.revenue)} accent="from-emerald-500/20 to-teal-500/10" />
          <StatCard icon={TrendingUp} label="Avg Order" value={formatINR(totals.avgOrderValue)} accent="from-violet-500/20 to-fuchsia-500/10" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Revenue trend */}
          <Card className="p-6 lg:col-span-2 border-border/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl tracking-wide">REVENUE TREND</h2>
                <p className="text-xs text-muted-foreground mt-1">Daily revenue across selected period</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
            {timeSeries.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                No data to chart
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [formatINR(v), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Category pie */}
          <Card className="p-6 border-border/60">
            <h2 className="font-display text-xl tracking-wide mb-1">CATEGORIES</h2>
            <p className="text-xs text-muted-foreground mb-4">Revenue share</p>
            {categoryRows.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                No data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryRows}
                    dataKey="revenue"
                    nameKey="category"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {categoryRows.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => formatINR(v)}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Category breakdown */}
        <Card className="p-6 mb-6 border-border/60 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl tracking-wide">CATEGORY-WISE BREAKDOWN</h2>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{categoryRows.length} categories</span>
          </div>
          {categoryRows.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">No sales in this period.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="uppercase text-xs tracking-wider">Category</TableHead>
                  <TableHead className="text-center uppercase text-xs tracking-wider">Units Sold</TableHead>
                  <TableHead className="text-right uppercase text-xs tracking-wider">Revenue</TableHead>
                  <TableHead className="text-right uppercase text-xs tracking-wider w-32">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryRows.map((c, i) => {
                  const share = totals.revenue > 0 ? (c.revenue / totals.revenue) * 100 : 0;
                  return (
                    <TableRow key={c.category} className="border-border/40">
                      <TableCell className="font-semibold flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        {c.category}
                      </TableCell>
                      <TableCell className="text-center">{c.units}</TableCell>
                      <TableCell className="text-right font-bold">{formatINR(c.revenue)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground w-10 text-right">{share.toFixed(0)}%</span>
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${share}%`, background: PIE_COLORS[i % PIE_COLORS.length] }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Orders table */}
        <Card className="p-6 border-border/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl tracking-wide">ORDERS IN PERIOD</h2>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{reportRows.length} orders</span>
          </div>
          {isLoadingData ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : reportRows.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">No orders in this period.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="uppercase text-xs tracking-wider">Order No.</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider">Date</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider">Customer</TableHead>
                  <TableHead className="text-center uppercase text-xs tracking-wider">Items</TableHead>
                  <TableHead className="text-right uppercase text-xs tracking-wider">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportRows.map((r) => (
                  <TableRow key={r.order_number} className="border-border/40">
                    <TableCell className="font-mono text-xs text-primary">{r.order_number}</TableCell>
                    <TableCell className="text-muted-foreground">{r.date}</TableCell>
                    <TableCell className="font-medium">{r.customer}</TableCell>
                    <TableCell className="text-center">{r.items}</TableCell>
                    <TableCell className="text-right font-bold">{formatINR(r.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Hidden printable report */}
        <div className="hidden">
          <PrintableReport
            ref={reportRef}
            title={periodTitle(period)}
            subtitle={label}
            generatedAt={format(new Date(), 'PPpp')}
            rows={reportRows}
            categoryRows={categoryRows}
            totals={totals}
          />
        </div>
      </div>
    </main>
  );
}

function periodTitle(p: Period): string {
  switch (p) {
    case 'daily': return 'DAILY SALES REPORT';
    case 'weekly': return 'WEEKLY SALES REPORT';
    case 'monthly': return 'MONTHLY SALES REPORT';
    case 'quarterly': return 'QUARTERLY SALES REPORT';
    case 'range': return 'CUSTOM RANGE REPORT';
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card className={cn('p-5 relative overflow-hidden border-border/60 group hover:shadow-lg transition-shadow')}>
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-100 transition-opacity', accent)} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground">{label}</span>
          <div className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm">
            <Icon className="h-3.5 w-3.5 text-foreground" />
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-display font-bold tracking-tight">{value}</div>
      </div>
    </Card>
  );
}

function DateField({
  label,
  date,
  onChange,
}: {
  label: string;
  date: Date;
  onChange: (d: Date) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-start text-left font-normal gap-2', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="h-4 w-4" />
            {date ? format(date, 'PPP') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onChange(d)}
            initialFocus
            className={cn('p-3 pointer-events-auto')}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
