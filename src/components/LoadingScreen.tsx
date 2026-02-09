import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          {/* Cricket Ball Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-lg relative"
            >
              {/* Cricket ball seam */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-4 border-t-2 border-b-2 border-white/30 rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center rotate-90">
                <div className="w-20 h-4 border-t-2 border-b-2 border-white/30 rounded-full" />
              </div>
            </motion.div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-red-500/20 blur-xl animate-pulse" />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl font-display text-primary-foreground">CG</span>
            </div>
            <span className="font-display text-3xl tracking-wide">
              CRICKET<span className="text-primary">GEAR</span>
            </span>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="h-1 bg-muted rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Loading premium cricket gear...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
