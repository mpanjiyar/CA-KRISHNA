import { ServiceItem, ClientDocument, SecurityAuditEntry } from '../types';

export const FIRM_DETAILS = {
  name: 'PANJIYAR KRISHNA & CO.',
  designation: 'Chartered Accountants',
  founder: 'CA Krishna Panjiyar',
  founderTitle: 'Founder & Chartered Accountant',
  tagline: 'Accuracy | Integrity | Growth',
  phone1: '600310815',
  phone2: '8876808572',
  phones: ['600310815', '8876808572'],
  email: 'cakrishanpanjiyar@gmail.com',
  address: {
    line1: '102, Shourie Complex, Bombay Bazaar',
    line2: 'Andheri (W), Mumbai – 400058',
    state: 'Maharashtra',
    full: '102, Shourie Complex, Bombay Bazaar, Andheri (W), Mumbai – 400058, Maharashtra',
    locality: 'Andheri West',
    city: 'Mumbai',
    pincode: '400058'
  },
  mainPositioning: 'Your Trusted Partner in Taxation, Compliance & Growth',
  supportingPositioning: 'PAN India network in Accounting, Taxation, and Litigation matters with an enthusiastic team who cares for you all the time.',
  workingHours: 'Mon - Sat: 9:30 AM – 7:00 PM (IST)'
};

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: 'income-tax',
    name: 'Income Tax Services',
    category: 'Direct Taxation',
    shortDesc: 'Comprehensive income tax filing, planning and advisory support.',
    fullDesc: 'Professional income tax filing, tax planning, compliance and advisory support for individuals, professionals, LLPs, and corporate entities across India.',
    subServices: [
      'ITR Filing (Individuals, HUF, Firms, Companies)',
      'Corporate Tax Planning & Advisory',
      'Tax Planning & Advance Tax Calculations',
      'Income Tax Notice Management & Replies',
      'Scrutiny & Assessment Representation',
      'Capital Gains Computation & Exemptions',
      'Tax Residency Certificates (TRC) & DTAA',
      'TDS Reconciliation & Annual Tax Statements (26AS / AIS / TIS)'
    ],
    documentsRequired: [
      'PAN Card and Aadhaar Card',
      'Form 16 / Form 16A / Form 26AS / AIS / TIS',
      'Bank Statements for the entire financial year',
      'Investment Proofs (80C, 80D, NPS, Home Loan Interest certificate)',
      'Capital gains statements from brokers / Mutual Fund houses',
      'Balance Sheet, P&L statement, and Tax Audit Report (if applicable)'
    ],
    targetAudience: [
      'Salaried Professionals & High Net-Worth Individuals (HNIs)',
      'Freelancers, Consultants & Independent Practitioners',
      'Proprietorships, Partnerships & Limited Liability Partnerships (LLPs)',
      'Private Limited & Public Limited Companies'
    ],
    deliverables: [
      'Computation of Total Income with optimal tax deductions',
      'Timely e-Filing with Income Tax Department e-Portal',
      'Acknowledgement Form (ITR-V) and filing dossier',
      'Year-round compliance monitoring and notice alert support'
    ],
    faqs: [
      {
        question: 'Who is required to file an Income Tax Return in India?',
        answer: 'Any individual whose gross total income before deductions exceeds the basic exemption limit (under Old or New Tax Regime), or who meets specific criteria like high electricity bills, foreign travel expenses, or deposits exceeding limits is legally required to file.'
      },
      {
        question: 'How do you handle Income Tax Scrutiny or Demand Notices?',
        answer: 'Our team conducts a thorough reconciliation of department notices with your books of accounts, prepares evidence-backed written submissions, and represents matters before the Faceless Assessment officers or CIT(Appeals).'
      }
    ],
    relatedServiceIds: ['tds-services', 'accounting', 'audit-assurance']
  },
  {
    id: 'gst-services',
    name: 'GST Services',
    category: 'Indirect Taxation',
    shortDesc: 'GST registration, return filing, compliance and advisory.',
    fullDesc: 'End-to-end Goods and Services Tax solutions encompassing registration, accurate input tax credit (ITC) reconciliation, periodic return filing, e-invoicing, and litigation support.',
    subServices: [
      'GST Registration (Regular & Composition)',
      'Monthly/Quarterly Return Filing (GSTR-1, GSTR-3B, GSTR-4)',
      'Annual Return & GST Reconciliation (GSTR-9 & GSTR-9C)',
      'Input Tax Credit (ITC) Optimization & 2B vs Books Reconciliation',
      'GST Refund for Exporters & Inverted Duty Structures',
      'E-Invoicing and E-Way Bill Implementation',
      'GST Department Notices, Summons & Appeal Assistance',
      'GST Health Check & Cross-Border Supply Advisory'
    ],
    documentsRequired: [
      'PAN & Aadhaar of Promoters / Partners / Directors',
      'Proof of Business Place (Electricity Bill / Rent Agreement / NOC)',
      'Bank Account Proof (Cancelled Cheque or First Page of Passbook)',
      'Certificate of Incorporation / Partnership Deed',
      'Sales and Purchase Registers with HSN/SAC codes'
    ],
    targetAudience: [
      'Traders, Wholesalers, and Retail Merchants',
      'Manufacturers and Industrial Units',
      'E-Commerce Sellers and Digital Service Providers',
      'Service Exporters and SEZ Units'
    ],
    deliverables: [
      'GSTIN Certificate generation and verified portal credentials',
      'Monthly GSTR-1 and GSTR-3B filed acknowledgments',
      'ITC reconciliation reports identifying supplier non-compliance',
      'Drafting and filing formal replies to GST ASMT/DRC notices'
    ],
    faqs: [
      {
        question: 'What is the turnover threshold for mandatory GST registration?',
        answer: 'For businesses supplying goods, the threshold is typically ₹40 Lakhs (₹20 Lakhs for special category states), and for service providers, it is ₹20 Lakhs (₹10 Lakhs for special category states).'
      },
      {
        question: 'Can you assist in recovering blocked Input Tax Credit (ITC)?',
        answer: 'Yes, we perform forensic vendor-level reconciliation between your purchase invoices and GSTR-2B, helping identify eligible pending credits and resolving mismatched filings.'
      }
    ],
    relatedServiceIds: ['income-tax', 'audit-assurance', 'startup-advisory']
  },
  {
    id: 'tds-services',
    name: 'TDS Services',
    category: 'Tax Withholding',
    shortDesc: 'TDS compliance, filing, reconciliation and advisory.',
    fullDesc: 'Comprehensive Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) services to prevent interest, penalties, and disallowances under the Income Tax Act.',
    subServices: [
      'TAN Application & Registration',
      'Quarterly TDS Return Filing (Form 24Q, 26Q, 27Q, 27EQ)',
      'TDS Certificate Generation (Form 16 & Form 16A)',
      'TDS Challan Payment Assistance & Verification',
      'TRACES Portal Default Resolution & Demand Rectification',
      'Section 194C, 194J, 194H, 194Q & 195 Advisory',
      'Foreign Remittance Certification (Form 15CA & 15CB)'
    ],
    documentsRequired: [
      'TAN of the deductor and PAN of deductees',
      'Monthly payment registers specifying nature of expense',
      'Challan details (BSR Code, Challan No., Tender Date)',
      'Vendor contracts or service agreement details'
    ],
    targetAudience: [
      'Corporate Employers and HR Departments',
      'Businesses contracting consultants and vendors',
      'Entities acquiring immovable properties (TDS u/s 194-IA)',
      'Companies executing foreign remittances'
    ],
    deliverables: [
      'Filed quarterly return acknowledgments',
      'Digitally signed Form 16 & 16A certificates',
      'Zero-default TRACES compliance verification'
    ],
    faqs: [
      {
        question: 'When must quarterly TDS returns be filed?',
        answer: 'Quarterly TDS returns are generally due on the 31st of the month following the end of each quarter (July 31, October 31, January 31, and May 31 for Q4).'
      }
    ],
    relatedServiceIds: ['income-tax', 'accounting']
  },
  {
    id: 'audit-assurance',
    name: 'Audit & Assurance',
    category: 'Assurance & Governance',
    shortDesc: 'Professional audit and assurance services for businesses and organizations.',
    fullDesc: 'Rigorous, independent audit and assurance services that enhance financial integrity, reinforce stakeholder confidence, and ensure statutory compliance.',
    subServices: [
      'Statutory Audit under Companies Act 2013',
      'Tax Audit under Section 44AB of Income Tax Act',
      'Internal Audit & Operational Risk Assessment',
      'Stock & Inventory Physical Verification Audit',
      'Financial Statement Review & Verification',
      'Management & Compliance Audit',
      'Due Diligence for Mergers, Acquisitions & Investments'
    ],
    documentsRequired: [
      'Audited Financial Statements of preceding years',
      'Trial Balance, General Ledgers, and Fixed Asset Register',
      'Statutory registers and board meeting minutes',
      'Bank confirmation certificates and loan sanction letters',
      'Internal control manuals and vendor agreements'
    ],
    targetAudience: [
      'Private and Public Limited Companies',
      'Trusts, Societies, and Non-Profit Entities',
      'Businesses requiring lender compliance and investor confidence',
      'Growing enterprises seeking robust internal controls'
    ],
    deliverables: [
      'Independent Auditor\'s Report in accordance with ICAI standards',
      'Tax Audit Report Form 3CA/3CB and Form 3CD',
      'Management Letter highlighting internal control observations',
      'Executive risk mitigation summary'
    ],
    faqs: [
      {
        question: 'When is a Tax Audit mandatory for businesses and professionals?',
        answer: 'Under Section 44AB, tax audit is mandatory if business turnover exceeds ₹1 Crore (or ₹10 Crores where digital transactions comprise 95%+ of receipts and payments), or if gross professional receipts exceed ₹50 Lakhs (or ₹75 Lakhs under presumptive provisions).'
      }
    ],
    relatedServiceIds: ['income-tax', 'accounting', 'roc-compliance']
  },
  {
    id: 'accounting',
    name: 'Accounting & Bookkeeping',
    category: 'Financial Management',
    shortDesc: 'Reliable bookkeeping, accounting and financial reporting solutions.',
    fullDesc: 'Precision bookkeeping, daily transaction management, MIS reporting, and preparation of financial statements adhering strictly to Indian Accounting Standards (Ind AS / AS).',
    subServices: [
      'Day-to-day Bookkeeping & Ledger Maintenance',
      'Accounting Outsourcing for Small & Medium Enterprises',
      'Bank, Credit Card & Gateway Reconciliations',
      'Monthly / Quarterly Management Information System (MIS) Reports',
      'Balance Sheet & Profit and Loss Statement Preparation',
      'Payroll Accounting, Salary Registers & Reimbursements',
      'Fixed Asset Accounting & Depreciation Calculations'
    ],
    documentsRequired: [
      'Sales and Purchase Invoices / Bills',
      'Bank Account Statements in electronic format',
      'Expense vouchers, petty cash slips, and payment receipts',
      'Payroll and attendance summaries',
      'Loan amortization schedules'
    ],
    targetAudience: [
      'Small and Medium Businesses (SMEs)',
      'Professional firms and medical clinics',
      'Overseas entities seeking India back-office accounting',
      'High-growth tech startups needing real-time financial tracking'
    ],
    deliverables: [
      'Updated accounting software ledgers (Tally / Zoho / QuickBooks)',
      'Monthly Cash Flow and P&L statements',
      'Periodic bank reconciliation reports',
      'Year-end audit-ready financial statement compilation'
    ],
    faqs: [
      {
        question: 'Can you work with our existing accounting software?',
        answer: 'Yes, our team is proficient with Tally Prime, Zoho Books, QuickBooks, Busy, and enterprise ERP systems, enabling seamless integration without disrupting your operations.'
      }
    ],
    relatedServiceIds: ['income-tax', 'gst-services', 'loan-financing']
  },
  {
    id: 'roc-compliance',
    name: 'ROC & Compliance',
    category: 'Corporate Secretarial',
    shortDesc: 'Company and LLP compliance, secretarial filings and corporate governance.',
    fullDesc: 'End-to-end secretarial and Ministry of Corporate Affairs (MCA) compliance support to keep your company or LLP in good legal standing.',
    subServices: [
      'Company Incorporation (Private Limited, OPC, Section 8)',
      'Limited Liability Partnership (LLP) Registration',
      'Annual ROC Filings (AOC-4, MGT-7, Form 11, Form 8)',
      'Director KYC (DIR-3 KYC) and Din Activations',
      'Event-Based Filings (Director Addition/Removal, Registered Office Change)',
      'Share Capital Alteration & Allotment of Shares (PAS-3)',
      'Strike Off & Winding Up Formalities'
    ],
    documentsRequired: [
      'Digital Signature Certificates (DSC) of Directors/Designated Partners',
      'PAN, Aadhaar and Address Proof of Directors',
      'MOA and AOA of Company / LLP Agreement',
      'Audited Financial Statements and Directors\' Report'
    ],
    targetAudience: [
      'Private Limited Companies & One Person Companies (OPC)',
      'Limited Liability Partnerships (LLP)',
      'Foreign subsidiaries establishing presence in India'
    ],
    deliverables: [
      'MCA SRN generation and approval challans',
      'Annual return filing receipts',
      'Updated corporate registers and statutory records'
    ],
    faqs: [
      {
        question: 'What are the consequences of not filing annual ROC returns?',
        answer: 'Delay or non-filing invites heavy recurring daily additional fees, disqualification of directors under Section 164, and potential striking off of the company by the Registrar.'
      }
    ],
    relatedServiceIds: ['startup-advisory', 'audit-assurance']
  },
  {
    id: 'registrations-licenses',
    name: 'Registrations & Licenses',
    category: 'Regulatory Licensing',
    shortDesc: 'Business registrations and regulatory documentation support.',
    fullDesc: 'Comprehensive licensing support for launching and operating businesses legally in Maharashtra and across all Indian states.',
    subServices: [
      'MSME / Udyam Registration for Priority Sector Benefits',
      'Maharashtra Professional Tax (PTRC & PTEC) Registration',
      'Shop & Establishment Registration (Gumasta License)',
      'Import Export Code (IEC) from DGFT',
      'FSSAI Food License Registration',
      'PAN & TAN Processing for New Entities',
      'Trade Licenses & Municipal Permits'
    ],
    documentsRequired: [
      'Aadhaar and PAN of business owner / authorized signatory',
      'Proof of commercial address & utility bill',
      'Bank account cancelled cheque',
      'Partnership Deed / Incorporation Certificate'
    ],
    targetAudience: [
      'New business entrants and sole proprietors',
      'Retail shops, restaurants and service centers in Mumbai',
      'Importers, exporters and e-commerce traders'
    ],
    deliverables: [
      'Government verified registration certificates',
      'Guidance on periodic renewals and exemptions'
    ],
    faqs: [
      {
        question: 'What are the benefits of MSME Udyam Registration?',
        answer: 'Benefits include collateral-free bank loans under CGTMSE, interest rate concessions, protection against delayed payments from buyers, and government tender exemptions.'
      }
    ],
    relatedServiceIds: ['startup-advisory', 'gst-services']
  },
  {
    id: 'loan-financing',
    name: 'Loan & Financing Support',
    category: 'Financial Advisory',
    shortDesc: 'Financial statements, projections and documentation support for financing.',
    fullDesc: 'Specialized preparation of CMA data, bank financial reports, and viable project reports for securing working capital, term loans, and credit facilities from nationalized and private banks.',
    subServices: [
      'CMA Data (Credit Monitoring Arrangement) Preparation',
      'Projected Financial Statements & Cash Flow Projections',
      'Detailed Project Reports (DPR) for Bank Term Loans',
      'Working Capital Loan Documentation (Cash Credit / Overdraft)',
      'Loan Restructuring and Debt Syndication Advisory',
      'Net Worth Certificates and CA Financial Attestations',
      'Liaison and Query Resolution with Bank Credit Managers'
    ],
    documentsRequired: [
      'Audited Balance Sheet & P&L for past 3 financial years',
      'Sanction letters of existing credit facilities',
      'Projections of revenue, capacity utilization and expansion plans',
      'Quotations for machinery/assets to be financed',
      'GST returns and bank statements for last 12 months'
    ],
    targetAudience: [
      'Manufacturers expanding production capacities',
      'Traders needing enhanced Cash Credit / Overdraft limits',
      'Real estate developers and contractors seeking project finance',
      'SMEs and business owners applying for MSME credit schemes'
    ],
    deliverables: [
      'Multi-year CMA format report with key financial ratios',
      'Bank-ready Debt Service Coverage Ratio (DSCR) analysis',
      'CA signed net worth statements and certified projections'
    ],
    faqs: [
      {
        question: 'What is CMA Data and why do banks demand it?',
        answer: 'Credit Monitoring Arrangement (CMA) data provides a detailed analytical review of past performance, current financial standing, and multi-year future projections that banks use to assess creditworthiness and determine working capital eligibility.'
      }
    ],
    relatedServiceIds: ['accounting', 'audit-assurance', 'startup-advisory']
  },
  {
    id: 'startup-advisory',
    name: 'Startup Advisory',
    category: 'Entrepreneurial Growth',
    shortDesc: 'Practical accounting, taxation and compliance support for growing businesses.',
    fullDesc: 'Strategic financial and legal scaffolding for high-growth ventures — from optimal entity structuring to DPIIT startup recognition, angel tax exemption, and investor-ready financial models.',
    subServices: [
      'Optimal Business Structuring (Sole Prop vs LLP vs Pvt Ltd)',
      'DPIIT Startup India Recognition & Tax Holiday Advisory (Section 80-IAC)',
      'Founder Equity & Co-Founder Agreement Advisory',
      'Accounting & Financial Systems Blueprint Setup',
      'Valuation Reports and Cap Table Management',
      'Investor Due Diligence Preparation & Data Room Curation',
      'Regulatory Compliance Calendar Setup'
    ],
    documentsRequired: [
      'Pitch deck and business model overview',
      'Founder KYC credentials',
      'Draft cap table / shareholding breakdown',
      'Intellectual property / innovation patent or proof (for DPIIT)'
    ],
    targetAudience: [
      'Early-stage tech and consumer startups',
      'Bootstrapped founders scaling to institutional funding',
      'Incubator and accelerator cohort members'
    ],
    deliverables: [
      'DPIIT recognition certificate assistance',
      'Scalable chart of accounts and internal financial controls',
      'Tax-optimized equity distribution structure'
    ],
    faqs: [
      {
        question: 'How does Startup India DPIIT recognition help our business?',
        answer: 'DPIIT recognized startups can access 3 consecutive years of 100% tax exemption under Section 80-IAC, exemption from Angel Tax under Section 56(2)(viib), fast-tracked patent applications, and access to the Fund of Funds scheme.'
      }
    ],
    relatedServiceIds: ['roc-compliance', 'income-tax', 'loan-financing']
  }
];

