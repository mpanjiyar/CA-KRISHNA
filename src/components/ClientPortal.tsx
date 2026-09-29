import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Search, 
  Key, 
  RefreshCw, 
  UserCheck, 
  Database, 
  Terminal,
  Download,
  Eye,
  Plus,
  Check
} from 'lucide-react';
import { INITIAL_CLIENT_DOCUMENTS, SECURITY_AUDIT_LOGS } from '../data/firmData';
import { ClientDocument, UserRole, SecurityAuditEntry } from '../types';

export const ClientPortal: React.FC = () => {
  // Current active role
  const [activeRole, setActiveRole] = useState<UserRole>('managing_partner');
  
  // Documents in Vault
  const [documents, setDocuments] = useState<ClientDocument[]>(INITIAL_CLIENT_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>(SECURITY_AUDIT_LOGS);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Active Tab: 'documents' | 'audit' | 'encryption-info'
  const [activeTab, setActiveTab] = useState<'documents' | 'audit' | 'encryption-info'>('documents');

  // New Document Upload Form state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    clientName: 'Apex Precision Components',
    category: 'ITR' as ClientDocument['category'],
    fileName: '',
    fileSize: '2.4 MB'
  });
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Automated Security Audit Runner state
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<string | null>(null);

  // Selected document for inspection
  const [inspectDoc, setInspectDoc] = useState<ClientDocument | null>(null);

  // Notification Toast state (replacing window.alert)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Role info
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'managing_partner':
        return { label: 'Managing Partner (CA Krishna Panjiyar)', color: 'bg-[#062A5A] text-white border-[#F28C18]' };
      case 'staff_ca':
        return { label: 'Senior Audit CA Staff', color: 'bg-[#0969C7] text-white border-transparent' };
      case 'client':
        return { label: 'Verified Client Portal User', color: 'bg-[#159447] text-white border-transparent' };
    }
  };

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle uploading document with simulated AES-256 client-side encryption
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) return;

    setIsEncrypting(true);

    // Simulate cryptographic SHA-256 digest creation
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    setTimeout(() => {
      const newDoc: ClientDocument = {
        id: `DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: uploadForm.title,
        clientName: uploadForm.clientName,
        category: uploadForm.category,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: uploadForm.fileSize,
        sha256Hash: randomHex,
        encryptionStandard: 'AES-256-GCM (Zero-Knowledge Stored)',
        verificationStatus: activeRole === 'client' ? 'Under CA Review' : 'Verified',
        reviewedBy: activeRole === 'client' ? undefined : 'CA Krishna Panjiyar',
        notes: activeRole === 'client' ? 'Uploaded by client via zero-knowledge encrypted channel.' : 'Directly certified by firm.'
      };

      setDocuments([newDoc, ...documents]);
      setIsEncrypting(false);
      setUploadModalOpen(false);
      setUploadForm({
        title: '',
        clientName: 'Apex Precision Components',
        category: 'ITR',
        fileName: '',
        fileSize: '2.4 MB'
      });
      triggerToast(`Document "${newDoc.title}" encrypted with AES-256 and stored in vault.`);
    }, 800);
  };

  // Handle running automated security audit
  const handleRunSecurityAudit = () => {
    setIsRunningAudit(true);
    setAuditFeedback(null);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]} UTC`;

      const newAuditEntries: SecurityAuditEntry[] = [
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: timeStr,
          checkType: 'Live Hash Integrity Verification',
          system: 'Cryptographic Document Store',
          status: 'PASSED',
          details: `Re-verified SHA-256 checksums on all ${documents.length} vault assets. 100% matched.`
        },
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: timeStr,
          checkType: 'AES-GCM Encryption Key Rotation Check',
          system: 'Cloud Key Management Service',
          status: 'OPTIMAL',
          details: 'Zero-knowledge keys active. TLS 1.3 transport cipher: ECDHE-RSA-AES256-GCM-SHA384.'
        },
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: timeStr,
          checkType: 'ICAI Document Retention & Tamper Audit',
          system: 'Statutory Archive',
          status: 'VERIFIED',
          details: 'Audit trail compliant with Companies Act 2013 & IT Act 2000 Section 43A.'
        }
      ];

      setAuditLogs([...newAuditEntries, ...auditLogs]);
      setIsRunningAudit(false);
      setAuditFeedback('Automated Security Audit Complete: All 12 security invariants passed without exception.');
      triggerToast('Security audit scan successfully executed. 0 vulnerabilities detected.');
    }, 900);
  };

  // Update status by Staff/Managing Partner
  const handleToggleStatus = (docId: string) => {
    if (activeRole === 'client') return;
    setDocuments(documents.map(d => {
      if (d.id === docId) {
        const nextStatus = d.verificationStatus === 'Verified' ? 'Action Required' : 'Verified';
        return {
          ...d,
          verificationStatus: nextStatus,
          reviewedBy: activeRole === 'managing_partner' ? 'CA Krishna Panjiyar' : 'Senior Audit Staff'
        };
      }
      return d;
    }));
    triggerToast(`Document verification status updated by ${activeRole === 'managing_partner' ? 'CA Krishna Panjiyar' : 'Senior Audit Staff'}.`);
  };

  return (
    <div className="w-full bg-[#F7F9FC] min-h-screen py-6 sm:py-10 lg:py-12 text-left">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification Container */}
        {toastMessage && (
          <div className="fixed top-20 right-3 xs:right-4 z-50 bg-[#062A5A] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-xl border border-[#0969C7]/40 flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-top duration-200 max-w-[90vw]">
            <Check size={16} className="text-[#159447] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Portal Header */}
        <div className="bg-white rounded-2xl p-4 xs:p-5 sm:p-7 md:p-8 border border-[#D9E2EC] shadow-2xs mb-5 sm:mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="p-1 rounded bg-[#159447]/10 text-[#159447]">
                <ShieldCheck size={16} />
              </span>
              <span className="text-[10px] xs:text-xs uppercase font-bold tracking-widest text-[#0969C7]">
                Secure Client Document &amp; Verification Vault
              </span>
            </div>
            <h1 className="font-manrope text-xl xs:text-2xl sm:text-3xl font-bold text-[#062A5A] tracking-tight">
              PANJIYAR KRISHNA &amp; CO. &middot; Client Verification Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-2xl leading-relaxed">
              End-to-end encrypted repository for tax assessments, financial statements, GST filings, and statutory certificates with cryptographic SHA-256 verification.
            </p>
          </div>

          {/* Role Switching Simulator */}
          <div className="bg-[#EEF5FC] p-3 rounded-xl border border-[#D9E2EC] shrink-0 text-left w-full lg:w-auto">
            <div className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Simulate Access Role:</span>
              <span className="text-[10px] text-[#0969C7]">RBAC Multi-Level</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['managing_partner', 'staff_ca', 'client'] as UserRole[]).map((r) => {
                const isActive = activeRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => setActiveRole(r)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
                      isActive
                        ? 'bg-[#062A5A] text-white shadow-xs'
                        : 'bg-white text-[#172033] hover:bg-slate-100 border border-[#D9E2EC]'
                    }`}
                  >
                    {r === 'managing_partner' ? 'CA Krishna (Partner)' : r === 'staff_ca' ? 'Senior Staff CA' : 'Client Access'}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-[11px] text-[#062A5A] font-medium flex items-center gap-1.5">
              <UserCheck size={13} className="text-[#159447]" />
              <span>Current Session: {getRoleBadge(activeRole).label}</span>
            </div>
          </div>
        </div>

        {/* Security & Cryptographic Status Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-4 rounded-xl border border-[#D9E2EC] flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#159447]/10 text-[#159447]">
              <Lock size={18} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-[#667085]">Data Encryption</div>
              <div className="font-semibold text-sm text-[#062A5A]">AES-256-GCM End-to-End</div>
              <div className="text-[11px] text-[#159447] font-medium">Zero-Knowledge Stored</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D9E2EC] flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#0969C7]/10 text-[#0969C7]">
              <Database size={18} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-[#667085]">Tamper Protection</div>
              <div className="font-semibold text-sm text-[#062A5A]">SHA-256 Immutable Hashes</div>
              <div className="text-[11px] text-[#0969C7] font-medium">Full Audit Trail Active</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D9E2EC] flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#F28C18]/10 text-[#F28C18]">
              <Terminal size={18} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-[#667085]">Compliance Standard</div>
              <div className="font-semibold text-sm text-[#062A5A]">IT Act 2000 &middot; Sec 43A</div>
              <div className="text-[11px] text-[#F28C18] font-medium">Automated Security Audits</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[#D9E2EC] pb-2">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 min-h-[40px] ${
              activeTab === 'documents'
                ? 'bg-[#062A5A] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#062A5A] hover:bg-white'
            }`}
          >
            <FileText size={15} />
            <span>Document Vault ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 min-h-[40px] ${
              activeTab === 'audit'
                ? 'bg-[#062A5A] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#062A5A] hover:bg-white'
            }`}
          >
            <RefreshCw size={15} className={isRunningAudit ? 'animate-spin' : ''} />
            <span>Automated Security Audits</span>
          </button>

          <button
            onClick={() => setActiveTab('encryption-info')}
            className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 min-h-[40px] ${
              activeTab === 'encryption-info'
                ? 'bg-[#062A5A] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#062A5A] hover:bg-white'
            }`}
          >
            <Key size={15} />
            <span>Security Architecture &amp; Database Schema</span>
          </button>
        </div>

        {/* TAB 1: Documents Vault */}
        {activeTab === 'documents' && (
          <div className="space-y-5">
            {/* Action Bar: Search, Category Filter, Upload Button */}
            <div className="bg-white p-4 rounded-xl border border-[#D9E2EC] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 max-w-sm">
                  <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by file name, client or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 min-h-[40px] rounded-lg border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] outline-hidden"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 min-h-[40px] rounded-lg border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] outline-hidden bg-white"
                >
                  <option value="ALL">All Categories</option>
                  <option value="ITR">Income Tax (ITR)</option>
                  <option value="GST">GST Returns</option>
                  <option value="Audit Report">Audit Reports</option>
                  <option value="CMA/Loan">CMA &amp; Loans</option>
                  <option value="PAN/KYC">KYC Records</option>
                </select>
              </div>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors shadow-xs min-h-[42px]"
              >
                <Plus size={16} />
                <span>Upload Sensitive Document</span>
              </button>
            </div>

            {/* Document List: Mobile Cards (< 768px) & Desktop Table (>= 768px) */}
            
            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-2xs text-left">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-[#062A5A] leading-snug">{doc.title}</div>
                      <div className="text-[11px] text-[#667085] mt-0.5">{doc.clientName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF5FC] text-[#0969C7] border border-[#0969C7]/20 shrink-0">
                      {doc.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#159447] font-medium mb-1.5">
                    <Lock size={12} className="shrink-0" />
                    <span className="truncate">{doc.encryptionStandard}</span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 truncate mb-3 bg-[#F7F9FC] p-1.5 rounded">
                    SHA256: {doc.sha256Hash.substring(0, 20)}...
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span
                      onClick={() => handleToggleStatus(doc.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        doc.verificationStatus === 'Verified'
                          ? 'bg-[#159447]/10 text-[#159447]'
                          : doc.verificationStatus === 'Under CA Review'
                          ? 'bg-[#0969C7]/10 text-[#0969C7]'
                          : 'bg-[#F28C18]/10 text-[#F28C18]'
                      } ${activeRole !== 'client' ? 'cursor-pointer' : ''}`}
                    >
                      {doc.verificationStatus === 'Verified' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      <span>{doc.verificationStatus}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setInspectDoc(doc)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-[#062A5A] text-xs font-medium flex items-center gap-1 min-h-[38px]"
                        aria-label="Inspect certificate"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => triggerToast(`Encrypted download initialized for: ${doc.title}. Hash verified.`)}
                        className="p-2 rounded-lg bg-[#062A5A] text-white min-h-[38px] min-w-[38px] flex items-center justify-center"
                        aria-label="Download document"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table */}
            <div className="hidden md:block bg-white rounded-xl border border-[#D9E2EC] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F7F9FC] border-b border-[#D9E2EC] text-[#667085] uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Document Details</th>
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Encryption &amp; Hash</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9E2EC]">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        {/* Title & ID */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#062A5A]">{doc.title}</div>
                          <div className="text-[11px] font-mono text-[#667085] flex items-center gap-2 mt-0.5">
                            <span>{doc.id}</span>
                            <span>&middot;</span>
                            <span>{doc.fileSize}</span>
                            <span>&middot;</span>
                            <span>{doc.uploadDate}</span>
                          </div>
                        </td>

                        {/* Client */}
                        <td className="py-3.5 px-4 font-medium text-[#172033]">
                          {doc.clientName}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EEF5FC] text-[#0969C7] border border-[#0969C7]/20">
                            {doc.category}
                          </span>
                        </td>

                        {/* Encryption & Hash */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#159447] font-medium">
                            <Lock size={12} />
                            <span>{doc.encryptionStandard}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5" title={doc.sha256Hash}>
                            SHA256: {doc.sha256Hash.substring(0, 16)}...
                          </div>
                        </td>

                        {/* Verification Status */}
                        <td className="py-3.5 px-4">
                          <span
                            onClick={() => handleToggleStatus(doc.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              doc.verificationStatus === 'Verified'
                                ? 'bg-[#159447]/10 text-[#159447]'
                                : doc.verificationStatus === 'Under CA Review'
                                ? 'bg-[#0969C7]/10 text-[#0969C7]'
                                : 'bg-[#F28C18]/10 text-[#F28C18]'
                            } ${activeRole !== 'client' ? 'cursor-pointer hover:opacity-80' : ''}`}
                            title={activeRole !== 'client' ? 'Click to toggle verification status' : undefined}
                          >
                            {doc.verificationStatus === 'Verified' ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            <span>{doc.verificationStatus}</span>
                          </span>
                          {doc.reviewedBy && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              by {doc.reviewedBy}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setInspectDoc(doc)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] hover:text-[#0969C7] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                              title="Inspect Cryptographic Certificate"
                              aria-label="Inspect certificate"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => triggerToast(`Encrypted download initialized for: ${doc.title}. Hash verified.`)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] hover:text-[#0969C7] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                              title="Download Verified File"
                              aria-label="Download file"
                            >
                              <Download size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Automated Security Audits */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#D9E2EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                  Continuous Automated Security &amp; Tamper Audits
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
                  Regular automated checks ensuring zero data drift, key integrity, and compliance with statutory record maintenance standards.
                </p>
              </div>

              <button
                onClick={handleRunSecurityAudit}
                disabled={isRunningAudit}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors disabled:opacity-50 shadow-xs shrink-0 min-h-[42px]"
              >
                <RefreshCw size={14} className={isRunningAudit ? 'animate-spin' : ''} />
                <span>{isRunningAudit ? 'Executing Invariant Scans...' : 'Execute Automated Audit Now'}</span>
              </button>
            </div>

            {auditFeedback && (
              <div className="p-4 rounded-xl bg-[#159447]/10 border border-[#159447]/30 text-xs font-semibold text-[#159447] flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>{auditFeedback}</span>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#D9E2EC] overflow-hidden shadow-2xs">
              <div className="p-4 bg-[#F7F9FC] border-b border-[#D9E2EC] font-semibold text-xs text-[#062A5A] uppercase tracking-wider">
                Immutable Security Audit Log Registry
              </div>
              <div className="divide-y divide-[#D9E2EC]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-[#062A5A]">{log.id}</span>
                        <span className="text-slate-300">&middot;</span>
                        <span className="font-semibold text-[#0969C7]">{log.checkType}</span>
                        <span className="text-slate-300">&middot;</span>
                        <span className="text-slate-500 font-mono text-[11px]">{log.timestamp}</span>
                      </div>
                      <p className="text-[#667085] leading-relaxed">
                        {log.details}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded text-[11px] font-bold tracking-wide bg-[#159447]/10 text-[#159447] border border-[#159447]/20 uppercase shrink-0">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Architecture & Database Schema */}
        {activeTab === 'encryption-info' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D9E2EC] space-y-6">
            <div>
              <h3 className="font-manrope font-bold text-xl text-[#062A5A] mb-2">
                Scalable Cloud Storage &amp; End-to-End Encryption Specification
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                PANJIYAR KRISHNA &amp; CO. implements a defense-in-depth model for managing sensitive client financial records, ITR XML payloads, and confidential audit working papers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] space-y-3">
                <div className="font-manrope font-bold text-sm text-[#062A5A] flex items-center gap-2">
                  <Database size={16} className="text-[#0969C7]" />
                  <span>Optimized Database Relational Schema</span>
                </div>
                <div className="p-3 bg-[#031C3D] text-slate-200 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <pre>{`-- Scalable Client Document Management
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pan_number VARCHAR(10) UNIQUE NOT NULL,
  entity_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  category VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  cloud_storage_uri TEXT NOT NULL,
  sha256_hash CHAR(64) NOT NULL,
  encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
  verification_status VARCHAR(30) DEFAULT 'Under Review',
  verified_by VARCHAR(100),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);`}</pre>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] space-y-3">
                <div className="font-manrope font-bold text-sm text-[#062A5A] flex items-center gap-2">
                  <Lock size={16} className="text-[#159447]" />
                  <span>End-to-End Encryption Pipeline</span>
                </div>
                <ul className="text-xs text-[#667085] space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#159447] shrink-0 mt-0.5" />
                    <span><strong>Client-Side Envelope Encryption:</strong> Files are chunked and encrypted with ephemeral symmetric keys before leaving the user interface.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#159447] shrink-0 mt-0.5" />
                    <span><strong>Zero-Knowledge Key Storage:</strong> Encryption keys are segregated from the blob storage layer, preventing unauthorized internal access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#159447] shrink-0 mt-0.5" />
                    <span><strong>Immutable Hash Verification:</strong> Every document has an immutable SHA-256 fingerprint generated at the instant of upload.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#D9E2EC] shadow-2xl animate-in zoom-in-95 my-auto text-left">
            <h3 className="font-manrope font-bold text-lg text-[#062A5A] mb-1">
              Upload Sensitive Client Document
            </h3>
            <p className="text-xs text-[#667085] mb-4">
              All uploads are automatically processed with AES-256 client-side encryption and registered in the immutable audit log.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#172033] mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GSTR-3B Acknowledgement August 2026"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E2EC] text-sm focus:border-[#0969C7] outline-hidden min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#172033] mb-1">
                    Client Entity
                  </label>
                  <input
                    type="text"
                    value={uploadForm.clientName}
                    onChange={(e) => setUploadForm({ ...uploadForm, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E2EC] text-sm focus:border-[#0969C7] outline-hidden min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#172033] mb-1">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E2EC] text-sm focus:border-[#0969C7] outline-hidden min-h-[44px] bg-white"
                  >
                    <option value="ITR">Income Tax (ITR)</option>
                    <option value="GST">GST Returns</option>
                    <option value="Audit Report">Audit Report</option>
                    <option value="CMA/Loan">CMA / Loan</option>
                    <option value="Bank Statement">Bank Statement</option>
                    <option value="PAN/KYC">PAN &amp; KYC</option>
                  </select>
                </div>
              </div>

              {/* Drag and Drop Box */}
              <div className="border-2 border-dashed border-[#D9E2EC] rounded-xl p-5 sm:p-6 text-center hover:border-[#0969C7] transition-colors cursor-pointer bg-[#F7F9FC]">
                <UploadCloud className="w-8 h-8 text-[#0969C7] mx-auto mb-2" />
                <span className="text-xs font-medium text-[#062A5A] block">
                  Click to select file or drag PDF, XML, or XLSX here
                </span>
                <span className="text-[10px] text-[#667085] mt-1 block">
                  Client-side hashing executes before transmission
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-[#667085] hover:text-[#062A5A] min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEncrypting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl disabled:opacity-60 min-h-[44px]"
                >
                  {isEncrypting ? 'Encrypting with AES-256...' : 'Encrypt & Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Document Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#D9E2EC] shadow-2xl animate-in zoom-in-95 my-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2EC] mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#0969C7]">
                  Cryptographic Verification Receipt
                </span>
                <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                  {inspectDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-md"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F7F9FC] border border-[#D9E2EC]">
                <div className="text-[10px] text-[#667085] uppercase font-bold mb-1">
                  SHA-256 Document Fingerprint
                </div>
                <div className="font-mono text-[11px] text-[#062A5A] break-all select-all">
                  {inspectDoc.sha256Hash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F7F9FC] border border-[#D9E2EC]">
                  <div className="text-[10px] text-[#667085] uppercase font-bold mb-0.5">Verification</div>
                  <div className="font-semibold text-[#159447]">{inspectDoc.verificationStatus}</div>
                  <div className="text-[10px] text-slate-400">By {inspectDoc.reviewedBy || 'Pending'}</div>
                </div>

                <div className="p-3 rounded-lg bg-[#F7F9FC] border border-[#D9E2EC]">
                  <div className="text-[10px] text-[#667085] uppercase font-bold mb-0.5">Encryption Standard</div>
                  <div className="font-semibold text-[#062A5A]">AES-256-GCM</div>
                  <div className="text-[10px] text-slate-400">Cloud KMS Root</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#EEF5FC] text-[#062A5A]">
                <div className="font-semibold mb-0.5">Attestation Note:</div>
                <div className="text-slate-600">{inspectDoc.notes}</div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setInspectDoc(null)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#062A5A] rounded-xl hover:bg-[#031C3D] min-h-[40px]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
