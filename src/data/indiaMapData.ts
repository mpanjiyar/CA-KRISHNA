export interface StateGeoInfo {
  id: string; // standard 2-letter state code e.g. 'MH', 'DL', 'KA'
  name: string;
  type: 'state' | 'ut';
  zone: 'West' | 'North' | 'South' | 'East' | 'Central' | 'Northeast';
  capital: string;
  path: string; // SVG path
  center: { x: number; y: number }; // label / pinpoint anchor
  hasPhysicalOffice?: boolean;
  serviceTier: 'headquarters' | 'major-hub' | 'active-coverage';
  keyIndustries: string[];
  activeClientsCount: string;
  servicesAvailable: string[];
}

export interface MapLocationMarker {
  id: string;
  name: string;
  type: 'head-office' | 'branch-office' | 'service-hub';
  city: string;
  state: string;
  stateId: string;
  address: string;
  contact: string;
  email: string;
  coordinates: { x: number; y: number }; // normalized to map viewBox 0 0 1000 1100
  highlight: string;
  services: string[];
}

export const MAP_OFFICES_AND_HUBS: MapLocationMarker[] = [
  {
    id: 'mumbai-ho',
    name: 'Mumbai Head Office',
    type: 'head-office',
    city: 'Mumbai',
    state: 'Maharashtra',
    stateId: 'MH',
    address: '102, Shourie Complex, Bombay Bazaar, Andheri (W), Mumbai – 400058',
    contact: '+91 600310815 / +91 8876808572',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 285, y: 640 },
    highlight: 'Principal Chartered Accountancy Practice & Direct Partner Desk',
    services: [
      'Statutory & Tax Audit (Section 44AB)',
      'Direct Tax Litigation & Faceless Appeals',
      'Corporate ROC & Secretarial Compliance',
      'Bank CMA Reports & Loan Syndication',
      'GST Audit, Filings & Inverted Duty Refunds'
    ]
  },
  {
    id: 'delhi-hub',
    name: 'Delhi NCR Liaison Desk',
    type: 'branch-office',
    city: 'New Delhi / Gurugram',
    state: 'Delhi (NCT)',
    stateId: 'DL',
    address: 'Connaught Place & Cyber City Corporate Desk',
    contact: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 385, y: 350 },
    highlight: 'Central Regulatory, DPIIT & MCA Compliance Gateway',
    services: [
      'Ministry of Corporate Affairs (MCA) ROC Filings',
      'Startup India DPIIT Recognition & Tax Exemption',
      'Central GST & Customs Representation',
      'Cross-Border 15CA/15CB Foreign Remittance'
    ]
  },
  {
    id: 'bengaluru-hub',
    name: 'Bengaluru Tech & SaaS Service Hub',
    type: 'service-hub',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateId: 'KA',
    address: 'Koramangala & Indiranagar Startup Corridor',
    contact: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 410, y: 825 },
    highlight: 'Tech Startups, Angel Tax & SaaS Export Taxation',
    services: [
      'SaaS Export Billing & GST LUT Filing',
      'ESOP Valuation & Cap Table Structuring',
      'Transfer Pricing & FEMA Compliance',
      'Virtual CFO & Cloud Bookkeeping'
    ]
  },
  {
    id: 'ahmedabad-hub',
    name: 'Gujarat Commercial & Export Hub',
    type: 'service-hub',
    city: 'Ahmedabad / Surat',
    state: 'Gujarat',
    stateId: 'GJ',
    address: 'SG Highway Commercial Hub',
    contact: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 235, y: 520 },
    highlight: 'Manufacturing, Textile & Diamond Merchant Tax Advisory',
    services: [
      'GST Inverted Duty Structure Refunds',
      'Export Invoicing & RoDTEP Advisory',
      'Working Capital Consortium Loans',
      'Family Business Restructuring'
    ]
  },
  {
    id: 'kolkata-hub',
    name: 'Kolkata Eastern Regional Desk',
    type: 'service-hub',
    city: 'Kolkata',
    state: 'West Bengal',
    stateId: 'WB',
    address: 'Salt Lake Sector V & BBD Bagh Desk',
    contact: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 745, y: 565 },
    highlight: 'Mining, Logistics, Trading & Industrial Compliance',
    services: [
      'Inventory & Physical Stock Audit',
      'Internal Control & Governance Review',
      'MSME Project Financing Models',
      'Commercial Tax Assessments'
    ]
  },
  {
    id: 'hyderabad-hub',
    name: 'Hyderabad Pharma & IT Service Hub',
    type: 'service-hub',
    city: 'Hyderabad',
    state: 'Telangana',
    stateId: 'TG',
    address: 'HITEC City & Madhapur Desk',
    contact: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 440, y: 690 },
    highlight: 'Pharma, Real Estate RERA & Technology Accounting',
    services: [
      'RERA Project Registration & Audit',
      'Export Tax Incentives & SEZ Compliances',
      'Company Incorporation & Secretarial Audit',
      'Payroll Management & TDS Filings'
    ]
  },
  {
    id: 'chennai-hub',
    name: 'Chennai Automobile & Maritime Desk',
    type: 'service-hub',
    city: 'Chennai',
    state: 'Tamil Nadu',
    stateId: 'TN',
    address: 'Mount Road & Guindy Industrial Estate',
    contact: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 475, y: 840 },
    highlight: 'Automotive Ancillary & Import-Export Customs Compliance',
    services: [
      'Import Customs & Advance Authorization Audit',
      'Manufacturing Cost Audit & CMA Profiles',
      'TDS / TCS Compliance & Form 27EQ',
      'Corporate Restructuring'
    ]
  },
  {
    id: 'guwahati-hub',
    name: 'Guwahati Northeast Regional Desk',
    type: 'service-hub',
    city: 'Guwahati',
    state: 'Assam',
    stateId: 'AS',
    address: 'GS Road Commercial Zone',
    contact: '+91 600310815',
    email: 'cakrishanpanjiyar@gmail.com',
    coordinates: { x: 865, y: 430 },
    highlight: 'Northeast Industrial Scheme Subsidies & Tea/Agro Audit',
    services: [
      'NEIDS Industrial Development Subsidies',
      'Tea & Agro-Food Processing Accounts',
      'Government Tender Financial Modeling',
      'Cross-Border Border Trade GST'
    ]
  }
];
