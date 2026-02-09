import { forwardRef } from 'react';

interface InvoiceItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

interface InvoiceOrder {
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

interface PrintableInvoiceProps {
  order: InvoiceOrder;
  items: InvoiceItem[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

export const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ order, items }, ref) => {
    const invoiceDate = formatDate(order.created_at);

    return (
      <div
        ref={ref}
        className="print-invoice bg-white text-black mx-auto"
        style={{
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          maxWidth: '800px',
          margin: '0 auto',
          padding: '48px 40px',
          lineHeight: 1.6,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #1a1a1a', paddingBottom: '28px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px', color: '#111', margin: 0 }}>CRICKETGEAR</h1>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>India's Premier Cricket Equipment Store</p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#888', lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>123 Sports Complex, MG Road</p>
              <p style={{ margin: 0 }}>Mumbai, Maharashtra 400001</p>
              <p style={{ margin: 0 }}>Phone: +91 98765 43210 | Email: support@cricketgear.in</p>
              <p style={{ margin: 0 }}>GSTIN: 27AABCC1234D1Z5</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111', margin: 0, letterSpacing: '1px' }}>TAX INVOICE</h2>
            <div style={{ marginTop: '14px', fontSize: '13px', lineHeight: 2 }}>
              <div><span style={{ color: '#888' }}>Invoice No: </span><strong>{order.order_number}</strong></div>
              <div><span style={{ color: '#888' }}>Date: </span><strong>{invoiceDate}</strong></div>
              <div><span style={{ color: '#888' }}>Status: </span><strong style={{ textTransform: 'capitalize' }}>{order.status}</strong></div>
            </div>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#999', marginBottom: '8px', letterSpacing: '1.5px' }}>Bill To</h3>
            <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 4px' }}>{order.shipping_name}</p>
            <p style={{ fontSize: '13px', color: '#555', margin: '0 0 2px' }}>{order.shipping_address}</p>
            <p style={{ fontSize: '13px', color: '#555', margin: '0 0 2px' }}>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
            {order.shipping_phone && <p style={{ fontSize: '13px', color: '#555', margin: '6px 0 0' }}>Phone: {order.shipping_phone}</p>}
            <p style={{ fontSize: '13px', color: '#555', margin: '2px 0 0' }}>Email: {order.shipping_email}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#999', marginBottom: '8px', letterSpacing: '1.5px' }}>Ship To</h3>
            <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 4px' }}>{order.shipping_name}</p>
            <p style={{ fontSize: '13px', color: '#555', margin: '0 0 2px' }}>{order.shipping_address}</p>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: '24px', fontSize: '13px' }}>
          <span style={{ color: '#888' }}>Payment Method: </span>
          <strong style={{ textTransform: 'capitalize' }}>
            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'upi' ? 'UPI' : order.payment_method === 'netbanking' ? 'Net Banking' : 'Credit/Debit Card'}
          </strong>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #222' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', width: '5%' }}>#</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', width: '45%' }}>Description</th>
              <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', width: '10%' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', width: '20%' }}>Unit Price</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', width: '20%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '12px 8px', fontSize: '13px' }}>{index + 1}</td>
                <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 500 }}>{item.product_name}</td>
                <td style={{ padding: '12px 8px', fontSize: '13px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '12px 8px', fontSize: '13px', textAlign: 'right' }}>{formatPrice(item.price)}</td>
                <td style={{ padding: '12px 8px', fontSize: '13px', textAlign: 'right', fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
              <span style={{ color: '#666' }}>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
              <span style={{ color: '#666' }}>CGST (9%)</span>
              <span>{formatPrice(order.tax / 2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
              <span style={{ color: '#666' }}>SGST (9%)</span>
              <span>{formatPrice(order.tax / 2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
              <span style={{ color: '#666' }}>Shipping</span>
              <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', marginTop: '8px', borderTop: '3px solid #111', fontSize: '18px', fontWeight: 700 }}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '16px', marginBottom: '32px' }}>
          <p style={{ fontSize: '13px', margin: 0 }}>
            <span style={{ color: '#888' }}>Amount in words: </span>
            <em style={{ fontWeight: 500 }}>Rupees {numberToWords(order.total)} Only</em>
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', borderTop: '1px solid #e5e5e5', paddingTop: '24px' }}>
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#999', marginBottom: '10px', letterSpacing: '1px' }}>Terms & Conditions</h4>
            <ul style={{ fontSize: '12px', color: '#888', listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
              <li>• 7-day return policy for unused items</li>
              <li>• All products are 100% authentic</li>
              <li>• Subject to Mumbai jurisdiction</li>
            </ul>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '48px' }}>For CricketGear</p>
            <div style={{ display: 'inline-block', borderTop: '1px solid #ccc', paddingTop: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, margin: 0 }}>Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Computer Generated */}
        <div style={{ textAlign: 'center', marginTop: '36px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
          <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>This is a computer-generated invoice and does not require a physical signature.</p>
          <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Thank you for shopping with CricketGear!</p>
        </div>
      </div>
    );
  }
);

PrintableInvoice.displayName = 'PrintableInvoice';

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const n = Math.floor(num);
  
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numberToWords(n % 100) : '');
  if (n < 100000) return numberToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numberToWords(n % 1000) : '');
  if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numberToWords(n % 100000) : '');
  return numberToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numberToWords(n % 10000000) : '');
}
