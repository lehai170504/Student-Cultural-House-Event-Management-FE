export interface University {
  id: number;
  name: string;
  code: string;
  domain: string;
  createdAt: string;
}

export interface CreateUniversity {
  name: string;
  code: string;
  domain: string;
}

export type UpdateUniversity = CreateUniversity;

export interface UniversityResponse {
  status: number;
  message: string;
  data: University[];
}
