import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCheck2,
  FileCode,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Shield,
  Share2,
  MoreVertical
} from 'lucide-react';
import { VaultFileItem, VaultUser } from '../../types/vault';

interface VaultFileCardProps {
  file: VaultFileItem;
  viewMode: 'grid' | 'table';
  currentUser: VaultUser | null;
  onPreview: (file: VaultFileItem) => void;
  onDownload: (file: VaultFileItem) => void;
  onToggleStatus?: (file: VaultFileItem) => void;
  onDelete?: (file: VaultFileItem) => void;
}

export const VaultFileCard: React.FC<VaultFileCardProps> = ({
  file,
  viewMode,
  currentUser,
  onPreview,
  onDownload,
  onToggleStatus,
  onDelete
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(file.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const getFormatBadge = (name: string, type: VaultFileItem['fileType']) => {
    const ext = name.split('.').pop()?.toUpperCase() || 'DOC';
    let color = 'bg-blue-50 text-blue-700 border-blue-200';
    if (ext === 'PDF') color = 'bg-rose-50 text-rose-700 border-rose-200';
    if (ext === 'XLSX' || ext === 'XLS' || ext === 'CSV') color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (ext === 'PNG' || ext === 'JPG' || ext === 'WEBP') color = 'bg-purple-50 text-purple-700 border-purple-200';

    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${color}`}>
        .{ext}
      </span>
    );
  };

  const verificationStatus = file.verificationStatus || 'Verified';

  const canStaffReview = currentUser?.accountType === 'staff' || currentUser?.accountType === 'super_admin';
  const canDelete = currentUser?.accountType === 'super_admin' || file.permissions.canDelete;

  // TABLE / LIST ROW VIEW
  if (viewMode === 'table') {
    return (
      <tr className="hover:bg-slate-50/70 transition-colors group text-left">
        {/* Document Title & Details */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <FileText size={16} />
            </div>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onPreview(file)}
                className="font-semibold text-xs sm:text-sm text-[#062A5A] hover:text-[#0969C7] text-left truncate block max-w-xs sm:max-w-md transition-colors"
              >
                {file.title}
              </button>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                <span>{file.fileName}</span>
                <span>&middot;</span>
                <span>{file.fileSize}</span>
              </div>
            </div>
          </div>
        </td>

        {/* Client & Project */}
        <td className="py-3 px-4 text-xs text-slate-600">
          <div className="font-medium text-[#172033] truncate max-w-[180px]">{file.clientName}</div>
          {file.projectName && (
            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{file.projectName}</div>
          )}
        </td>

        {/* Folder */}
        <td className="py-3 px-4">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
            {file.folder}
          </span>
        </td>

        {/* SHA-256 Fingerprint */}
        <td className="py-3 px-4">
          <button
            type="button"
            onClick={handleCopyHash}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#F7F9FC] border border-slate-200 text-[10.5px] font-mono text-slate-600 hover:border-slate-300 transition-colors"
            title="Click to copy full SHA-256 cryptographic digest"
          >
            <Lock size={10} className="text-emerald-600" />
            <span>{file.sha256Hash.substring(0, 12)}...</span>
            {copiedHash ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-slate-400" />}
          </button>
        </td>

        {/* Status */}
        <td className="py-3 px-4">
          <button
            type="button"
            onClick={() => canStaffReview && onToggleStatus && onToggleStatus(file)}
            disabled={!canStaffReview}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              verificationStatus === 'Verified'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : verificationStatus === 'Under Review'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            } ${canStaffReview ? 'cursor-pointer hover:opacity-80' : ''}`}
            title={canStaffReview ? 'Click to toggle verification status' : undefined}
          >
            {verificationStatus === 'Verified' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            <span>{verificationStatus}</span>
          </button>
        </td>

        {/* Actions */}
        <td className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onPreview(file)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#062A5A] hover:bg-slate-100 transition-colors"
              title="Preview Cryptographic File & Metadata"
              aria-label="Preview document"
            >
              <Eye size={15} />
            </button>

            <button
              type="button"
              onClick={() => onDownload(file)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0969C7] hover:bg-slate-100 transition-colors"
              title="Download Encrypted File"
              aria-label="Download file"
            >
              <Download size={15} />
            </button>

            {canDelete && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(file)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete File"
                aria-label="Delete file"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // GRID CARD VIEW (Default Modern Layout)
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left flex flex-col justify-between group">
      <div>
        {/* Top Format & Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            {getFormatBadge(file.fileName, file.fileType)}
            <span className="text-[10px] font-medium text-slate-400">
              {file.folder}
            </span>
          </div>

          <button
            type="button"
            onClick={() => canStaffReview && onToggleStatus && onToggleStatus(file)}
            disabled={!canStaffReview}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${
              verificationStatus === 'Verified'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : verificationStatus === 'Under Review'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            } ${canStaffReview ? 'cursor-pointer hover:opacity-80' : ''}`}
          >
            {verificationStatus === 'Verified' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
            <span>{verificationStatus}</span>
          </button>
        </div>

        {/* Title */}
        <h4
          onClick={() => onPreview(file)}
          className="font-manrope font-bold text-sm text-[#062A5A] hover:text-[#0969C7] transition-colors leading-snug cursor-pointer line-clamp-2"
        >
          {file.title}
        </h4>

        {/* Client & Project tags */}
        <div className="mt-2 text-[11px] text-slate-500">
          <span className="font-medium text-slate-700 truncate block">{file.clientName}</span>
          {file.projectName && (
            <span className="text-slate-400 truncate block text-[10.5px]">{file.projectName}</span>
          )}
        </div>

        {/* SHA-256 Hash Container */}
        <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="truncate mr-1" title={file.sha256Hash}>
            SHA: {file.sha256Hash.substring(0, 16)}...
          </span>
          <button
            type="button"
            onClick={handleCopyHash}
            className="text-slate-400 hover:text-slate-700 shrink-0 p-0.5 rounded"
            title="Copy cryptographic SHA-256 fingerprint"
          >
            {copiedHash ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="text-slate-400 font-mono text-[10.5px]">
          <span>{file.fileSize}</span>
          <span className="mx-1">&middot;</span>
          <span>{file.uploadDate}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] hover:text-[#0969C7] text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Inspect Cryptographic Certificate & Preview"
          >
            <Eye size={12} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(file)}
            className="p-1.5 rounded-lg bg-[#062A5A] hover:bg-[#031C3D] text-white transition-colors"
            title="Download Encrypted File"
            aria-label="Download file"
          >
            <Download size={13} />
          </button>

          {canDelete && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(file)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete File"
              aria-label="Delete file"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
