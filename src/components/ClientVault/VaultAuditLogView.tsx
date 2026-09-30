import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultAuditLogEntry } from '../../types/vault';

interface VaultAuditLogViewProps {
  onSuccessToast: (msg: string) => void;
}

export const VaultAuditLogView: React.FC<VaultAuditLogViewProps> = ({ onSuccessToast }) => {
  const { auditLogs } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories = ['All', 'Auth', 'Permission', 'File', 'User', 'Project', 'Security'];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User', 'User Role', 'Action', 'Category', 'Status', 'IP Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.user}"`,
      `"${l.userRole}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      l.category,
      l.status,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `panjiyar_client_vault_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onSuccessToast('Exported filtered audit log to CSV.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-600" />
              <span>Tamper-Evident Immutable Audit Trail</span>
            </span>
          </div>
          <h2 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A]">
            Security &amp; Activity Audit Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking authentication, permission modifications, file downloads, and account state transitions. Passwords are never logged.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#062A5A] font-semibold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs transition-colors shrink-0"
          >
            <Download size={14} className="text-[#0969C7]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, action, IP address, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] text-xs bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold text-[11px] whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4 font-manrope">Timestamp &amp; Event ID</th>
                <th className="py-3 px-4">User &amp; Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">IP Subnet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-600 text-[11px] block">{log.timestamp}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{log.id}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-[#062A5A] block">{log.user}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{log.userRole}</span>
                  </td>

                  <td className="py-3 px-4 max-w-sm">
                    <div className="font-semibold text-slate-800">{log.action}</div>
                    <div className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                      {log.details}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-bold font-mono bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        log.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.status === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                    >
                      {log.status === 'Success' ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <AlertTriangle size={11} />
                      )}
                      <span>{log.status}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
