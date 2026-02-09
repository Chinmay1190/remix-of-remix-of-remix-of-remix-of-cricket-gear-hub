import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '@/types/product';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/products?category=${category.slug}`}
        className="category-card block aspect-[4/5] rounded-2xl overflow-hidden group"
      >
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
          <h3 className="font-display text-2xl md:text-3xl text-white mb-1 transform group-hover:translate-x-2 transition-transform duration-300">
            {category.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">
              {category.productCount} Products
            </span>
            <motion.div
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
