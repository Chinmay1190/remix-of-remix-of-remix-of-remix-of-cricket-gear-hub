import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  CheckCircle,
  CreditCard,
  Wallet,
  Building,
  ArrowLeft,
  Lock,
  Truck,
  Shield,
  Banknote,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Sparkles,
  Package,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { z } from 'zod';
import { INDIAN_STATES, INDIAN_STATES_CITIES } from '@/data/indianLocations';

const steps = [
  { label: 'Information', icon: User },
  { label: 'Shipping', icon: Truck },
  { label: 'Payment', icon: CreditCard },
];

const informationSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required').max(15),
});

const shippingSchema = z.object({
  address: z.string().min(5, 'Address is required').max(200),
  city: z.string().min(2, 'City is required').max(50),
  state: z.string().min(2, 'State is required').max(50),
  pincode: z.string().min(6, 'Valid PIN code is required').max(6),
});

// Reusable input with leading icon
function IconInput({
  id,
  label,
  icon: Icon,
  error,
  required,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          className={cn(
            'pl-10 h-11 bg-background/60 border-border/70 focus-visible:ring-primary/40 transition-all',
            error && 'border-destructive focus-visible:ring-destructive/30'
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const FREE_SHIPPING_THRESHOLD = 2000;
  const shipping = totalPrice > FREE_SHIPPING_THRESHOLD ? 0 : 199;
  const tax = Math.round(totalPrice * 0.18);
  const finalTotal = totalPrice + shipping + tax;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const freeShippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (step: number): boolean => {
    try {
      if (step === 0) {
        informationSchema.parse({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        });
      } else if (step === 1) {
        shippingSchema.parse({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: `CRK-${Date.now()}`,
          subtotal: totalPrice,
          tax,
          shipping,
          total: finalTotal,
          shipping_name: `${formData.firstName} ${formData.lastName}`,
          shipping_email: formData.email,
          shipping_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_postal_code: formData.pincode,
          payment_method: paymentMethod,
          notes: formData.notes,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate('/order-success', {
        state: {
          orderData: {
            orderId: orderData.id,
            orderNumber: orderData.order_number,
            total: finalTotal,
          },
        },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl mb-4">No Items to Checkout</h1>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background pb-16">
      {/* Hero header */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(circle_at_80%_60%,hsl(var(--accent)/0.18),transparent_45%)]" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link to="/cart" aria-label="Back to cart">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Secure Checkout
                </p>
                <h1 className="font-display text-3xl md:text-4xl leading-tight">
                  Complete Your Order
                </h1>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium backdrop-blur">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>SSL Encrypted • PCI Compliant</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        {/* Guest banner */}
        {!user && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Save your order history</p>
                <p className="text-xs text-muted-foreground">
                  Sign in to track orders, save addresses, and access your wishlist faster.
                </p>
              </div>
            </div>
            <Button size="sm" asChild className="shrink-0">
              <Link to="/auth">
                Sign In <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              return (
                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                      }}
                      className={cn(
                        'relative w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm transition-colors border-2',
                        isComplete && 'bg-primary text-primary-foreground border-primary',
                        isActive &&
                          'bg-background text-primary border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]',
                        !isActive &&
                          !isComplete &&
                          'bg-muted text-muted-foreground border-border'
                      )}
                    >
                      {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </motion.div>
                    <span
                      className={cn(
                        'text-xs font-medium tracking-wide',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-3 mb-6 bg-muted overflow-hidden rounded-full">
                      <motion.div
                        initial={false}
                        animate={{ width: index < currentStep ? '100%' : '0%' }}
                        transition={{ duration: 0.4 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="bg-card/80 backdrop-blur rounded-2xl border border-border shadow-sm p-6 md:p-8"
              >
                {/* Step 1: Information */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl">Contact Information</h2>
                        <p className="text-xs text-muted-foreground">
                          We'll use this to send your order updates
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <IconInput
                        id="firstName"
                        label="First Name"
                        icon={User}
                        required
                        placeholder="Virat"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        error={errors.firstName}
                      />
                      <IconInput
                        id="lastName"
                        label="Last Name"
                        icon={User}
                        required
                        placeholder="Kohli"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        error={errors.lastName}
                      />
                    </div>

                    <IconInput
                      id="email"
                      label="Email"
                      icon={Mail}
                      type="email"
                      required
                      placeholder="virat@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      error={errors.email}
                    />

                    <IconInput
                      id="phone"
                      label="Phone Number"
                      icon={Phone}
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      error={errors.phone}
                    />

                    <Button
                      className="w-full h-12 text-base bg-gradient-to-r from-primary to-accent hover:opacity-95"
                      onClick={handleNextStep}
                    >
                      Continue to Shipping
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Shipping */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl">Shipping Address</h2>
                        <p className="text-xs text-muted-foreground">
                          Where should we deliver your gear?
                        </p>
                      </div>
                    </div>

                    <IconInput
                      id="address"
                      label="Street Address"
                      icon={Home}
                      required
                      placeholder="123 Cricket Lane, Apt 4B"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      error={errors.address}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <IconInput
                        id="city"
                        label="City"
                        icon={MapPin}
                        required
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        error={errors.city}
                      />
                      <IconInput
                        id="state"
                        label="State"
                        icon={MapPin}
                        required
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        error={errors.state}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <IconInput
                        id="pincode"
                        label="PIN Code"
                        icon={MapPin}
                        required
                        placeholder="400001"
                        value={formData.pincode}
                        onChange={(e) => updateFormData('pincode', e.target.value)}
                        error={errors.pincode}
                      />
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="country"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Country
                        </Label>
                        <div className="relative">
                          <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input
                            id="country"
                            value="India"
                            disabled
                            className="pl-10 h-11 bg-muted/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="notes"
                        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        Order Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions for delivery..."
                        className="bg-background/60 border-border/70 min-h-[90px]"
                        value={formData.notes}
                        onChange={(e) => updateFormData('notes', e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handlePrevStep} className="flex-1 h-12">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-95"
                      >
                        Continue to Payment
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl">Payment Method</h2>
                        <p className="text-xs text-muted-foreground">
                          All transactions are secure and encrypted
                        </p>
                      </div>
                    </div>

                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="grid sm:grid-cols-2 gap-3"
                    >
                      {[
                        {
                          id: 'card',
                          icon: CreditCard,
                          title: 'Credit / Debit Card',
                          desc: 'Visa, Mastercard, RuPay',
                        },
                        {
                          id: 'upi',
                          icon: Wallet,
                          title: 'UPI',
                          desc: 'GPay, PhonePe, Paytm',
                        },
                        {
                          id: 'netbanking',
                          icon: Building,
                          title: 'Net Banking',
                          desc: 'All major banks',
                        },
                        {
                          id: 'cod',
                          icon: Banknote,
                          title: 'Cash on Delivery',
                          desc: 'Pay when delivered',
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const active = paymentMethod === opt.id;
                        return (
                          <div
                            key={opt.id}
                            className={cn(
                              'relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                              active
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border hover:border-primary/40 hover:bg-muted/40'
                            )}
                            onClick={() => setPaymentMethod(opt.id)}
                          >
                            <RadioGroupItem value={opt.id} id={opt.id} className="sr-only" />
                            <div
                              className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                                active ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <Label
                              htmlFor={opt.id}
                              className="flex-1 cursor-pointer space-y-0.5"
                            >
                              <p className="font-semibold text-sm">{opt.title}</p>
                              <p className="text-xs text-muted-foreground">{opt.desc}</p>
                            </Label>
                            {active && (
                              <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </RadioGroup>

                    <AnimatePresence mode="wait">
                      {paymentMethod === 'card' && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 p-5 bg-muted/40 rounded-xl border border-border overflow-hidden"
                        >
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-primary" /> Card Details
                          </p>
                          <div>
                            <Label htmlFor="cardNumber" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Card Number
                            </Label>
                            <Input id="cardNumber" placeholder="4111 1111 1111 1111" className="mt-1 font-mono h-11" />
                          </div>
                          <div>
                            <Label htmlFor="cardName" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Name on Card
                            </Label>
                            <Input id="cardName" placeholder="VIRAT KOHLI" className="mt-1 uppercase h-11" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Expiry
                              </Label>
                              <Input id="expiry" placeholder="MM/YY" className="mt-1 font-mono h-11" />
                            </div>
                            <div>
                              <Label htmlFor="cvv" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                CVV
                              </Label>
                              <Input id="cvv" type="password" placeholder="•••" maxLength={4} className="mt-1 font-mono h-11" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === 'upi' && (
                        <motion.div
                          key="upi"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 bg-muted/40 rounded-xl border border-border space-y-3 overflow-hidden"
                        >
                          <p className="text-sm font-semibold">Enter your UPI ID</p>
                          <Input id="upiId" placeholder="yourname@upi" className="font-mono h-11" />
                          <p className="text-xs text-muted-foreground">
                            Example: mobile@ybl, name@okicici, name@paytm
                          </p>
                        </motion.div>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <motion.div
                          key="netbanking"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 bg-muted/40 rounded-xl border border-border overflow-hidden"
                        >
                          <p className="text-sm font-semibold mb-3">Select Your Bank</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Bank of Baroda'].map(
                              (bank) => (
                                <div
                                  key={bank}
                                  className="p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors text-sm text-center font-medium"
                                >
                                  {bank}
                                </div>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === 'cod' && (
                        <motion.div
                          key="cod"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-muted/40 rounded-xl border border-border overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground">
                            💵 Pay the delivery partner in cash or via UPI when your order arrives.
                            An additional ₹49 COD handling fee may apply.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handlePrevStep} className="flex-1 h-12">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-[2] h-12 bg-gradient-to-r from-primary to-accent hover:opacity-95 font-semibold"
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Place Order • {formatPrice(finalTotal)}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card/80 backdrop-blur rounded-2xl border border-border shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Summary
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  {items.length} item{items.length !== 1 && 's'}
                </span>
              </div>

              {/* Free shipping progress */}
              {shipping > 0 ? (
                <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <p className="text-xs font-medium mb-2">
                    Add <span className="text-primary font-bold">{formatPrice(amountToFreeShipping)}</span> more for{' '}
                    <span className="font-bold">FREE shipping</span>
                  </p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    You've unlocked FREE shipping!
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="absolute top-1 right-1 bg-foreground text-background text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)} each
                      </p>
                      <p className="text-sm font-bold mt-0.5">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={cn('font-medium', shipping === 0 && 'text-emerald-600 dark:text-emerald-400')}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-border">
                  <span className="font-display text-lg">Total</span>
                  <div className="text-right">
                    <span className="font-display text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(finalTotal)}
                    </span>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Incl. all taxes
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-5 border-t border-border grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-muted/40">
                  <Lock className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold leading-tight">Secure SSL</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-muted/40">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold leading-tight">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-muted/40">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold leading-tight">100% Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
