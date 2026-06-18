export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  totalEarnings: number;
  pendingBalance: number;
  withdrawableBalance: number;
  createdAt: string;
}

export type PlatformType = "PC" | "Android" | "iOS" | "PlayStation" | "Xbox";

export interface Mod {
  id: string;
  title: string;
  gameName: string;
  version: string;
  platform: PlatformType;
  price: number;
  platformFee: number;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  screenshots: string[];
  description: string;
  downloadsCount: number;
  totalEarnings: number;
  sharemodsLink?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export type PayoutStatus = "pending" | "approved" | "rejected";

export interface Payout {
  id: string;
  userId: string;
  upiId: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
}
