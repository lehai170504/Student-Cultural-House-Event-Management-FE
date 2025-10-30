// src/features/universities/types/student.ts

export interface Sort {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort[];
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface UniversityUser {
  id: number;
  universityId: number;
  universityName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface UniversityUserPagedResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: UniversityUser[];
  number: number;
  sort: Sort[];
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface StudentResponse {
  status: number;
  message: string;
  data: UniversityUserPagedResponse;
}

// Profile types
export interface StudentProfile {
  id: number;
  universityId: number;
  universityName: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface StudentProfileResponse {
  data: StudentProfile;
}

export interface CompleteProfileRequest {
  phoneNumber: string;
  avatarUrl: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}
