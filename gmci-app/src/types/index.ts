export interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  description: string;
  type: 'upcoming' | 'recent';
  image?: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  alt: string;
}
