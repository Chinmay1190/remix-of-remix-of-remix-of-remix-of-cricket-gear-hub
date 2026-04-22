import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Package, Clock, CheckCircle2, Truck, PlayCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TrackedOrder {
  id: string;
  order_number: string;
  status: string;
  shipping_name: string;
  shipping_city: string;
  shipping_state: string;
  total: number;
  created_at: string;
}

const statusFlow = ['confirmed', 'processing', 'shipped', 'delivered'] as const;

const statusSteps = [
  { key: 'confirmed', icon: CheckCircle2, label: 'Confirmed', desc: 'Order confirmed by seller' },
  { key: 'processing', icon: Clock, label: 'Processing', desc: 'Being packed at warehouse' },
  { key: 'shipped', icon: Truck, label: 'Shipped', desc: 'On the way to you' },
  { key: 'delivered', icon: Package, label: 'Delivered', desc: 'Successfully delivered' },
];

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [simulatedStatus, setSimulatedStatus] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Please enter an order number');
      return;
    }
    if (!user) {
      toast.error('Please sign in to track your order');
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, shipping_name, shipping_city, shipping_state, total, created_at')
        .eq('order_number', orderNumber.trim().toUpperCase())
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error('Order not found. Please check the order number.');
        setOrder(null);
        setSimulatedStatus(null);
        return;
      }

      setOrder(data);
      // Initialize simulated status to current order status (or confirmed if pending/unknown)
      const idx = statusFlow.indexOf(data.status as typeof statusFlow[number]);
      setSimulatedStatus(idx >= 0 ? data.status : 'confirmed');
      toast.success('Order found!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to track order');
    } finally {
      setIsSearching(false);
    }
  };

  const currentIdx = simulatedStatus ? statusFlow.indexOf(simulatedStatus as typeof statusFlow[number]) : -1;
  const isFinalStep = currentIdx === statusFlow.length - 1;

  const handleSimulate = () => {
    if (!simulatedStatus) return;
    if (isFinalStep) {
      toast.info('Order already delivered!');
      return;
    }
    const next = statusFlow[currentIdx + 1];
    setSimulatedStatus(next);
    const stepLabel = statusSteps.find((s) => s.key === next)?.label;
    toast.success(`Order status updated to ${stepLabel}`);
  };

  const handleReset = () => {
    setSimulatedStatus('confirmed');
    toast.info('Simulation reset to Confirmed');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl">TRACK ORDER</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-8 text-center"
        >
          <Package className="h-16 w-16 mx-auto text-primary mb-6" />
          <h2 className="font-display text-2xl mb-2">TRACK YOUR ORDER</h2>
          <p className="text-muted-foreground mb-6">
            Enter your order number to check the delivery status
          </p>
          <form onSubmit={handleTrack} className="space-y-4">
            <Input
              placeholder="Enter Order Number (e.g., CRK-20250101-ABC123)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="text-center"
            />
            <Button type="submit" className="w-full gap-2" disabled={isSearching}>
              <Search className="h-4 w-4" />
              {isSearching ? 'Searching...' : 'Track Order'}
            </Button>
          </form>
          {user && (
            <p className="text-sm text-muted-foreground mt-4">
              Or <Link to="/orders" className="text-primary hover:underline">view all your orders</Link>
            </p>
          )}
          {!user && (
            <p className="text-sm text-muted-foreground mt-4">
              <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to track your orders
            </p>
          )}
        </motion.div>

        <AnimatePresence>
          {order && simulatedStatus && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card rounded-2xl border border-border p-6 md:p-8 mt-6"
            >
              {/* Order summary */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div className="text-left">
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">Order</p>
                  <p className="font-display text-xl">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.shipping_name} · {order.shipping_city}, {order.shipping_state}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="capitalize mb-2">
                    {statusSteps.find((s) => s.key === simulatedStatus)?.label || simulatedStatus}
                  </Badge>
                  <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                </div>
              </div>

              {/* Vertical timeline */}
              <div className="text-left space-y-0 mb-8">
                {statusSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const reached = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const isLast = idx === statusSteps.length - 1;
                  return (
                    <div key={step.key} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={{ scale: isCurrent ? [1, 1.15, 1] : 1 }}
                          transition={{ duration: 0.6, repeat: isCurrent ? Infinity : 0, repeatDelay: 1.2 }}
                          className={cn(
                            'w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors',
                            reached
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted text-muted-foreground border-border'
                          )}
                        >
                          <StepIcon className="h-5 w-5" />
                        </motion.div>
                        {!isLast && (
                          <div
                            className={cn(
                              'w-0.5 flex-1 min-h-[40px] my-1 transition-colors',
                              idx < currentIdx ? 'bg-primary' : 'bg-border'
                            )}
                          />
                        )}
                      </div>
                      <div className="pb-6 pt-1">
                        <p className={cn('font-semibold', reached ? 'text-foreground' : 'text-muted-foreground')}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                        {isCurrent && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-primary mt-1 font-medium"
                          >
                            ● Current status
                          </motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulate controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSimulate}
                  disabled={isFinalStep}
                  size="lg"
                  className="flex-1 gap-2"
                >
                  <PlayCircle className="h-5 w-5" />
                  {isFinalStep
                    ? 'Delivered ✓'
                    : `Simulate: Move to ${statusSteps[currentIdx + 1]?.label}`}
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                This is a demo simulation — clicking advances the order through Confirmed → Processing → Shipped → Delivered.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
