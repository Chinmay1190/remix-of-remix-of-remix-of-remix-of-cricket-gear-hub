import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/orders');
    } else {
      navigate('/auth');
    }
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl">TRACK ORDER</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-8 text-center">
          <Package className="h-16 w-16 mx-auto text-primary mb-6" />
          <h2 className="font-display text-2xl mb-2">TRACK YOUR ORDER</h2>
          <p className="text-muted-foreground mb-6">
            Enter your order number to check the delivery status
          </p>
          <form onSubmit={handleTrack} className="space-y-4">
            <Input
              placeholder="Enter Order Number (e.g., CRK-12345)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="text-center"
            />
            <Button type="submit" className="w-full gap-2">
              <Search className="h-4 w-4" />
              Track Order
            </Button>
          </form>
          {user && (
            <p className="text-sm text-muted-foreground mt-4">
              Or <Link to="/orders" className="text-primary hover:underline">view all your orders</Link>
            </p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
