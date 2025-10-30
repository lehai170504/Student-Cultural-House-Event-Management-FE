export interface Partner {
  id: number;
  name: string;
  organizationType: string;
  contactEmail: string;
  contactPhone: string;
  walletId: number;
  createdAt: string;
}

export interface CreatePartner {
  username: string;
  name: string;
  organizationType: string;
  contactEmail: string;
  contactPhone: string;
}

export interface CreateFuntEvent {
  eventId: string;
  amount: string;
}
