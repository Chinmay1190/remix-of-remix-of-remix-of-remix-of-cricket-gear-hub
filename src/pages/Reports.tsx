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
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
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
  const { isAdmin, isLoading: adminLoading } = useAdmin();
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

  // Redirect non-admins
  useEffect(() => {
    if (authLoading || adminLoading) return;
    if (!user) navigate('/auth');
  }, [authLoading, adminLoading, user, navigate]);

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
    if (!isAdmin) return;

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
  }, [isAdmin, startDate, endDate]);

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

  if (authLoading || adminLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-10 max-w-md text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-display mb-2">Admins Only</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to view Reports & Analytics.
          </p>
          <Button onClick={() => navigate('/')} variant="outline">Go Home</Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="font-display text-4xl mb-2">REPORTS & ANALYTICS</h1>
              <p className="text-muted-foreground">{label}</p>
            </div>
            <Button onClick={handleDownload} disabled={isDownloading || isLoadingData} className="gap-2">
              <Download className="h-4 w-4" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>

          {/* Period selector */}
          <Card className="p-6 mb-6">
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="range">From - To</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="mt-4">
                <DateField label="Pick a date" date={selectedDate} onChange={setSelectedDate} />
              </TabsContent>
              <TabsContent value="weekly" className="mt-4">
                <DateField label="Pick any day in the week" date={selectedDate} onChange={setSelectedDate} />
              </TabsContent>
              <TabsContent value="monthly" className="mt-4">
                <DateField label="Pick any day in the month" date={selectedDate} onChange={setSelectedDate} />
              </TabsContent>
              <TabsContent value="quarterly" className="mt-4">
                <DateField label="Pick any day in the quarter" date={selectedDate} onChange={setSelectedDate} />
              </TabsContent>
              <TabsContent value="range" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateField label="From" date={fromDate} onChange={setFromDate} />
                  <DateField label="To" date={toDate} onChange={setToDate} />
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={ShoppingBag} label="Total Orders" value={String(totals.orders)} />
            <StatCard icon={Package} label="Items Sold" value={String(totals.units)} />
            <StatCard icon={IndianRupee} label="Total Revenue" value={formatINR(totals.revenue)} />
            <StatCard icon={TrendingUp} label="Avg Order Value" value={formatINR(totals.avgOrderValue)} />
          </div>

          {/* Category breakdown */}
          <Card className="p-6 mb-6">
            <h2 className="font-display text-2xl mb-4">CATEGORY-WISE BREAKDOWN</h2>
            {categoryRows.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No sales in this period.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryRows.map((c) => (
                    <TableRow key={c.category}>
                      <TableCell className="font-medium">{c.category}</TableCell>
                      <TableCell className="text-center">{c.units}</TableCell>
                      <TableCell className="text-right font-semibold">{formatINR(c.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Orders table */}
          <Card className="p-6">
            <h2 className="font-display text-2xl mb-4">ORDERS IN PERIOD</h2>
            {isLoadingData ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : reportRows.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No orders in this period.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportRows.map((r) => (
                    <TableRow key={r.order_number}>
                      <TableCell className="font-mono text-xs">{r.order_number}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.customer}</TableCell>
                      <TableCell className="text-center">{r.items}</TableCell>
                      <TableCell className="text-right font-semibold">{formatINR(r.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </motion.div>

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
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
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