export const INDUSTRIES_SERVED = [
  {
    name: 'Startups & Entrepreneurs',
    desc: 'Scalable entity structuring, DPIIT recognition, investor due diligence and automated compliance.',
    icon: 'Rocket'
  },
  {
    name: 'Retail & Trading',
    desc: 'Multi-store GST compliance, stock verification, E-Way bills and vendor credit reconciliation.',
    icon: 'ShoppingBag'
  },
  {
    name: 'Manufacturing',
    desc: 'Cost audit readiness, working capital CMA preparation, inventory valuation and ITC optimization.',
    icon: 'Factory'
  },
  {
    name: 'Real Estate & Infrastructure',
    desc: 'Joint development agreement tax planning, RERA compliance coordination and project finance documentation.',
    icon: 'Building2'
  },
  {
    name: 'Professional Services',
    desc: 'Doctors, advocates, architects, and IT consultants: Presumptive taxation u/s 44ADA and advance tax planning.',
    icon: 'Briefcase'
  },
  {
    name: 'Healthcare & Pharma',
    desc: 'Specialized clinic accounting, GST exemption analysis for healthcare services and medical stock audit.',
    icon: 'Activity'
  },
  {
    name: 'Technology & SaaS',
    desc: 'Export of services compliance, foreign remittances (Form 15CA/CB), transfer pricing and IP valuation.',
    icon: 'Cpu'
  },
  {
    name: 'FMCG & Distribution',
    desc: 'High-volume invoice processing, distributor ledger reconciliation and supply-chain tax structuring.',
    icon: 'PackageCheck'
  },
  {
    name: 'Hospitality & Restaurants',
    desc: 'Restaurant GST compliance, food license guidance, payroll management and point-of-sale accounting.',
    icon: 'Utensils'
  },
  {
    name: 'Other Businesses & Organizations',
    desc: 'Trusts, NGOs, educational institutions, and cooperative housing societies seeking transparent accounting.',
    icon: 'Building'
  }
];

