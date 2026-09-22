import React from 'react';
import { relatedArticles } from '../first-site-data/relatedArticles';

export function RelatedArticles() {
  return (
    <section aria-labelledby="voir-aussi" className="py-10">
      <h2
        id="voir-aussi"
        className="font-display text-[20px] font-semibold text-ink">
        
        Voir aussi
      </h2>

      <ul className="mt-8 grid gap-10 md:grid-cols-3">
        {relatedArticles.map((article) =>
        <li key={article.title} className="flex flex-col">
            <a href="#" className="group flex h-full flex-col focus:outline-none">
              <span className="relative block border-t border-rule pt-2">
                <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[10px] border-x-transparent border-t-gov-blue" />
              
                <img
                src={article.image}
                alt={article.alt}
                className="aspect-[16/9] w-full object-cover"
                loading="lazy" />
              
              </span>
              <h3 className="mt-5 text-[17px] leading-snug text-ink transition-colors duration-150 ease-out group-hover:text-gov-blue group-focus-visible:text-gov-blue">
                {article.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {article.excerpt}
              </p>
            </a>
          </li>
        )}
      </ul>
    </section>);

}