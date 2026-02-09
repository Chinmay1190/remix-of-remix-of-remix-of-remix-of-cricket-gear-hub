import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = couponApplied ? totalPrice * 0.1 : 0;
  const shipping = totalPrice > 2000 ? 0 : 199;
  const finalTotal = totalPrice - discount + shipping;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'cricket10') {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center"
            >
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            </motion.div>
            <h1 className="font-display text-4xl mb-4">YOUR CART IS EMPTY</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to find the perfect cricket gear!
            </p>
            <Button size="lg" asChild>
              <Link to="/products">
                Browse Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl mb-8"
        >
          YOUR <span className="gradient-text">CART</span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 md:gap-6 p-4 md:p-6 bg-card rounded-2xl border border-border"
              >
                {/* Image */}
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs text-primary font-medium uppercase">
                        {item.product.brand}
                      </span>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.size && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: {item.size}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 bg-muted rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button variant="ghost" onClick={clearCart} className="text-muted-foreground">
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl mb-6">ORDER SUMMARY</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-primary mt-2">
                    ✓ Coupon "CRICKET10" applied - 10% off!
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Try: CRICKET10 for 10% off
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount (10%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Add {formatPrice(2000 - totalPrice)} more for free shipping
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-6">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-2xl">{formatPrice(finalTotal)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                asChild
              >
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              {/* Continue Shopping */}
              <Button variant="ghost" className="w-full mt-3" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span>🔒 Secure Checkout</span>
                  <span>•</span>
                  <span>💳 Multiple Payment Options</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
