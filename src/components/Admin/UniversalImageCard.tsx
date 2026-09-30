import React, { useState, useRef } from 'react';
import { Upload, Trash2, Save, RotateCcw, CheckCircle2, AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { processImageUpload, verifyImageUrl, SUPPORTED_EXTENSIONS } from '../../utils/imageManager';

interface UniversalImageCardProps {
  title: string;
  badge: string;
  badgeColor?: 'blue' | 'amber' | 'emerald' | 'purple' | 'slate';
  description: string;
  currentUrl: string;
  defaultUrl?: string;
  recommendedAspect?: string;
  dimensions?: string;
  onSave: (newUrl: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onToast: (msg: string) => void;
  darkPreviewBg?: boolean;
}

export const UniversalImageCard: React.FC<UniversalImageCardProps> = ({
  title,
  badge,
  badgeColor = 'blue',
  description,
  currentUrl,
  defaultUrl = '/icai-emblem.svg',
  recommendedAspect = 'Square (1:1) or Horizontal',
  dimensions = 'SVG, PNG, WebP, JPG, GIF up to 10MB',
  onSave,
  onDelete,
  onToast,
  darkPreviewBg = false
}) => {
  const [draftUrl, setDraftUrl] = useState<string>(currentUrl);
  const [pastedUrl, setPastedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft if external currentUrl changes and user has no pending draft
  React.useEffect(() => {
    if (!hasChanges) {
      setDraftUrl(currentUrl);
    }
  }, [currentUrl, hasChanges]);

  const badgeColorClasses = {
    blue: 'text-[#0969C7] bg-[#EEF5FC]',
    amber: 'text-[#F28C18] bg-amber-50',
    emerald: 'text-[#159447] bg-emerald-50',
    purple: 'text-purple-700 bg-purple-50',
    slate: 'text-slate-700 bg-slate-100'
  }[badgeColor];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await processImageUpload(file);
      setDraftUrl(result.dataUrl);
      setHasChanges(true);
      onToast(`Image parsed successfully (${result.format}, ${(result.sizeBytes / 1024).toFixed(0)} KB). Click "Save Changes" to publish.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process file';
      setErrorMessage(msg);
      onToast(`Error: ${msg}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = async () => {
    if (!pastedUrl.trim()) return;
    setErrorMessage(null);
    setIsProcessing(true);

    const valid = await verifyImageUrl(pastedUrl.trim());
    setIsProcessing(false);

    if (!valid) {
      setErrorMessage('The provided URL could not be decoded as a valid image. Please check the URL.');
      return;
    }

    setDraftUrl(pastedUrl.trim());
    setHasChanges(true);
    setPastedUrl('');
    onToast('Remote image loaded into preview. Click "Save Changes" to apply.');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(draftUrl);
      setHasChanges(false);
      onToast(`✓ Changes saved successfully: ${title} updated and synchronized across all active devices.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setErrorMessage(msg);
      onToast(`Save failed: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDraftUrl(currentUrl);
    setHasChanges(false);
    setErrorMessage(null);
    setPastedUrl('');
    onToast(`Reverted ${title} draft back to saved state.`);
  };

  const handleDeleteOrRestoreDefault = async () => {
    if (onDelete) {
      setIsSaving(true);
      try {
        await onDelete();
        setDraftUrl(defaultUrl);
        setHasChanges(false);
        onToast(`✓ ${title} restored to default.`);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Delete failed');
      } finally {
        setIsSaving(false);
      }
    } else {
      setDraftUrl(defaultUrl);
      setHasChanges(true);
      onToast(`${title} reset to default preview. Click "Save Changes" to persist.`);
    }
  };

  const displayUrl = draftUrl || defaultUrl;
  const isCustom = draftUrl && draftUrl !== defaultUrl;

  return (
    <div className="bg-white rounded-2xl border border-[#D9E2EC] p-5 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
      {/* Top Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          hasChanges
            ? 'bg-[#F28C18] animate-pulse'
            : badgeColor === 'blue'
            ? 'bg-[#0969C7]'
            : badgeColor === 'amber'
            ? 'bg-[#F28C18]'
            : badgeColor === 'emerald'
            ? 'bg-[#159447]'
            : 'bg-slate-400'
        }`}
      />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${badgeColorClasses}`}>
            {badge}
          </span>
          {hasChanges ? (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Unsaved Changes
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced &amp; Live
            </span>
          )}
        </div>

        <h3 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Live Image Preview Container */}
        <div
          className={`rounded-2xl border ${
            hasChanges ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
          } p-3 sm:p-4 flex flex-col items-center justify-center min-h-[160px] mb-4 text-center relative overflow-hidden transition-all ${
            darkPreviewBg ? 'bg-[#031C3D] text-white' : 'bg-[#F7F9FC]'
          }`}
        >
          {displayUrl ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white shadow-xs border border-slate-200 p-2 flex items-center justify-center mb-2 overflow-hidden">
              <img
                src={displayUrl}
                alt={title}
                className="w-full h-full object-contain"
                onError={() => {
                  setErrorMessage('Image failed to decode. File or URL may be invalid.');
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-3">
              <ImageIcon size={32} className="mb-1 text-slate-300" />
              <span className="text-xs font-semibold">No Image Active</span>
              <span className="text-[10px] text-slate-400">Tap below to upload or paste a URL</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 max-w-full px-2 truncate">
            {displayUrl.startsWith('data:') ? (
              <span className="font-mono text-[10px] bg-white/80 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                Custom Upload ({displayUrl.slice(5, displayUrl.indexOf(';'))})
              </span>
            ) : (
              <span className="truncate max-w-[220px]" title={displayUrl}>
                {displayUrl}
              </span>
            )}
          </div>
        </div>

        {/* Dimension & Format specifications */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 space-y-0.5">
          <div>Aspect: <strong className="text-slate-700">{recommendedAspect}</strong></div>
          <div>Formats: <strong className="text-slate-700">{dimensions}</strong></div>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}
      </div>

      {/* Action Controls & Save Bar */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Upload & Replace Button Row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isProcessing || isSaving}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload size={13} className="text-[#F28C18]" />
            <span>{isProcessing ? 'Processing File...' : isCustom ? 'Replace Image' : 'Upload Image'}</span>
          </button>

          {isCustom && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleDeleteOrRestoreDefault}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
              title="Reset to default asset"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Paste Cloud / CDN URL */}
        <div className="flex gap-1.5">
          <input
            type="url"
            placeholder="Or paste cloud/CDN URL..."
            value={pastedUrl}
            onChange={(e) => setPastedUrl(e.target.value)}
            disabled={isProcessing || isSaving}
            className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
          />
          <button
            type="button"
            disabled={!pastedUrl.trim() || isProcessing}
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#062A5A] disabled:opacity-40 font-semibold text-[11px] rounded-lg transition-colors shrink-0"
          >
            Preview
          </button>
        </div>

        {/* Prominent Save Changes Bar */}
        <div className="pt-2 flex items-center justify-between gap-2">
          {hasChanges ? (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>Saved in Cloud</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              hasChanges
                ? 'bg-[#F28C18] hover:bg-[#d97c12] text-white ring-2 ring-[#F28C18]/30 scale-[1.02]'
                : 'bg-[#062A5A] hover:bg-[#031C3D] text-white'
            } active:scale-[0.98]`}
          >
            <Save size={13} className={hasChanges ? 'text-white' : 'text-[#F28C18]'} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
