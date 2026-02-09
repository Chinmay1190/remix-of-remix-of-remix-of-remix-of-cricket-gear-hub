import { motion } from 'framer-motion';
import { ArrowLeft, Newspaper, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const pressItems = [
  { title: 'CricketGear Raises ₹50 Crore in Series A Funding', source: 'Economic Times', date: 'Dec 2025' },
  { title: 'How CricketGear is Revolutionizing Online Cricket Equipment Shopping', source: 'YourStory', date: 'Nov 2025' },
  { title: 'Top 10 Sports E-commerce Startups to Watch in 2026', source: 'Inc42', date: 'Oct 2025' },
  { title: 'CricketGear Partners with SG Cricket for Exclusive Collection', source: 'Sportstar', date: 'Sep 2025' },
];

export default function Press() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl">PRESS</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 rounded-2xl p-8 mb-8 text-center">
          <Newspaper className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="font-display text-2xl mb-2">MEDIA & PRESS</h2>
          <p className="text-muted-foreground">
            For press inquiries, contact <a href="mailto:press@cricketgear.in" className="text-primary hover:underline">press@cricketgear.in</a>
          </p>
        </motion.div>

        <div className="space-y-4">
          {pressItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.source} · {item.date}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
