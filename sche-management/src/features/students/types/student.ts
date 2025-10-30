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

