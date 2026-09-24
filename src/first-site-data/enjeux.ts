export interface Enjeu {
  title: string;
  lead: string;
  strong: string;
  tail: string;
}

export const enjeux: Enjeu[] = [
{
  title: 'Responsabilité',
  lead: 'Rendre ',
  strong: "la possession des places d'examen au candidat et le responsabiliser",
  tail: " en cas d'échec, d'annulation ou d'absence."
},
{
  title: 'Transparence',
  lead: 'Offrir ',
  strong: "une visibilité complète sur les places d'examen disponibles",
  tail: " et sur les démarches engagées par l'école de conduite."
},
{
  title: 'Simplicité',
  lead: 'Permettre ',
  strong: 'une réservation en ligne, à tout moment et en quelques minutes',
  tail: ", sans passer par un échange téléphonique ou un courrier."
}];