export interface Supplier {
  idSupplier?: number;
  name: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
  industry: string;
  rating: number;
  taxId: string;
  totalContractValue: number;
  preferredSupplier: boolean;
  reliabilityScore: number;
  blacklisted: boolean;
  underReview: boolean;
  tags: string[];
  dateAdded: string;
  lastUpdated: string;
}
