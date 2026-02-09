import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, Truck, Download, ArrowRight, PartyPopper, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-mobile';

export default function OrderSuccess() {
  const location = useLocation();
  const orderData = location.state?.orderData;
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <main className="min-h-screen py-16 relative overflow-hidden">
      {showConfetti && width && height && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#22c55e', '#f97316', '#eab308', '#3b82f6']}
        />
      )}

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Check className="h-16 w-16 text-white" strokeWidth={3} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <PartyPopper className="h-8 w-8 text-yellow-500" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-display text-4xl md:text-5xl mb-4">
              ORDER CONFIRMED!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for your purchase! 🎉
            </p>
            {orderData?.orderNumber && (
              <p className="text-lg">
                Order Number: <span className="font-bold text-primary">{orderData.orderNumber}</span>
              </p>
            )}
          </motion.div>

          {/* Order Summary Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-card rounded-2xl border border-border p-6 text-left"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Your order is being processed</h3>
                <p className="text-sm text-muted-foreground">
                  We'll send you a confirmation email shortly
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Estimated Delivery</span>
                </div>
                <p className="font-bold">
                  {estimatedDelivery.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {orderData?.total && (
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Order Total</span>
                  </div>
                  <p className="font-bold">{formatPrice(orderData.total)}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">Just now</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Processing</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Shipped</p>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            {orderData?.orderId && (
              <Button size="lg" asChild className="gap-2">
                <Link to={`/order/${orderData.orderId}`}>
                  <Package className="h-4 w-4" />
                  Track Order
                </Link>
              </Button>
            )}
            
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link to="/products">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Support Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            Need help? Contact our support at{' '}
            <a href="mailto:support@cricketgear.com" className="text-primary hover:underline">
              support@cricketgear.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
