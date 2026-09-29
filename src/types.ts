export type PageRoute = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'service-detail'
  | 'location-andheri' 
  | 'industries' 
  | 'portal' 
  | 'contact';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  subServices: string[];
  documentsRequired: string[];
  targetAudience: string[];
  deliverables: string[];
  faqs: { question: string; answer: string }[];
  relatedServiceIds: string[];
}

export interface ClientDocument {
  id: string;
  title: string;
  category: 'ITR' | 'GST' | 'PAN/KYC' | 'Bank Statement' | 'CMA/Loan' | 'Audit Report' | 'Incorporation';
  clientName: string;
  uploadDate: string;
  fileSize: string;
  sha256Hash: string;
  encryptionStandard: string;
  verificationStatus: 'Verified' | 'Under CA Review' | 'Action Required';
  reviewedBy?: string;
  notes?: string;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  checkType: string;
  system: string;
  status: 'PASSED' | 'OPTIMAL' | 'VERIFIED';
  details: string;
}

export type UserRole = 'client' | 'staff_ca' | 'managing_partner';
