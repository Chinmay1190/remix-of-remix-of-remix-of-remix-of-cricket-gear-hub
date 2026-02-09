import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  shipping_name: string;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'bg-yellow-500' },
  confirmed: { icon: CheckCircle2, label: 'Confirmed', color: 'bg-blue-500' },
  shipped: { icon: Truck, label: 'Shipped', color: 'bg-purple-500' },
  delivered: { icon: Package, label: 'Delivered', color: 'bg-green-500' },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-display text-4xl mb-4">YOUR ORDERS</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to view your order history
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">Sign In to View Orders</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="font-display text-4xl mb-4">NO ORDERS YET</h1>
            <p className="text-muted-foreground mb-8">
              Start shopping to see your orders here
            </p>
            <Button size="lg" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">MY ORDERS</h1>
            <p className="text-muted-foreground">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/order/${order.id}`}
                  className="block bg-card rounded-2xl border border-border p-6 hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white', status.color)}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <Badge variant="secondary">{status.label}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ship to: {order.shipping_name}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