export const WHO_WE_HELP = [
  {
    title: 'Individuals',
    desc: 'Salaried professionals, HNIs, and property sellers requiring accurate ITR filing, capital gains exemptions, and tax notice resolution.'
  },
  {
    title: 'Businesses',
    desc: 'Proprietorships, partnerships, and trading concerns seeking disciplined bookkeeping, GST compliance, and periodic financial reviews.'
  },
  {
    title: 'Startups',
    desc: 'Founders needing entity incorporation, DPIIT registration, initial accounting setup, and ongoing compliance.'
  },
  {
    title: 'Professionals',
    desc: 'Medical doctors, legal consultants, software architects, and designers benefiting from Section 44ADA and tax structuring.'
  },
  {
    title: 'Companies',
    desc: 'Private and public limited companies needing statutory audit, tax audit, ROC filings, and board compliance management.'
  },
  {
    title: 'Borrowers',
    desc: 'Enterprises preparing CMA data, bank financial projections, and net worth certificates for credit facility sanctions.'
  }
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Understand',
    desc: 'We understand your requirement, business structure and objectives through an initial discovery discussion.'
  },
  {
    step: '02',
    title: 'Analyse',
    desc: 'We review financial, tax and compliance requirements to identify potential risks, exemptions and optimal pathways.'
  },
  {
    step: '03',
    title: 'Execute',
    desc: 'We prepare, verify and manage the required work and documentation with meticulous accuracy.'
  },
  {
    step: '04',
    title: 'Support',
    desc: 'We continue to assist with ongoing compliance, department clarifications, and proactive advisory requirements.'
  }
];

