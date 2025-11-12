export interface University {
  id: string;
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
