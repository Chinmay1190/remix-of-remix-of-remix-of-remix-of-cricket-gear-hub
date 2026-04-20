import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Render an HTMLElement to a multi-page A4 PDF.
 * Uses html2canvas to rasterize the DOM so currency symbols (₹), custom fonts,
 * and CSS layout are preserved exactly as on screen.
 */
export async function downloadElementAsPdf(element: HTMLElement, filename: string) {
  // Make sure the element is laid out (some hidden parents break measurement)
  const previousVisibility = element.style.visibility;
  element.style.visibility = 'visible';

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
  });

  element.style.visibility = previousVisibility;

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

/**
 * Format an INR price using "Rs." instead of the ₹ glyph.
 * Many PDF fonts don't ship the ₹ glyph and render it as "Rs1" or a box.
 * Using "Rs." guarantees consistent rendering across PDF viewers.
 */
export function formatPriceForPdf(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(rounded);
  return `Rs. ${formatted}`;
}
