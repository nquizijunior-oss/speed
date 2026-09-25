import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { enjeux } from '../first-site-data/enjeux';

export function EnjeuxCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const current = enjeux[index];

  const go = (step: number) => {
    setDirection(step);
    setIndex((value) => (value + step + enjeux.length) % enjeux.length);
  };

  return (
    <section aria-label="Les trois grands enjeux" className="py-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Enjeu précédent"
          className="shrink-0 p-2 text-neutral-400 transition-colors duration-150 ease-out hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue">
          
          <ChevronLeftIcon className="h-8 w-8" aria-hidden="true" />
        </button>

        <div className="min-h-[132px] flex-1 overflow-hidden text-center">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={current.title}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
              
              <p className="text-[15px] text-muted">{current.title}</p>
              <p
                aria-hidden="true"
                className="font-display text-[64px] font-light leading-none text-neutral-400">
                
                {index + 1}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Enjeu suivant"
          className="shrink-0 p-2 text-neutral-400 transition-colors duration-150 ease-out hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue">
          
          <ChevronRightIcon className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-6 text-center text-[15px] leading-relaxed text-muted">
        {current.lead}
        <strong className="font-semibold text-ink">{current.strong}</strong>
        {current.tail}
      </p>
    </section>);

}