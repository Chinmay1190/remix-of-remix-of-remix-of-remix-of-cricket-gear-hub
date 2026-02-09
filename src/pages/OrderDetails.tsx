import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Clock, CheckCircle2, Truck, ArrowLeft, Download, Printer,
  MapPin, Phone, Mail, CreditCard, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PrintableInvoice } from '@/components/invoice/PrintableInvoice';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  payment_method: string;
  created_at: string;
}

const statusSteps = [
  { key: 'pending', icon: Clock, label: 'Order Placed' },
  { key: 'confirmed', icon: CheckCircle2, label: 'Confirmed' },
  { key: 'shipped', icon: Truck, label: 'Shipped' },
  { key: 'delivered', icon: Package, label: 'Delivered' },
];

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && id) {
      fetchOrderDetails();
    }
  }, [user, id]);

  const fetchOrderDetails = async () => {
    if (!user || !id) return;

    try {
      const [orderResult, itemsResult] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('order_items').select('*').eq('order_id', id),
      ]);

      if (orderResult.error) throw orderResult.error;
      if (itemsResult.error) throw itemsResult.error;

      setOrder(orderResult.data);
      setOrderItems(itemsResult.data || []);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentStep = () => {
    const index = statusSteps.findIndex(step => step.key === order?.status);
    return index >= 0 ? index : 0;
  };

  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print the invoice');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order?.order_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #000; background: #fff; display: flex; justify-content: center; }
          .print-invoice { padding: 48px 40px; max-width: 800px; margin: 0 auto; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 12px 8px; }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    toast.success('Invoice sent to printer!');
  };

  const getInlineStyledHTML = (element: HTMLElement): string => {
    const clone = element.cloneNode(true) as HTMLElement;
    const original = element.querySelectorAll('*');
    const cloned = clone.querySelectorAll('*');
    
    // Copy computed styles to inline styles for the root element
    const rootStyles = window.getComputedStyle(element);
    const rootImportantProps = ['font-family', 'color', 'background-color', 'padding', 'max-width', 'margin'];
    rootImportantProps.forEach(prop => {
      clone.style.setProperty(prop, rootStyles.getPropertyValue(prop));
    });

    // Copy computed styles for all child elements
    original.forEach((el, i) => {
      const computed = window.getComputedStyle(el);
      const clonedEl = cloned[i] as HTMLElement;
      const props = [
        'font-family', 'font-size', 'font-weight', 'font-style',
        'color', 'background-color', 'background',
        'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
        'border-collapse',
        'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
        'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
        'text-align', 'vertical-align', 'line-height', 'letter-spacing',
        'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
        'grid-template-columns',
        'width', 'max-width', 'min-width', 'height',
        'text-transform', 'text-decoration',
      ];
      props.forEach(prop => {
        const val = computed.getPropertyValue(prop);
        if (val) clonedEl.style.setProperty(prop, val);
      });
    });

    return clone.outerHTML;
  };

  const downloadInvoice = () => {
    if (!order) return;

    const printContent = invoiceRef.current;
    if (!printContent) return;

    // Temporarily make the invoice visible to compute styles
    const hiddenContainer = printContent.closest('.hidden');
    if (hiddenContainer) {
      (hiddenContainer as HTMLElement).style.position = 'absolute';
      (hiddenContainer as HTMLElement).style.left = '-9999px';
      (hiddenContainer as HTMLElement).classList.remove('hidden');
    }

    const styledHTML = getInlineStyledHTML(printContent);

    if (hiddenContainer) {
      (hiddenContainer as HTMLElement).style.position = '';
      (hiddenContainer as HTMLElement).style.left = '';
      (hiddenContainer as HTMLElement).classList.add('hidden');
    }

    const blob = new Blob([`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.order_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #000; background: #fff; display: flex; justify-content: center; }
  </style>
</head>
<body>${styledHTML}</body>
</html>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.order_number}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded!');
  };

  if (!user) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Please sign in to view order details</p>
          <Button asChild className="mt-4">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl mb-4">ORDER NOT FOUND</h1>
          <Button asChild>
            <Link to="/orders">View All Orders</Link>
          </Button>
        </div>
      </main>
    );
  }

  const currentStep = getCurrentStep();

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/orders">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display text-2xl md:text-3xl">{order.order_number}</h1>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  View Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[850px] max-h-[90vh] overflow-y-auto p-0">
                <div className="sticky top-0 z-10 bg-background border-b p-4 flex justify-end gap-2">
                  <Button onClick={handlePrintInvoice} variant="outline" size="sm" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button onClick={downloadInvoice} size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <PrintableInvoice ref={invoiceRef} order={order} items={orderItems} />
              </DialogContent>
            </Dialog>
            <Button onClick={handlePrintInvoice} className="gap-2">
              <Printer className="h-4 w-4" />
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Order Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 mb-8"
        >
          <h2 className="font-display text-xl mb-6">ORDER TRACKING</h2>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {statusSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      'text-xs mt-2 font-medium',
                      isCurrent ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h2 className="font-display text-xl mb-6">ORDER ITEMS</h2>
              
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-semibold mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                SHIPPING ADDRESS
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shipping_name}</p>
                <p className="text-muted-foreground">{order.shipping_address}</p>
                <p className="text-muted-foreground">
                  {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-display text-lg mb-4">CONTACT INFO</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.shipping_email}</span>
                </div>
                {order.shipping_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.shipping_phone}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                PAYMENT METHOD
              </h3>
              <Badge variant="secondary" className="capitalize">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'upi' ? 'UPI' : order.payment_method === 'netbanking' ? 'Net Banking' : 'Credit/Debit Card'}
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hidden invoice for printing */}
      <div className="hidden">
        <PrintableInvoice ref={invoiceRef} order={order} items={orderItems} />
      </div>
    </main>
  );
}
