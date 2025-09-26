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
  member?: string;
  price?: string;
  link?: string;
}
