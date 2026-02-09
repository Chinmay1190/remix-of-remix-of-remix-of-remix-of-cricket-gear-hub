import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import heroBat from '@/assets/hero-bat.jpg';
import categoryGloves from '@/assets/category-gloves.jpg';
import categoryHelmet from '@/assets/category-helmet.jpg';

const posts = [
  {
    title: 'How to Choose the Perfect Cricket Bat: A Complete Guide',
    excerpt: 'Learn about willow grades, bat weights, sweet spots, and more to find the bat that matches your playing style.',
    image: heroBat,
    date: 'Jan 15, 2026',
    category: 'Guides',
  },
  {
    title: 'Top 5 Batting Gloves for the 2026 Season',
    excerpt: 'We tested and reviewed the best batting gloves from SG, SS, and Gray-Nicolls for comfort, protection, and grip.',
    image: categoryGloves,
    date: 'Jan 8, 2026',
    category: 'Reviews',
  },
  {
    title: 'Cricket Helmet Safety: What Every Player Must Know',
    excerpt: 'Understanding safety certifications, stem guards, and why investing in a quality helmet is non-negotiable.',
    image: categoryHelmet,
    date: 'Dec 28, 2025',
    category: 'Safety',
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">BLOG</h1>
            <p className="text-muted-foreground">Cricket tips, gear reviews, and more</p>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary transition-colors"
            >
              <div className="grid md:grid-cols-3 gap-0">
                <div className="aspect-video md:aspect-auto">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />{post.date}
                    </span>
                  </div>
                  <h2 className="font-display text-xl mb-2">{post.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