export const CLIENT_TESTIMONIALS = [
  {
    quote: 'PANJIYAR KRISHNA & CO. streamlined our entire multi-state GST and quarterly TDS compliance without a single hitch. CA Krishna Panjiyar brings deep precision and genuine care to every consultation.',
    author: 'Rajesh V. Sharma',
    role: 'Managing Director, Horizon Engineering & Trading',
    city: 'Mumbai',
    rating: 5
  },
  {
    quote: 'Preparing our CMA data and loan documentation for a working capital limit enhancement was executed flawlessly. The bank approved our facility within record time thanks to their impeccable financial compilation.',
    author: 'Neelam K. Mehta',
    role: 'Co-Founder & COO, Apex Precision Components',
    city: 'Andheri, Mumbai',
    rating: 5
  },
  {
    quote: 'As a fast-growing IT consultancy, navigating international service invoices and 15CA/CB documentation felt daunting until we partnered with PANJIYAR KRISHNA & CO. Their PAN India support is truly responsive.',
    author: 'Amitava Sen',
    role: 'Principal Architect, CloudBridge Solutions',
    city: 'Bengaluru / Mumbai',
    rating: 5
  },
  {
    quote: 'Accurate, transparent, and highly accessible. When we received an unexpected income tax notice, their team analysed our ledgers, prepared a point-by-point reply, and resolved it smoothly.',
    author: 'Dr. Sunita Deshmukh',
    role: 'Medical Director, Lifeline Health Clinic',
    city: 'Mumbai',
    rating: 5
  }
];

