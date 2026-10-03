import React from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  FileCheck2,
  Lock,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { VaultFileItem } from '../../types/vault';

export interface FolderConfig {
  id: VaultFileItem['folder'];
  title: string;
  categoryDesc: string;
  icon: React.ReactNode;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    pill: string;
  };
}

export const VAULT_FOLDERS_CONFIG: FolderConfig[] = [
  {
    id: 'Documents',
    title: 'Statutory Filings & Tax (ITR)',
    categoryDesc: 'Income tax returns, computation memos, ROC forms & board approvals.',
    icon: <FileText size={20} />,
    colorTheme: {
      bg: 'bg-blue-50/60',
      border: 'border-blue-200/80',
      text: 'text-blue-900',
      accent: 'text-blue-600',
      pill: 'bg-blue-100/70 text-blue-800'
    }
  },
  {
    id: 'Invoices',
    title: 'GST Returns & Billing Ledgers',
    categoryDesc: 'GSTR-1, 3B acknowledgements, e-Way bills, input tax credit records.',
    icon: <FileSpreadsheet size={20} />,
    colorTheme: {
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200/80',
      text: 'text-emerald-900',
      accent: 'text-emerald-600',
      pill: 'bg-emerald-100/70 text-emerald-800'
    }
  },
  {
    id: 'Reports',
    title: 'Audit Working Papers & 3CD',
    categoryDesc: 'Certified audit reports, internal control checklists, depreciation schedules.',
    icon: <FileCheck2 size={20} />,
    colorTheme: {
      bg: 'bg-indigo-50/60',
      border: 'border-indigo-200/80',
      text: 'text-indigo-900',
      accent: 'text-indigo-600',
      pill: 'bg-indigo-100/70 text-indigo-800'
    }
  },
  {
    id: 'Contracts',
    title: 'Contracts, NDAs & Sanctions',
    categoryDesc: 'Bank loan consortium sanction letters, legal NDAs, partnership deeds.',
    icon: <Lock size={20} />,
    colorTheme: {
      bg: 'bg-amber-50/60',
      border: 'border-amber-200/80',
      text: 'text-amber-900',
      accent: 'text-amber-600',
      pill: 'bg-amber-100/70 text-amber-800'
    }
  },
  {
    id: 'Photos',
    title: 'Site Inspections & Inventories',
    categoryDesc: 'Physical factory asset verification, warehouse stock audits, collateral photos.',
    icon: <Folder size={20} />,
    colorTheme: {
      bg: 'bg-purple-50/60',
      border: 'border-purple-200/80',
      text: 'text-purple-900',
      accent: 'text-purple-600',
      pill: 'bg-purple-100/70 text-purple-800'
    }
  },
  {
    id: 'Videos',
    title: 'Executive Briefings & AGMs',
    categoryDesc: 'Statutory board meeting recordings, annual general meeting evidence archives.',
    icon: <FolderOpen size={20} />,
    colorTheme: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-900',
      accent: 'text-slate-600',
      pill: 'bg-slate-200/70 text-slate-800'
    }
  }
];

interface VaultFolderCardProps {
  folder: FolderConfig;
  fileCount: number;
  isActive: boolean;
  onSelect: (folderId: VaultFileItem['folder']) => void;
}

export const VaultFolderCard: React.FC<VaultFolderCardProps> = ({
  folder,
  fileCount,
  isActive,
  onSelect
}) => {
  return (
    <div
      onClick={() => onSelect(folder.id)}
      className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between select-none ${
        isActive
          ? 'bg-white border-[#0969C7] shadow-md ring-2 ring-[#0969C7]/20 scale-[1.01]'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm hover:scale-[1.01]'
      }`}
    >
      {/* Folder Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${folder.colorTheme.bg} ${folder.colorTheme.border} border`}
          >
            <span className={folder.colorTheme.accent}>{folder.icon}</span>
          </div>

          <span
            className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full transition-colors ${
              isActive ? 'bg-[#062A5A] text-white' : folder.colorTheme.pill
            }`}
          >
            {fileCount} {fileCount === 1 ? 'file' : 'files'}
          </span>
        </div>

        <h3 className="font-manrope font-bold text-sm text-[#062A5A] group-hover:text-[#0969C7] transition-colors leading-snug">
          {folder.title}
        </h3>

        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {folder.categoryDesc}
        </p>
      </div>

      {/* Footer Pill & Action */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-[10.5px] font-medium text-slate-400 flex items-center gap-1">
          <Lock size={10} className="text-emerald-600" />
          <span>AES-256</span>
        </span>

        <span
          className={`font-semibold flex items-center gap-1 transition-colors ${
            isActive ? 'text-[#0969C7]' : 'text-slate-400 group-hover:text-[#062A5A]'
          }`}
        >
          <span>{isActive ? 'Active Folder' : 'Open'}</span>
          <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};
