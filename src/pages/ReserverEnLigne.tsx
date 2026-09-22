import { useEffect, useState } from 'react';
import { ChevronRightIcon, FacebookIcon, HomeIcon, MailIcon } from 'lucide-react';
import { ConnectBlock } from '../first-site-components/ConnectBlock';
import { InlineEditableField } from '../components/ui/InlineEditableField';

function XIconMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const shareLinks = [
  { label: 'Partager sur Facebook', Icon: FacebookIcon },
  { label: 'Partager sur X', Icon: XIconMark },
  { label: 'Partager par e-mail', Icon: MailIcon },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4 text-[15px] leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gov-blue" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ReserverEnLigne() {
  const [pageTitle, setPageTitle] = useState(() => {
    try {
      return localStorage.getItem('landingPageTitle') ?? 'Réserver en ligne sa place pour le permis';
    } catch {
      return 'Réserver en ligne sa place pour le permis';
    }
  });
  const [introText, setIntroText] = useState(() => {
    try {
      return localStorage.getItem('landingIntroText') ?? 'La Sécurité routière a mis en place une nouvelle plateforme qui permet de réserver en ligne son rendez-vous pour l’examen pratique du permis de conduire : RdvPermis.';
    } catch {
      return 'La Sécurité routière a mis en place une nouvelle plateforme qui permet de réserver en ligne son rendez-vous pour l’examen pratique du permis de conduire : RdvPermis.';
    }
  });
  const [breadcrumbLabel, setBreadcrumbLabel] = useState(() => {
    try {
      return localStorage.getItem('landingBreadcrumbLabel') ?? 'Inscription et formation';
    } catch {
      return 'Inscription et formation';
    }
  });
  const [platformTitle, setPlatformTitle] = useState(() => localStorage.getItem('landingPlatformTitle') ?? 'La plateforme');
  const [platformText, setPlatformText] = useState(() => localStorage.getItem('landingPlatformText') ?? 'RdvPermis est un système de réservation nominative des places à destination des candidats qui en font la demande par voie électronique soit par le biais de leur auto-école soit via leur propre compte sur le site de réservation.');
  const [howItWorksTitle, setHowItWorksTitle] = useState(() => localStorage.getItem('landingHowItWorksTitle') ?? 'Comment ça marche ?');
  const [candidateTitle, setCandidateTitle] = useState(() => localStorage.getItem('landingCandidateTitle') ?? 'Pour les candidats');
  const [candidateQuestion1, setCandidateQuestion1] = useState(() => localStorage.getItem('landingCandidateQuestion1') ?? 'Vous êtes un candidat déjà affilié à une école de conduite ?');
  const [candidateAnswer1, setCandidateAnswer1] = useState(() => localStorage.getItem('landingCandidateAnswer1') ?? 'Il vous suffit de vous connecter avec les identifiants que votre auto-école vous a fournis pour accéder à la plateforme.');
  const [candidateQuestion2, setCandidateQuestion2] = useState(() => localStorage.getItem('landingCandidateQuestion2') ?? 'Vous êtes un candidat libre résidant dans l\'un de ces départements ?');
  const [candidateAnswer2, setCandidateAnswer2] = useState(() => localStorage.getItem('landingCandidateAnswer2') ?? 'Il vous suffit de vous créer un compte sur la plateforme.');
  const [purposeTitle, setPurposeTitle] = useState(() => localStorage.getItem('landingPurposeTitle') ?? 'A quoi ça sert ?');
  const [purposeText, setPurposeText] = useState(() => localStorage.getItem('landingPurposeText') ?? 'Une fois connecté en tant que candidat, vous pouvez accéder à plusieurs fonctionnalités :');
  const [schoolTitle, setSchoolTitle] = useState(() => localStorage.getItem('landingSchoolTitle') ?? 'Pour les écoles');
  const [schoolText, setSchoolText] = useState(() => localStorage.getItem('landingSchoolText') ?? 'Une fois connecté, vous pourrez :');

  useEffect(() => {
    try {
      localStorage.setItem('landingPageTitle', pageTitle);
      localStorage.setItem('landingIntroText', introText);
      localStorage.setItem('landingBreadcrumbLabel', breadcrumbLabel);
      localStorage.setItem('landingPlatformTitle', platformTitle);
      localStorage.setItem('landingPlatformText', platformText);
      localStorage.setItem('landingHowItWorksTitle', howItWorksTitle);
      localStorage.setItem('landingCandidateTitle', candidateTitle);
      localStorage.setItem('landingCandidateQuestion1', candidateQuestion1);
      localStorage.setItem('landingCandidateAnswer1', candidateAnswer1);
      localStorage.setItem('landingCandidateQuestion2', candidateQuestion2);
      localStorage.setItem('landingCandidateAnswer2', candidateAnswer2);
      localStorage.setItem('landingPurposeTitle', purposeTitle);
      localStorage.setItem('landingPurposeText', purposeText);
      localStorage.setItem('landingSchoolTitle', schoolTitle);
      localStorage.setItem('landingSchoolText', schoolText);
    } catch {
      // ignore
    }
  }, [pageTitle, introText, breadcrumbLabel, platformTitle, platformText, howItWorksTitle, candidateTitle, candidateQuestion1, candidateAnswer1, candidateQuestion2, candidateAnswer2, purposeTitle, purposeText, schoolTitle, schoolText]);

  return (
    <main className="w-full bg-white">
      <img
        src="/3a3217b3-98f0-417c-bc97-5e2354c24fbe.jpg"
        alt="Une candidate au permis de conduire au volant, accompagnée de son moniteur"
        className="h-[220px] w-full object-cover md:h-[340px]"
      />

      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-content">
          <nav aria-label="Fil d’Ariane" className="flex flex-wrap items-center gap-3 py-6 text-[14px] text-muted">
            <a href="#" aria-label="Accueil" className="text-ink transition-colors duration-150 ease-out hover:text-gov-blue">
              <HomeIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <span aria-hidden="true" className="text-rule">|</span>
            <span aria-hidden="true" className="flex items-center gap-1.5">
              {[0.3, 0.45, 0.7, 1].map((opacity) => (
                <span key={opacity} className="h-1.5 w-1.5 rounded-full bg-neutral-500" style={{ opacity }} />
              ))}
            </span>
            <a href="#" className="transition-colors duration-150 ease-out hover:text-gov-blue">
              <InlineEditableField value={breadcrumbLabel} onSave={setBreadcrumbLabel} className="inline-block text-[14px]" placeholder="Titre" />
            </a>
            <ChevronRightIcon className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            <span aria-current="page"><InlineEditableField value={pageTitle} onSave={setPageTitle} className="inline-block" /></span>
          </nav>

          <h1 className="font-display text-[34px] font-bold leading-tight text-ink sm:text-[42px]">
            <InlineEditableField value={pageTitle} onSave={setPageTitle} className="inline-block" />
          </h1>

          <ul className="mt-7 flex items-center gap-4">
            {shareLinks.map(({ label, Icon }) => (
              <li key={label}>
                <a href="#" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-400 text-ink transition-[colors,transform] duration-150 ease-out hover:border-gov-blue hover:text-gov-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:ring-offset-2">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[15px] font-bold leading-relaxed text-ink">
            <InlineEditableField value={introText} onSave={setIntroText} className="inline-block" />
          </p>

          <h2 className="mt-12 font-display text-[20px] font-semibold text-ink">
            <InlineEditableField value={platformTitle} onSave={setPlatformTitle} className="inline-block" />
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            <InlineEditableField value={platformText} onSave={setPlatformText} className="inline-block" />
          </p>

          <div className="mt-10 grid items-stretch gap-8 sm:grid-cols-2">
            <ConnectBlock title="Je suis candidat" subtitle="inscrit dans un des départements concernés" />
            <ConnectBlock title="Je suis une école de conduite" subtitle="proposant une offre de formation dans un des départements concernés" />
          </div>

          <h2 className="mt-16 font-display text-[20px] font-semibold text-ink">
            <InlineEditableField value={howItWorksTitle} onSave={setHowItWorksTitle} className="inline-block" />
          </h2>

          <h3 className="mt-10 font-display text-[30px] font-bold text-ink">
            <InlineEditableField value={candidateTitle} onSave={setCandidateTitle} className="inline-block" />
          </h3>
          <p className="mt-6 text-[15px] font-bold text-ink">
            <InlineEditableField value={candidateQuestion1} onSave={setCandidateQuestion1} className="inline-block" />
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            <InlineEditableField value={candidateAnswer1} onSave={setCandidateAnswer1} className="inline-block" />
          </p>
          <p className="mt-6 text-[15px] font-bold text-ink">
            <InlineEditableField value={candidateQuestion2} onSave={setCandidateQuestion2} className="inline-block" />
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            <InlineEditableField value={candidateAnswer2} onSave={setCandidateAnswer2} className="inline-block" />
          </p>

          <h4 className="mt-10 font-display text-[19px] font-semibold text-ink">
            <InlineEditableField value={purposeTitle} onSave={setPurposeTitle} className="inline-block" />
          </h4>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            <InlineEditableField value={purposeText} onSave={setPurposeText} className="inline-block" />
          </p>

          <p className="mt-6 text-[15px] font-bold text-ink">Si vous avez été inscrit par une école de conduite :</p>
          <Bullets items={['gérer facilement votre mandat ;', "suivre en ligne les démarches entreprises par l'école pour votre compte (prise de rendez-vous, etc.)"]} />

          <p className="mt-8 text-[15px] font-bold text-ink">Si vous êtes en candidat libre :</p>
          <Bullets items={['prendre directement rendez-vous pour l’examen du permis de conduire accompagné par un de vos proches titulaire du permis de conduire ;', "Attention : l'accompagnement par un professionnel est interdit pour une prise de rendez-vous via ce site d'inscription et vous devrez fournir le jour de l'examen un véhicule assuré et équipé de double-commandes."]} />

          <h3 className="mt-14 font-display text-[30px] font-bold text-ink">
            <InlineEditableField value={schoolTitle} onSave={setSchoolTitle} className="inline-block" />
          </h3>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            <InlineEditableField value={schoolText} onSave={setSchoolText} className="inline-block" />
          </p>
          <Bullets items={['renseigner et enregistrer les candidats sous contrat avec votre établissement ;', 'accéder à l’ensemble des profils de vos candidats sous mandat ;', 'gérer les réservations aux examens via un agenda (réservations, annulations, etc.).']} />
        </div>
      </div>
    </main>
  );
}