export const GENERAL_FAQS = [
  {
    question: 'What services does PANJIYAR KRISHNA & CO. provide?',
    answer: 'We provide a comprehensive range of professional Chartered Accountancy services including Income Tax planning and filing, GST compliance and advisory, TDS management, Statutory and Internal Audits, Bookkeeping and Accounting, ROC & Corporate Compliance, Loan & Financing (CMA Data), and Startup Advisory.'
  },
  {
    question: 'Do you provide GST registration and filing services?',
    answer: 'Yes, we provide end-to-end GST solutions including new GST registration, monthly GSTR-1 and GSTR-3B filings, annual GSTR-9/9C returns, input tax credit (ITC) reconciliation, e-invoicing setup, and assistance with GST notices.'
  },
  {
    question: 'Do you help with income tax return filing?',
    answer: 'Yes, we handle ITR filing for individuals, salaried employees, professionals, partnership firms, and corporate entities, ensuring thorough review of 26AS, AIS/TIS, and lawful deductions to minimize tax liabilities.'
  },
  {
    question: 'Do you provide accounting and bookkeeping services?',
    answer: 'Yes, we offer both dedicated bookkeeping and outsourced accounting solutions. We maintain ledgers, conduct bank and gateway reconciliations, and prepare monthly MIS reports and year-end balance sheets.'
  },
  {
    question: 'Do you assist businesses with loan documentation?',
    answer: 'Yes, we prepare specialized Credit Monitoring Arrangement (CMA) data, multi-year projected financial statements, cash flow statements, and CA-certified net worth reports required by banks for credit approvals.'
  },
  {
    question: 'Do you provide startup registration and advisory?',
    answer: 'Yes, from business structuring and company incorporation to DPIIT Startup India registration, angel tax planning, and accounting setup, we help early-stage ventures establish solid financial foundations.'
  },
  {
    question: 'Do you provide PAN India services?',
    answer: 'Yes, PANJIYAR KRISHNA & CO. serves clients across India through digitized cloud collaboration, remote audit protocols, and electronic filing systems while maintaining personalized attention.'
  },
  {
    question: 'How can I book a consultation?',
    answer: 'You can book a consultation directly through the "Book a Consultation" button on this website, call CA Krishna Panjiyar directly at 600310815 or 8876808572, or email us at cakrishanpanjiyar@gmail.com.'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Rajesh Singhal',
    role: 'Managing Director',
    company: 'Apex Precision Engineering',
    location: 'Mumbai, MH',
    rating: 5,
    content: 'CA Krishna Panjiyar has been handling our corporate tax audits and GST reconciliations flawlessly. His direct attention and deep knowledge of industrial compliance saved us substantial time and penalties.'
  },
  {
    name: 'Dr. Sunita Deshmukh',
    role: 'Medical Director & Founder',
    company: 'Arogya Diagnostics',
    location: 'Pune / Mumbai',
    rating: 5,
    content: 'Professional, responsive, and completely transparent. As medical specialists, tax structuring was complex for us until CA Krishna stepped in. Highly recommended for any professional practice.'
  },
  {
    name: 'Vikram Mehta',
    role: 'Co-Founder & CEO',
    company: 'FinStack Tech Labs',
    location: 'Bengaluru / Mumbai',
    rating: 5,
    content: 'From DPIIT registration and startup valuation to CMA data preparation for our bank line, PANJIYAR KRISHNA & CO. delivered institutional-grade accuracy under very tight investor deadlines.'
  }
];

