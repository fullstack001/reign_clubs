export interface Member {
  name: string;
  num: string;
  price: string;
  link?: string;
  image?: string;
  description?: string;
  createdAt?: Date;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface RouterQuery {
  m?: string;
  p?: string;
  l?: string;
}

// GSAP declarations
declare global {
  interface Window {
    gsap: any;
    CustomEase: any;
    SplitText: any;
  }
  
  const gsap: any;
  const CustomEase: any;
  const SplitText: any;
}