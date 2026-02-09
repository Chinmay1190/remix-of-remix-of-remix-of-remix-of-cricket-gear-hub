import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    faqs: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 4-6 business days across India. Express delivery (2-3 business days) is available for select pin codes at an additional charge.' },
      { q: 'Is shipping free?', a: 'Yes! We offer free standard shipping on all orders above ₹2,000. Orders below ₹2,000 have a flat shipping fee of ₹199.' },
      { q: 'Can I track my order?', a: 'Absolutely! Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can also track your order from the My Orders section.' },
      { q: 'Do you ship internationally?', a: 'Currently, we only ship within India. We are working on expanding to international markets soon.' },
    ],
  },
  {
    title: 'Returns & Refunds',
    faqs: [
      { q: 'What is your return policy?', a: 'We offer a 7-day return policy for unused items in their original packaging. Items must be unworn, unused, and with all tags attached.' },
      { q: 'How do I initiate a return?', a: 'Contact our support team at support@cricketgear.in or call +91 98765 43210 with your order number. We\'ll arrange a pickup within 48 hours.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.' },
      { q: 'Can I exchange an item?', a: 'Yes! Exchanges are free for the same product in a different size. Contact our support team to arrange an exchange.' },
    ],
  },
  {
    title: 'Products & Quality',
    faqs: [
      { q: 'Are all products authentic?', a: 'Yes, 100%! We source all products directly from authorized brand distributors. Every item comes with a brand warranty and authenticity guarantee.' },
      { q: 'How do I choose the right bat size?', a: 'Check our Size Guide page for detailed measurements. Generally, stand the bat next to you – the top should reach your waist. Our team is also happy to help via chat or phone.' },
      { q: 'Do you offer customization?', a: 'We offer bat grip replacement and sticker customization on select models. Contact us for custom orders.' },
      { q: 'What if I receive a damaged product?', a: 'Contact us immediately with photos of the damage. We\'ll arrange a free replacement or full refund within 24 hours.' },
    ],
  },
  {
    title: 'Payment & Security',
    faqs: [
      { q: 'What payment methods do you accept?', a: 'We accept Credit/Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery.' },
      { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available on orders above ₹1,000 for most pin codes across India.' },
      { q: 'Is my payment information secure?', a: 'Absolutely! We use 256-bit SSL encryption and do not store any card details on our servers. All payments are processed through secure payment gateways.' },
    ],
  },
];

export default function FAQ() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">FREQUENTLY ASKED QUESTIONS</h1>
            <p className="text-muted-foreground">Find answers to common questions</p>
          </div>
        </div>

        {faqCategories.map((category, catIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl">{category.title}</h2>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <Accordion type="single" collapsible>
                {category.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`${catIndex}-${i}`} className="border-border">
                    <AccordionTrigger className="px-6 text-left font-medium hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        ))}

        <div className="bg-primary/5 rounded-2xl p-6 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Button asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