export const INITIAL_CLIENT_DOCUMENTS: ClientDocument[] = [
  {
    id: 'DOC-2026-881',
    title: 'Financial Statements FY 2025-26 (Audited Draft)',
    category: 'Audit Report',
    clientName: 'Apex Precision Components',
    uploadDate: '2026-09-24',
    fileSize: '4.2 MB',
    sha256Hash: '9e4d1f8a85702b8006e8b789139178bbec5a452ef893a776c117094cbcf89230',
    encryptionStandard: 'AES-256-GCM (Zero-Knowledge Stored)',
    verificationStatus: 'Verified',
    reviewedBy: 'CA Krishna Panjiyar',
    notes: 'Balance sheet reconciliation approved. Form 3CD prepared.'
  },
  {
    id: 'DOC-2026-882',
    title: 'GST GSTR-3B & Input Credit Register Q2',
    category: 'GST',
    clientName: 'Horizon Engineering & Trading',
    uploadDate: '2026-09-26',
    fileSize: '2.8 MB',
    sha256Hash: '6d9b4b08709a3cf34b9d0339d10738096f30a9117a7aef14cfaeb8340d87a229',
    encryptionStandard: 'AES-256-GCM (Zero-Knowledge Stored)',
    verificationStatus: 'Verified',
    reviewedBy: 'CA Krishna Panjiyar',
    notes: '2B vs Purchase register mismatch checked and corrected.'
  },
  {
    id: 'DOC-2026-883',
    title: 'Bank Sanction Letter & CMA Projection Model',
    category: 'CMA/Loan',
    clientName: 'AeroLine LogiTech Pvt Ltd',
    uploadDate: '2026-09-28',
    fileSize: '5.1 MB',
    sha256Hash: 'c71f98bc198f3992fa449b8ce6285a9735d4ef879782b7b8364e528570d8a573',
    encryptionStandard: 'AES-256-GCM (Zero-Knowledge Stored)',
    verificationStatus: 'Under CA Review',
    reviewedBy: 'Staff CA Team',
    notes: 'DSCR ratio calculation verification in progress.'
  },
  {
    id: 'DOC-2026-884',
    title: 'Form 16 & Capital Gains Broker Ledger 2025-26',
    category: 'ITR',
    clientName: 'Dr. Sunita Deshmukh',
    uploadDate: '2026-09-28',
    fileSize: '1.9 MB',
    sha256Hash: '1a384bf782c3f81e812d8a4358a99478fcf868352b21c5b8b93933e144a88f5d',
    encryptionStandard: 'AES-256-GCM (Zero-Knowledge Stored)',
    verificationStatus: 'Verified',
    reviewedBy: 'CA Krishna Panjiyar',
    notes: 'AIS cross-verification complete. Zero discrepancy.'
  }
];

