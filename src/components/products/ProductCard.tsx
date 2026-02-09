import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group product-card bg-card border border-border"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badge */}
        {product.badge && (
          <span
            className={cn(
              'absolute top-3 left-3 z-10',
              product.badge === 'new' && 'badge-new',
              product.badge === 'sale' && 'badge-sale',
              product.badge === 'hot' && 'badge-hot'
            )}
          >
            {product.badge === 'new' && 'NEW'}
            {product.badge === 'sale' && `${product.discount}% OFF`}
            {product.badge === 'hot' && 'HOT'}
          </span>
        )}

        {/* Wishlist Button */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          variant="secondary"
          size="icon"
          className={cn(
            'absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity',
            inWishlist && 'opacity-100'
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              inWishlist && 'fill-destructive text-destructive'
            )}
          />
        </Button>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button
              onClick={() => addToCart(product)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Quick View */}
        <Link
          to={`/product/${product.id}`}
          className="absolute top-14 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
        >
          <Eye className="h-4 w-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {product.brand}
        </span>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground mt-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stockCount && product.stockCount < 10 && (
          <p className="text-xs text-accent mt-2 font-medium">
            Only {product.stockCount} left in stock!
          </p>
        )}
      </div>
    </motion.div>
  );
}
