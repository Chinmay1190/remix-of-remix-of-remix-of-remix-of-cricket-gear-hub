import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryCard } from '@/components/products/CategoryCard';
import { categories, products, brands } from '@/data/products';
import heroBat from '@/assets/hero-bat.jpg';

const features = [
  { icon: Shield, title: 'Authentic Products', description: '100% genuine cricket gear' },
  { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹2,000' },
  { icon: Zap, title: 'Fast Delivery', description: '2-4 business days' },
  { icon: Award, title: 'Quality Assured', description: 'Premium brand guarantee' },
];

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Index() {
  const trendingProducts = products.filter(p => p.badge === 'hot' || p.badge === 'sale').slice(0, 8);
  const newArrivals = products.filter(p => p.badge === 'new').slice(0, 4);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-hero hero-pattern overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary font-medium text-sm mb-6"
              >
                ⚡ New Season Collection 2024
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-tight mb-6"
              >
                GEAR UP
                <br />
                <span className="gradient-text">LIKE A PRO</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Premium cricket equipment from world-class brands. Elevate your game with gear trusted by champions.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-8 py-6 text-lg gap-2 group"
                  asChild
                >
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg border-2"
                  asChild
                >
                  <Link to="/products?category=bats">
                    Explore Bats
                  </Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-8 mt-12 justify-center lg:justify-start"
              >
                <div>
                  <p className="font-display text-3xl text-primary">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display text-3xl text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display text-3xl text-primary">20+</p>
                  <p className="text-sm text-muted-foreground">Brands</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <img
                  src={heroBat}
                  alt="Premium Cricket Bat"
                  className="relative w-full max-w-lg mx-auto rounded-3xl shadow-glow float"
                />
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-deep border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Grade 1 Willow</p>
                    <p className="text-sm text-muted-foreground">Premium Quality</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="bg-card border-y border-border py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <AnimatedSection className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Categories</span>
              <h2 className="font-display text-4xl md:text-5xl mt-2">
                SHOP BY <span className="gradient-text">CATEGORY</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 7).map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Trending Products */}
      <AnimatedSection className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Hot Deals</span>
              <h2 className="font-display text-4xl md:text-5xl mt-2">
                TRENDING <span className="gradient-text">PRODUCTS</span>
              </h2>
            </div>
            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Banner */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-primary">
            <div className="absolute inset-0 hero-pattern opacity-20" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                  Limited Edition
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                  INTERNATIONAL
                  <br />
                  MATCH EDITION
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-md">
                  Experience the same gear used by international cricket stars. Premium English Willow bats crafted for excellence.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link to="/products?category=bats">
                    Shop Collection
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="hidden md:block">
                <img
                  src={heroBat}
                  alt="Match Edition Bat"
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <AnimatedSection className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Just Landed</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">
              NEW <span className="gradient-text">ARRIVALS</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Brand Showcase */}
      <section className="py-12 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <p className="text-center text-muted-foreground text-sm uppercase tracking-wider">
            Trusted by Top Brands
          </p>
        </div>
        <div className="relative">
          <div className="flex items-center gap-16 brand-scroll whitespace-nowrap">
            {[...brands, ...brands].map((brand, index) => (
              <span
                key={index}
                className="text-3xl md:text-4xl font-display text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl border border-border p-8 md:p-12 lg:p-16 text-center">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
              READY TO <span className="gradient-text">DOMINATE?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Join thousands of cricketers who trust CricketGear for their equipment needs. Get exclusive deals and early access to new products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8"
                asChild
              >
                <Link to="/products">
                  Start Shopping
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
