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

const formatPrice = (price: number) => {
  const rounded = Math.round(price);
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(rounded);
  return `Rs. ${formatted}`;
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

const paymentLabel = (method: string) =>
  method === 'cod' ? 'Cash on Delivery'
  : method === 'upi' ? 'UPI Payment'
  : method === 'netbanking' ? 'Net Banking'
  : 'Credit / Debit Card';

const statusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'delivered') return '#0a7d3a';
  if (s === 'shipped') return '#1a56db';
  if (s === 'processing') return '#b45309';
  if (s === 'cancelled') return '#b91c1c';
  return '#374151';
};

export const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ order, items }, ref) => {
    const invoiceDate = formatDate(order.created_at);
    const dueDate = formatDate(order.created_at);
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <div
        ref={ref}
        className="print-invoice"
        style={{
          fontFamily: "'Helvetica Neue', 'Segoe UI', Arial, sans-serif",
          maxWidth: '820px',
          margin: '0 auto',
          background: '#ffffff',
          color: '#0f172a',
          lineHeight: 1.55,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* HERO BANNER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0b1220 0%, #1e293b 55%, #0f172a 100%)',
            color: '#ffffff',
            padding: '44px 48px 56px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative diagonal accent */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-80px',
              width: '320px',
              height: '320px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              transform: 'rotate(35deg)',
              opacity: 0.18,
              borderRadius: '40px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '180px',
              height: '180px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              opacity: 0.15,
              borderRadius: '50%',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  borderRadius: '999px',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  marginBottom: '14px',
                }}
              >
                PREMIUM CRICKET GEAR
              </div>
              <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', margin: 0, lineHeight: 1.1 }}>
                CRICKET<span style={{ color: '#f59e0b' }}>GEAR</span>
              </h1>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '8px 0 0', maxWidth: '280px' }}>
                123 Sports Complex, MG Road, Mumbai 400001<br />
                +91 98765 43210 · support@cricketgear.in<br />
                GSTIN: 27AABCC1234D1Z5
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '4px',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  fontWeight: 600,
                }}
              >
                INVOICE
              </div>
              <h2 style={{ fontSize: '40px', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>
                #{order.order_number.replace('ORD-', '')}
              </h2>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  padding: '5px 12px',
                  background: statusColor(order.status),
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {order.status}
              </div>
            </div>
          </div>
        </div>

        {/* META STRIP */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '18px 48px',
          }}
        >
          {[
            { label: 'Invoice Date', value: invoiceDate },
            { label: 'Due Date', value: dueDate },
            { label: 'Payment', value: paymentLabel(order.payment_method) },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* BODY */}
        <div style={{ padding: '36px 48px' }}>
          {/* Bill To / Ship To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            {[
              { title: 'BILLED TO', accent: '#f59e0b' },
              { title: 'SHIPPED TO', accent: '#3b82f6' },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#ffffff',
                  borderLeft: `4px solid ${card.accent}`,
                }}
              >
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '10px' }}>
                  {card.title}
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: '#0f172a' }}>
                  {order.shipping_name}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7 }}>
                  {order.shipping_address}<br />
                  {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}<br />
                  {order.shipping_email}
                  {order.shipping_phone && <><br />{order.shipping_phone}</>}
                </div>
              </div>
            ))}
          </div>

          {/* Items Table */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', width: '6%' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px' }}>ITEM DESCRIPTION</th>
                  <th style={{ textAlign: 'center', padding: '14px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', width: '10%' }}>QTY</th>
                  <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', width: '20%' }}>RATE</th>
                  <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', width: '20%' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderTop: index === 0 ? 'none' : '1px solid #e2e8f0',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                      {item.product_name}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'center', color: '#475569' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right', color: '#475569' }}>
                      {formatPrice(item.price)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
            {/* Notes / thanks */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #fcd34d',
              }}
            >
              <div style={{ fontSize: '10px', color: '#92400e', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '8px' }}>
                THANK YOU FOR YOUR ORDER
              </div>
              <p style={{ fontSize: '12px', color: '#78350f', margin: 0, lineHeight: 1.6 }}>
                We appreciate your business. Total <strong>{totalQty} item{totalQty !== 1 ? 's' : ''}</strong> packed
                with care. For any queries about this invoice, contact us within 7 days.
              </p>
            </div>

            {/* Totals */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              {[
                { label: 'Subtotal', value: formatPrice(order.subtotal) },
                { label: 'CGST (9%)', value: formatPrice(order.tax / 2) },
                { label: 'SGST (9%)', value: formatPrice(order.tax / 2) },
                { label: 'Shipping', value: order.shipping === 0 ? 'FREE' : formatPrice(order.shipping) },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 18px',
                    fontSize: '12px',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ color: '#64748b' }}>{row.label}</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 18px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: '#ffffff',
                }}
              >
                <span style={{ fontSize: '12px', letterSpacing: '2px', fontWeight: 700 }}>GRAND TOTAL</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#fbbf24' }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Amount in words */}
          <div
            style={{
              padding: '14px 18px',
              background: '#f1f5f9',
              borderRadius: '8px',
              marginBottom: '28px',
              fontSize: '12px',
            }}
          >
            <span style={{ color: '#64748b', fontWeight: 600 }}>Amount in words: </span>
            <span style={{ color: '#0f172a', fontWeight: 600, fontStyle: 'italic' }}>
              Indian Rupees {numberToWords(order.total)} Only
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
              paddingTop: '20px',
              borderTop: '2px dashed #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '8px' }}>
                TERMS & CONDITIONS
              </div>
              <ul style={{ fontSize: '11px', color: '#64748b', listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.9 }}>
                <li>• 7-day return policy on unused items in original packaging</li>
                <li>• All products carry 100% authenticity guarantee</li>
                <li>• Disputes subject to Mumbai jurisdiction only</li>
                <li>• E. & O. E. — Errors and omissions excepted</li>
              </ul>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '8px' }}>
                FOR CRICKETGEAR
              </div>
              <div
                style={{
                  marginTop: '40px',
                  paddingTop: '8px',
                  borderTop: '1px solid #0f172a',
                  display: 'inline-block',
                  minWidth: '160px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stripe */}
        <div
          style={{
            background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 50%, #8b5cf6 100%)',
            height: '6px',
          }}
        />
        <div
          style={{
            textAlign: 'center',
            padding: '14px 48px',
            background: '#0f172a',
            color: '#94a3b8',
            fontSize: '10px',
            letterSpacing: '1.5px',
          }}
        >
          COMPUTER GENERATED INVOICE · NO SIGNATURE REQUIRED · WWW.CRICKETGEAR.IN
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
