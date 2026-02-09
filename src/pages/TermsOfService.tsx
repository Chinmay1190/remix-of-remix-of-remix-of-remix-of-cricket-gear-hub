import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">TERMS OF SERVICE</h1>
            <p className="text-muted-foreground text-sm">Last updated: February 2026</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-6">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing and using CricketGear, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.' },
            { title: '2. Products & Pricing', content: 'All products are subject to availability. Prices are listed in INR and include applicable taxes unless stated otherwise. We reserve the right to change prices without prior notice.' },
            { title: '3. Orders', content: 'Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order for reasons including product availability, pricing errors, or suspected fraud.' },
            { title: '4. Payment', content: 'Payment must be completed at the time of order placement (except COD). We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery.' },
            { title: '5. Shipping & Delivery', content: 'Delivery timelines are estimates and may vary. We are not liable for delays caused by courier partners, natural disasters, or other events beyond our control.' },
            { title: '6. Returns & Refunds', content: 'Returns are accepted within 7 days of delivery as per our Returns Policy. Refunds are processed within 5-7 business days after receiving the returned item.' },
            { title: '7. Intellectual Property', content: 'All content on this website including text, images, logos, and designs is the property of CricketGear and protected by copyright laws.' },
            { title: '8. Limitation of Liability', content: 'CricketGear is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services.' },
            { title: '9. Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.' },
            { title: '10. Contact', content: 'For questions about these terms, contact us at support@cricketgear.in.' },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-xl mb-2">{section.title}</h2>
              <p className="text-muted-foreground text-sm">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
