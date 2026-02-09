import { motion } from 'framer-motion';
import { Ruler, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const batSizes = [
  { size: 'Size 1', height: "4'0\" - 4'3\"", age: '4-5 years', length: '25.5"' },
  { size: 'Size 2', height: "4'3\" - 4'6\"", age: '6-7 years', length: '27"' },
  { size: 'Size 3', height: "4'6\" - 4'9\"", age: '8-9 years', length: '28.5"' },
  { size: 'Size 4', height: "4'9\" - 4'11\"", age: '9-10 years', length: '30"' },
  { size: 'Size 5', height: "4'11\" - 5'2\"", age: '10-12 years', length: '31.5"' },
  { size: 'Size 6', height: "5'2\" - 5'6\"", age: '12-14 years', length: '33"' },
  { size: 'Harrow', height: "5'6\" - 5'8\"", age: '14-16 years', length: '33.5"' },
  { size: 'Full / SH', height: "5'8\" and above", age: '15+ years', length: '33.5"' },
];

const gloveSizes = [
  { size: 'Small (S)', circumference: '7" - 7.5"', description: 'Youth / Small hands' },
  { size: 'Medium (M)', circumference: '7.5" - 8"', description: 'Average adult' },
  { size: 'Large (L)', circumference: '8" - 8.5"', description: 'Larger hands' },
  { size: 'X-Large (XL)', circumference: '8.5" - 9"', description: 'Extra large hands' },
];

const helmetSizes = [
  { size: 'Small', circumference: '54-55 cm', description: 'Youth' },
  { size: 'Medium', circumference: '56-57 cm', description: 'Average adult' },
  { size: 'Large', circumference: '58-59 cm', description: 'Larger head' },
  { size: 'X-Large', circumference: '60-62 cm', description: 'Extra large' },
];

export default function SizeGuide() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">SIZE GUIDE</h1>
            <p className="text-muted-foreground">Find the perfect fit for your cricket gear</p>
          </div>
        </div>

        {/* Bat Sizes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Ruler className="h-6 w-6 text-primary" />
            <h2 className="font-display text-xl">CRICKET BAT SIZES</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Size</th>
                  <th className="text-left py-3 px-4 font-semibold">Player Height</th>
                  <th className="text-left py-3 px-4 font-semibold">Age Group</th>
                  <th className="text-left py-3 px-4 font-semibold">Bat Length</th>
                </tr>
              </thead>
              <tbody>
                {batSizes.map((row) => (
                  <tr key={row.size} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium">{row.size}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.height}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.age}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Glove Sizes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-display text-xl mb-6">BATTING GLOVE SIZES</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Size</th>
                  <th className="text-left py-3 px-4 font-semibold">Hand Circumference</th>
                  <th className="text-left py-3 px-4 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {gloveSizes.map((row) => (
                  <tr key={row.size} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium">{row.size}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.circumference}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Helmet Sizes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl mb-6">HELMET SIZES</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Size</th>
                  <th className="text-left py-3 px-4 font-semibold">Head Circumference</th>
                  <th className="text-left py-3 px-4 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {helmetSizes.map((row) => (
                  <tr key={row.size} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium">{row.size}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.circumference}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            💡 Tip: Measure around the widest part of your head, just above the ears, using a soft tape measure.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
