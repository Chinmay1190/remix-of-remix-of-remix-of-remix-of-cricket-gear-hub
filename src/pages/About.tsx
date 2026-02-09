import { motion } from 'framer-motion';
import { Award, Users, Shield, Truck, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '20+', label: 'Premium Brands' },
  { value: '100%', label: 'Authentic Gear' },
];

const values = [
  { icon: Shield, title: 'Authenticity Guaranteed', description: 'Every product is sourced directly from authorized distributors. No counterfeits, ever.' },
  { icon: Award, title: 'Premium Quality', description: 'We only stock the best cricket equipment trusted by professionals worldwide.' },
  { icon: Truck, title: 'Fast Delivery', description: 'Quick and reliable shipping across India with real-time tracking.' },
  { icon: Heart, title: 'Player First', description: 'Our team of cricket enthusiasts understands what players need.' },
];

const team = [
  { name: 'Rajesh Sharma', role: 'Founder & CEO', initial: 'RS' },
  { name: 'Priya Patel', role: 'Head of Operations', initial: 'PP' },
  { name: 'Arjun Singh', role: 'Product Expert', initial: 'AS' },
  { name: 'Meera Reddy', role: 'Customer Success', initial: 'MR' },
];

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-hero hero-pattern overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary font-medium text-sm mb-6">
              Our Story
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">
              BUILT FOR <span className="gradient-text">CRICKETERS</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              CricketGear was founded with one mission: to provide every cricketer in India access to professional-grade equipment. From weekend warriors to aspiring professionals, we're here to help you play your best game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl mb-6">
                OUR <span className="gradient-text">JOURNEY</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  It all started in 2018 when our founder, a passionate club cricketer, struggled to find authentic cricket gear online. Frustrated by counterfeit products and unreliable sellers, he decided to create a platform that cricketers could trust.
                </p>
                <p>
                  Today, CricketGear is India's fastest-growing cricket equipment retailer, partnering directly with legendary brands like SG, SS, Gray-Nicolls, and Kookaburra to bring you genuine products at competitive prices.
                </p>
                <p>
                  We've equipped thousands of players - from school cricketers taking their first guard to state-level players competing for glory. Every piece of equipment we sell carries our promise of authenticity and quality.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <Target className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="font-display text-3xl">SINCE 2018</p>
                  <p className="text-muted-foreground">Serving Cricketers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              OUR <span className="gradient-text">VALUES</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at CricketGear
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border hover:shadow-soft transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              MEET THE <span className="gradient-text">TEAM</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A passionate team of cricket enthusiasts dedicated to your game
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-2xl font-display text-white">{member.initial}</span>
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              READY TO GEAR UP?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of cricketers who trust CricketGear for their equipment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
