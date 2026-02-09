import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ReturnsPolicy() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl">RETURNS POLICY</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="h-6 w-6 text-primary" />
              <h2 className="font-display text-xl">7-DAY RETURN POLICY</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 7 days of delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display text-lg mb-4 text-primary flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> ELIGIBLE FOR RETURN
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Unused items in original packaging</li>
                <li>• Items with all tags attached</li>
                <li>• Defective or damaged products</li>
                <li>• Wrong item received</li>
                <li>• Size exchanges (free of charge)</li>
              </ul>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display text-lg mb-4 text-destructive flex items-center gap-2">
                <XCircle className="h-5 w-5" /> NOT ELIGIBLE
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Used or knocked-in bats</li>
                <li>• Items without original packaging</li>
                <li>• Customized products</li>
                <li>• Items purchased on clearance sale</li>
                <li>• Returns requested after 7 days</li>
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-xl mb-4">HOW TO RETURN</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Contact Us', desc: 'Email support@cricketgear.in or call +91 98765 43210 with your order number.' },
                { step: '2', title: 'Get Approval', desc: 'Our team will review and approve your return request within 24 hours.' },
                { step: '3', title: 'Ship It Back', desc: 'We\'ll arrange a free pickup from your doorstep.' },
                { step: '4', title: 'Get Refund', desc: 'Refund processed within 5-7 business days to your original payment method.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
