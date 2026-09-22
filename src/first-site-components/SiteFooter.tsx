import React from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon } from
'lucide-react';
import { MarianneLogo } from './MarianneLogo';
import {
  governmentLinks,
  institutionLinks,
  serviceLinks } from
'../first-site-data/footerLinks';

const socials = [
{ label: 'Facebook', Icon: FacebookIcon },
{ label: 'YouTube', Icon: YoutubeIcon },
{ label: 'LinkedIn', Icon: LinkedinIcon },
{ label: 'Instagram', Icon: InstagramIcon }];


export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-3">
        <div>
          <ul className="flex items-center gap-6">
            {socials.map(({ label, Icon }) =>
            <li key={label}>
                <a
                href="#"
                aria-label={label}
                className="block text-ink transition-colors duration-150 ease-out hover:text-gov-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue">
                
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </a>
              </li>
            )}
          </ul>
          <ul className="mt-8 space-y-3">
            {serviceLinks.map((link) =>
            <li key={link}>
                <a
                href="#"
                className="text-[14px] text-muted underline decoration-neutral-300 underline-offset-4 transition-colors duration-150 ease-out hover:text-gov-blue">
                
                  {link}
                </a>
              </li>
            )}
          </ul>
        </div>

        <nav aria-labelledby="footer-sr">
          <h2
            id="footer-sr"
            className="font-display text-[13px] font-bold tracking-wide text-ink">
            
            SÉCURITÉ ROUTIÈRE
          </h2>
          <ul className="mt-6 space-y-3">
            {institutionLinks.map((link) =>
            <li key={link}>
                <a
                href="#"
                className="text-[14px] text-muted underline decoration-neutral-300 underline-offset-4 transition-colors duration-150 ease-out hover:text-gov-blue">
                
                  {link}
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div>
          <p className="text-[14px] text-muted">Sam, le conducteur engagé</p>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-3 bg-ink px-4 py-3 text-white transition-opacity duration-150 ease-out hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:ring-offset-2">
            
            <span className="font-display text-[26px] font-bold leading-none tracking-tight">
              SAM
            </span>
            <span className="font-display text-[9px] font-semibold uppercase leading-[1.25]">
              Celui qui conduit,
              <br />
              c’est celui qui ne
              <br />
              boit pas.
            </span>
          </a>

          <ul className="mt-8 space-y-3">
            {governmentLinks.map((link) =>
            <li key={link}>
                <a
                href="#"
                className="text-[14px] text-muted transition-colors duration-150 ease-out hover:text-gov-blue">
                
                  {link}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-8">
          <MarianneLogo lines={['MINISTÈRE', "DE L'INTÉRIEUR"]} />
          <p className="font-display text-[17px] text-muted">
            Ministère de l’Intérieur
          </p>
        </div>
      </div>
    </footer>);

}