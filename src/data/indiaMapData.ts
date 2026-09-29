/**
 * Nationwide Office Network and Regional Coverage Data
 * CA Krishna Panjiyar & Co.
 */

export interface OfficeLocation {
  id: string;
  city: string;
  state: string;
  region: 'West' | 'North' | 'South' | 'East' | 'Central';
  isHeadquarter?: boolean;
  address: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const OUR_OFFICES: OfficeLocation[] = [
  {
    id: 'mumbai-hq',
    city: 'Mumbai',
    state: 'Maharashtra',
    region: 'West',
    isHeadquarter: true,
    address: '102, Shourie Complex, Bombay Bazaar, Andheri (W), Mumbai – 400058',
    phone: '+91 8876808572',
    email: 'cakrishanpanjiyar@gmail.com',
    hours: 'Mon - Sat: 9:30 AM – 7:00 PM (IST)',
    services: [
      'Statutory & Tax Audit',
      'Direct Taxation & Corporate Tax',
      'GST Compliance & Refunds',
      'MCA / ROC Company Compliance',
      'Litigation & Faceless Assessment Representation'
    ],
    coordinates: {
      lat: 19.1197,
      lng: 72.8464
    }
  },
  {
    id: 'delhi-ncr',
    city: 'New Delhi / NCR',
    state: 'Delhi',
    region: 'North',
    isHeadquarter: false,
    address: 'Connaught Place & Noida Corporate Desk',
    phone: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    hours: 'Mon - Sat: 9:30 AM – 6:30 PM (IST)',
    services: [
      'Corporate Tax Advisory',
      'MCA ROC Filings',
      'Startup DPIIT Advisory',
      'Faceless Tax Appeals'
    ],
    coordinates: {
      lat: 28.6139,
      lng: 77.2090
    }
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    region: 'South',
    isHeadquarter: false,
    address: 'Indiranagar Tech Hub Desk',
    phone: '+91 8876808572',
    email: 'cakrishanpanjiyar@gmail.com',
    hours: 'Mon - Sat: 9:30 AM – 6:30 PM (IST)',
    services: [
      'SaaS Export Compliance (15CA/CB)',
      'Cross-Border Tax Advisory',
      'Angel Tax Exemption',
      'Remote Bookkeeping'
    ],
    coordinates: {
      lat: 12.9716,
      lng: 77.5946
    }
  },
  {
    id: 'ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    region: 'West',
    isHeadquarter: false,
    address: 'SG Highway Commercial Hub',
    phone: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    hours: 'Mon - Sat: 9:30 AM – 6:30 PM (IST)',
    services: [
      'Industrial GST Audits',
      'Project CMA Bank Loan Reports',
      'MSME Subsidies',
      'Partnership Restructuring'
    ],
    coordinates: {
      lat: 23.0225,
      lng: 72.5714
    }
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    region: 'East',
    isHeadquarter: false,
    address: 'Salt Lake Sector V Desk',
    phone: '+91 8876808572',
    email: 'cakrishanpanjiyar@gmail.com',
    hours: 'Mon - Sat: 9:30 AM – 6:30 PM (IST)',
    services: [
      'Trading & Manufacturing Statutory Audit',
      'GST Input Reconciliation',
      'Internal Control Auditing'
    ],
    coordinates: {
      lat: 22.5726,
      lng: 88.3639
    }
  }
];

export const REGIONAL_HUBS = [
  {
    region: 'West India',
    states: ['Maharashtra', 'Gujarat', 'Goa'],
    leadOffice: 'Mumbai HQ (Andheri West)'
  },
  {
    region: 'North India',
    states: ['Delhi NCR', 'Punjab', 'Haryana', 'Rajasthan', 'Uttar Pradesh'],
    leadOffice: 'Delhi NCR Desk'
  },
  {
    region: 'South India',
    states: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Kerala', 'Andhra Pradesh'],
    leadOffice: 'Bengaluru Tech Desk'
  },
  {
    region: 'East & Central India',
    states: ['West Bengal', 'Odisha', 'Madhya Pradesh', 'Chhattisgarh', 'Bihar'],
    leadOffice: 'Kolkata & Virtual Desk'
  }
];

export default OUR_OFFICES;
