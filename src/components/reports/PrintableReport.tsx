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

const BRAND_DARK = '#0f172a';
const BRAND_ACCENT = '#dc2626';
const SOFT_BG = '#f8fafc';
const BORDER = '#e2e8f0';
const MUTED = '#64748b';

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ title, subtitle, generatedAt, rows, categoryRows, totals }, ref) => {
    const totalCatRevenue = (categoryRows ?? []).reduce((s, c) => s + c.revenue, 0);

    return (
      <div
        ref={ref}
        className="bg-white text-black mx-auto"
        style={{
          fontFamily: "'Helvetica Neue', 'Segoe UI', Arial, sans-serif",
          width: '800px',
          padding: '0',
          lineHeight: 1.5,
          color: BRAND_DARK,
        }}
      >
        {/* HERO BANNER */}
        <div
          style={{
            background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #1e293b 60%, ${BRAND_ACCENT} 200%)`,
            color: '#fff',
            padding: '36px 44px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative diagonal stripe */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-60px',
              width: '240px',
              height: '240px',
              background: BRAND_ACCENT,
              opacity: 0.15,
              transform: 'rotate(45deg)',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: BRAND_ACCENT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px',
                  }}
                >
                  CG
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '2px' }}>
                  CRICKET<span style={{ color: BRAND_ACCENT }}>GEAR</span>
                </div>
              </div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: '#94a3b8', marginBottom: '6px' }}>
                Sales Performance
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0, letterSpacing: '0.5px', lineHeight: 1.1 }}>
                {title}
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Period
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', maxWidth: '260px' }}>{subtitle}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Generated</div>
              <div style={{ fontSize: '11px', fontWeight: 500 }}>{generatedAt}</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '32px 44px 40px' }}>
          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '32px' }}>
            {[
              { label: 'Total Orders', value: String(totals.orders), color: '#3b82f6' },
              { label: 'Items Sold', value: String(totals.units), color: '#f59e0b' },
              { label: 'Total Revenue', value: formatPriceForPdf(totals.revenue), color: '#10b981' },
              { label: 'Avg Order Value', value: formatPriceForPdf(totals.avgOrderValue), color: '#8b5cf6' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  border: `1px solid ${BORDER}`,
                  borderTop: `3px solid ${s.color}`,
                  borderRadius: '6px',
                  padding: '14px 14px 16px',
                  background: '#fff',
                }}
              >
                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: MUTED, letterSpacing: '1.5px', fontWeight: 600 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '6px', color: BRAND_DARK, letterSpacing: '-0.3px' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* CATEGORY BREAKDOWN */}
          {categoryRows && categoryRows.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader>Category Breakdown</SectionHeader>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: SOFT_BG, borderRadius: '6px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: BRAND_DARK }}>
                    <th style={cellHead('left', '40%', '#fff')}>Category</th>
                    <th style={cellHead('center', '15%', '#fff')}>Units</th>
                    <th style={cellHead('right', '20%', '#fff')}>Revenue</th>
                    <th style={cellHead('right', '25%', '#fff')}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryRows.map((c, i) => {
                    const share = totalCatRevenue > 0 ? (c.revenue / totalCatRevenue) * 100 : 0;
                    return (
                      <tr key={c.category} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? '#fff' : SOFT_BG }}>
                        <td style={{ ...cell('left'), fontWeight: 600 }}>{c.category}</td>
                        <td style={cell('center')}>{c.units}</td>
                        <td style={{ ...cell('right'), fontWeight: 700 }}>{formatPriceForPdf(c.revenue)}</td>
                        <td style={cell('right')}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: MUTED, minWidth: '34px', textAlign: 'right' }}>
                              {share.toFixed(1)}%
                            </span>
                            <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${share}%`, height: '100%', background: BRAND_ACCENT }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ORDERS */}
          <SectionHeader>Order Details</SectionHeader>
          {rows.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 20px',
                background: SOFT_BG,
                borderRadius: '6px',
                border: `1px dashed ${BORDER}`,
                color: MUTED,
                fontSize: '13px',
              }}
            >
              No orders found in this period.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: BRAND_DARK }}>
                  <th style={cellHead('left', '22%', '#fff')}>Order No.</th>
                  <th style={cellHead('left', '18%', '#fff')}>Date</th>
                  <th style={cellHead('left', '28%', '#fff')}>Customer</th>
                  <th style={cellHead('center', '12%', '#fff')}>Items</th>
                  <th style={cellHead('right', '20%', '#fff')}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.order_number} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? '#fff' : SOFT_BG }}>
                    <td style={{ ...cell('left'), fontFamily: 'Courier, monospace', fontSize: '11px', color: BRAND_ACCENT, fontWeight: 600 }}>
                      {r.order_number}
                    </td>
                    <td style={{ ...cell('left'), color: MUTED }}>{r.date}</td>
                    <td style={{ ...cell('left'), fontWeight: 500 }}>{r.customer}</td>
                    <td style={cell('center')}>{r.items}</td>
                    <td style={{ ...cell('right'), fontWeight: 700 }}>{formatPriceForPdf(r.total)}</td>
                  </tr>
                ))}
                {/* Grand total row */}
                <tr style={{ background: BRAND_DARK, color: '#fff' }}>
                  <td colSpan={3} style={{ ...cell('left'), color: '#fff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px' }}>
                    Grand Total
                  </td>
                  <td style={{ ...cell('center'), color: '#fff', fontWeight: 700 }}>{totals.units}</td>
                  <td style={{ ...cell('right'), color: '#fff', fontWeight: 800, fontSize: '14px' }}>
                    {formatPriceForPdf(totals.revenue)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            background: SOFT_BG,
            borderTop: `3px solid ${BRAND_ACCENT}`,
            padding: '18px 44px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '10px',
            color: MUTED,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: BRAND_DARK, fontSize: '11px', letterSpacing: '1px' }}>CRICKETGEAR PVT. LTD.</div>
            <div style={{ marginTop: '2px' }}>Computer-generated report · No signature required</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>support@cricketgear.in</div>
            <div style={{ marginTop: '2px' }}>www.cricketgear.in</div>
          </div>
        </div>
      </div>
    );
  }
);
PrintableReport.displayName = 'PrintableReport';

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <div style={{ width: '4px', height: '20px', background: BRAND_ACCENT, borderRadius: '2px' }} />
      <h3
        style={{
          fontSize: '13px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: BRAND_DARK,
          margin: 0,
        }}
      >
        {children}
      </h3>
    </div>
  );
}

const cellHead = (align: 'left' | 'center' | 'right', width: string, color = MUTED) => ({
  textAlign: align,
  padding: '11px 12px',
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '1.2px',
  color,
  width,
});

const cell = (align: 'left' | 'center' | 'right') => ({
  textAlign: align,
  padding: '10px 12px',
  fontSize: '12px',
  color: BRAND_DARK,
});
