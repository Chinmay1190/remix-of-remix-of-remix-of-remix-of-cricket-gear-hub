import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, ArrowLeft, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ShippingInfo() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl">SHIPPING INFO</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h2 className="font-display text-xl">DELIVERY OPTIONS</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Standard Shipping — 4-6 business days</p>
                  <p className="text-sm text-muted-foreground">Free on orders above ₹2,000 · ₹199 for orders below ₹2,000</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Express Shipping — 2-3 business days</p>
                  <p className="text-sm text-muted-foreground">₹399 flat rate · Available for select pin codes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="font-display text-xl">COVERAGE</h2>
            </div>
            <ul className="space-y-3">
              {[
                'We ship across all Indian states and union territories.',
                'Metro cities (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad) get priority delivery.',
                'Remote areas may take an additional 2-3 business days.',
                'Orders placed before 2 PM IST are dispatched the same day.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <span className="text-muted-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-xl mb-4">PACKAGING</h2>
            <p className="text-muted-foreground text-sm">
              All cricket equipment is carefully packed in protective packaging to ensure safe delivery. Bats are wrapped in bubble wrap and shipped in reinforced boxes. Fragile items like helmets have additional padding.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
