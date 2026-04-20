import { forwardRef } from 'react';
import { formatPriceForPdf } from '@/lib/pdf';

export interface ReportRow {
  order_number: string;
  date: string;
  customer: string;
  items: number;
  total: number;
}

export interface CategoryRow {
  category: string;
  units: number;
  revenue: number;
}

interface PrintableReportProps {
  title: string;
  subtitle: string;
  generatedAt: string;
  rows: ReportRow[];
  categoryRows?: CategoryRow[];
  totals: {
    orders: number;
    units: number;
    revenue: number;
    avgOrderValue: number;
  };
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ title, subtitle, generatedAt, rows, categoryRows, totals }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-black mx-auto"
        style={{
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          width: '800px',
          padding: '48px 40px',
          lineHeight: 1.6,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '3px solid #1a1a1a',
            paddingBottom: '24px',
            marginBottom: '28px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#111' }}>CRICKETGEAR</h1>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Sales Report</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>{title}</h2>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{subtitle}</p>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Generated: {generatedAt}</p>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Total Orders', value: String(totals.orders) },
            { label: 'Items Sold', value: String(totals.units) },
            { label: 'Total Revenue', value: formatPriceForPdf(totals.revenue) },
            { label: 'Avg Order Value', value: formatPriceForPdf(totals.avgOrderValue) },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '14px 12px',
                background: '#fafafa',
              }}
            >
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: '#111' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        {categoryRows && categoryRows.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#666',
                marginBottom: '12px',
              }}
            >
              Category Breakdown
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #222' }}>
                  <th style={cellHead('left', '50%')}>Category</th>
                  <th style={cellHead('center', '20%')}>Units Sold</th>
                  <th style={cellHead('right', '30%')}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((c) => (
                  <tr key={c.category} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={cell('left')}>{c.category}</td>
                    <td style={cell('center')}>{c.units}</td>
                    <td style={cell('right')}>{formatPriceForPdf(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders table */}
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#666',
            marginBottom: '12px',
          }}
        >
          Order Details
        </h3>
        {rows.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#888', padding: '20px 0' }}>
            No orders found in this period.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #222' }}>
                <th style={cellHead('left', '25%')}>Order No.</th>
                <th style={cellHead('left', '20%')}>Date</th>
                <th style={cellHead('left', '25%')}>Customer</th>
                <th style={cellHead('center', '10%')}>Items</th>
                <th style={cellHead('right', '20%')}>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.order_number} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={cell('left')}>{r.order_number}</td>
                  <td style={cell('left')}>{r.date}</td>
                  <td style={cell('left')}>{r.customer}</td>
                  <td style={cell('center')}>{r.items}</td>
                  <td style={{ ...cell('right'), fontWeight: 600 }}>{formatPriceForPdf(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '32px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e5e5',
            fontSize: '11px',
            color: '#aaa',
          }}
        >
          This is a computer-generated report — CricketGear Pvt. Ltd.
        </div>
      </div>
    );
  }
);
PrintableReport.displayName = 'PrintableReport';

const cellHead = (align: 'left' | 'center' | 'right', width: string) => ({
  textAlign: align,
  padding: '10px 8px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  color: '#666',
  width,
});

const cell = (align: 'left' | 'center' | 'right') => ({
  textAlign: align,
  padding: '10px 8px',
  fontSize: '12px',
  color: '#222',
});