export const SECURITY_AUDIT_LOGS: SecurityAuditEntry[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-09-29 04:15 UTC',
    checkType: 'AES-256 GCM Cryptographic Checksum',
    system: 'Document Storage Vault',
    status: 'PASSED',
    details: 'All stored documents verified against SHA-256 immutable hashes. Zero data drift.'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-09-29 03:00 UTC',
    checkType: 'Role-Based Access Control (RBAC) Audit',
    system: 'Authentication Gateway',
    status: 'OPTIMAL',
    details: 'Zero privilege escalation detected across client, staff CA, and managing partner sessions.'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-09-28 22:30 UTC',
    checkType: 'Information Technology Act 2000 Compliance',
    system: 'Regulatory Secret Vault',
    status: 'VERIFIED',
    details: 'Digital verification records and audit logs compliant with Section 43A and Section 72A.'
  },
  {
    id: 'AUD-904',
    timestamp: '2026-09-28 18:00 UTC',
    checkType: 'End-to-End In-Transit Encryption Audit',
    system: 'TLS 1.3 Transport Pipeline',
    status: 'PASSED',
    details: 'Perfect forward secrecy enabled; legacy ciphers rejected.'
  }
];

// Re-export OUR_OFFICES for convenience
export { OUR_OFFICES, type OfficeLocation } from './indiaMapData';

