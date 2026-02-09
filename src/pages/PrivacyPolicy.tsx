import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">PRIVACY POLICY</h1>
            <p className="text-muted-foreground text-sm">Last updated: February 2026</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="font-display text-xl">1. Information We Collect</h2>
          <p className="text-muted-foreground">We collect information you provide directly: name, email, phone number, shipping address, and payment details when you place an order. We also collect browsing data, device information, and cookies to improve your experience.</p>

          <h2 className="font-display text-xl mt-6">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">Your information is used to process orders, deliver products, provide customer support, send order updates, and improve our services. We may also send promotional emails which you can opt out of at any time.</p>

          <h2 className="font-display text-xl mt-6">3. Information Sharing</h2>
          <p className="text-muted-foreground">We do not sell your personal information. We share data only with logistics partners for delivery, payment processors for transactions, and as required by law.</p>

          <h2 className="font-display text-xl mt-6">4. Data Security</h2>
          <p className="text-muted-foreground">We use 256-bit SSL encryption, secure payment gateways, and follow industry best practices to protect your data. We do not store credit/debit card numbers on our servers.</p>

          <h2 className="font-display text-xl mt-6">5. Cookies</h2>
          <p className="text-muted-foreground">We use cookies to remember your preferences, keep you logged in, and analyze site traffic. You can manage cookie preferences in your browser settings.</p>

          <h2 className="font-display text-xl mt-6">6. Your Rights</h2>
          <p className="text-muted-foreground">You can request access to, correction of, or deletion of your personal data by contacting us at support@cricketgear.in.</p>

          <h2 className="font-display text-xl mt-6">7. Contact</h2>
          <p className="text-muted-foreground">For privacy-related queries, email us at support@cricketgear.in or call +91 98765 43210.</p>
        </div>
      </div>
    </main>
  );
}
