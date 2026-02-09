import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const openings = [
  { title: 'Frontend Developer', location: 'Mumbai', type: 'Full-time', department: 'Engineering' },
  { title: 'Product Manager', location: 'Mumbai', type: 'Full-time', department: 'Product' },
  { title: 'Digital Marketing Specialist', location: 'Remote', type: 'Full-time', department: 'Marketing' },
  { title: 'Customer Support Executive', location: 'Mumbai', type: 'Full-time', department: 'Support' },
  { title: 'Warehouse Operations Manager', location: 'Pune', type: 'Full-time', department: 'Operations' },
];

export default function Careers() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl">CAREERS</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 rounded-2xl p-8 mb-8 text-center">
          <h2 className="font-display text-3xl mb-2">JOIN OUR <span className="gradient-text">TEAM</span></h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We're building India's best cricket equipment platform. If you're passionate about cricket and technology, we'd love to hear from you.
          </p>
        </motion.div>

        <div className="space-y-4">
          {openings.map((job, index) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.type}</span>
                    <Badge variant="secondary">{job.department}</Badge>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <a href={`mailto:careers@cricketgear.in?subject=Application: ${job.title}`}>Apply</a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Don't see a role that fits? Email us at <a href="mailto:careers@cricketgear.in" className="text-primary hover:underline">careers@cricketgear.in</a></p>
        </div>
      </div>
    </main>
  );
}
