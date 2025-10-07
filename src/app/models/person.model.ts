export interface Person {
  id?: number;
  name: string;
  work: string;
  birthDate: string;
  age: number;
  acceptsCommercial: boolean;
  isBirthday: boolean;
}

export interface ApiResponse {
  success: boolean;
  data: {
    people: Person[];
    pagination: {
      page: number;
      pages: number;
      total: number;
      limit: number;
    };
    search: string;
    locale: string;
  };
}

export interface ApiSingleResponse {
  success: boolean;
  data: Person;
  message?: string;
}