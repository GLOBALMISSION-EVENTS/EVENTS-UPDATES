export interface Event {
  id: number;
  position: number;
  title: string;
  date: string;
  event_date?: string;
  venue: string;
  description: string;
  type: 'upcoming' | 'recent';
  image?: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  position: number;
}

export interface AboutContent {
  id: number;
  vision: string;
  mission: string;
  values: string[];
  directorName: string;
  directorTitle: string;
  directorImage: string;
  directorMessage: string[];
  aboutImage: string;
  contactPhone: string[];
  contactEmail: string[];
  contactTwitter: string;
  contactYoutube: string;
  contactAddress: string[];
}
