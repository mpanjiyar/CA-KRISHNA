import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Image as ImageIcon,
  Sun,
  Moon,
  Sparkles,
  Link as LinkIcon,
  Check
} from 'lucide-react';
import { SUPPORTED_EXTENSIONS } from '../../utils/imageManager';
import { uploadImageFile, processDirectUrl, UploadResult } from '../../lib/storageService';

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
  dimensions = 'JPG, PNG, WebP, SVG, GIF, ICO, AVIF up to 15MB',
  onSave,
  onDelete,
  onToast,
  darkPreviewBg = false
}) => {
  const [draftUrl, setDraftUrl] = useState<string>(currentUrl);
  const [pastedUrl, setPastedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>(darkPreviewBg ? 'dark' : 'light');
  const [metaInfo, setMetaInfo] = useState<{ format?: string; width?: number; height?: number; sizeKb?: number } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft if external currentUrl changes and user has no pending unsaved draft
  useEffect(() => {
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
    setSaveSuccess(false);
    setIsProcessing(true);
    setUploadProgress(15);
    setProgressStatus('Reading and analyzing image file...');

    try {
      setUploadProgress(45);
      setProgressStatus(`Optimizing ${file.type || 'image'} format...`);
      
      const result: UploadResult = await uploadImageFile(file);
      
      setUploadProgress(85);
      setProgressStatus('Generating high-resolution Retina preview...');
      
      setDraftUrl(result.url);
      setMetaInfo({
        format: result.format || file.name.split('.').pop()?.toUpperCase(),
        width: result.width,
        height: result.height,
        sizeKb: Math.round(result.sizeBytes / 1024)
      });
      setHasChanges(true);

      setUploadProgress(100);
      setProgressStatus('Preview ready! Click "Save Changes" to publish live.');
      onToast(`Image staged (${(result.sizeBytes / 1024).toFixed(0)} KB). Click "Save Changes" to publish.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process file';
      setErrorMessage(msg);
      onToast(`Error: ${msg}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1200);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = async () => {
    const trimmed = pastedUrl.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an image URL or local path.');
      return;
    }

    setErrorMessage(null);
    setSaveSuccess(false);
    setIsProcessing(true);
    setUploadProgress(30);
    setProgressStatus('Connecting to image source and validating format...');

    try {
      setUploadProgress(65);
      const result: UploadResult = await processDirectUrl(trimmed);
      
      setDraftUrl(result.url);
      setMetaInfo({
        format: result.format,
        width: result.width,
        height: result.height,
        sizeKb: Math.round(result.sizeBytes / 1024)
      });
      setHasChanges(true);
      setPastedUrl('');
      setUploadProgress(100);
      setProgressStatus('URL validated successfully! Click "Save Changes" to publish.');
      onToast('Image URL verified and loaded into preview. Click "Save Changes" to publish.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid URL';
      setErrorMessage(msg);
      onToast(`Error: ${msg}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1200);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);
    try {
      await onSave(draftUrl);
      setHasChanges(false);
      setSaveSuccess(true);
      onToast(`✓ Changes saved successfully: ${title} updated and synchronized across all active devices.`);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setErrorMessage(`Save failed: ${msg}`);
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
    setMetaInfo(null);
    onToast(`Reverted ${title} draft back to saved state.`);
  };

  const handleDeleteOrRestoreDefault = async () => {
    if (window.confirm(`Reset "${title}" back to the official default asset?`)) {
      setIsSaving(true);
      try {
        if (onDelete) {
          await onDelete();
        } else {
          await onSave(defaultUrl);
        }
        setDraftUrl(defaultUrl);
        setHasChanges(false);
        setMetaInfo(null);
        setSaveSuccess(true);
        onToast(`✓ ${title} reset to official firm default.`);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Delete failed');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const displayUrl = draftUrl || defaultUrl;
  const isCustom = Boolean(draftUrl && draftUrl !== defaultUrl);

  const getSourceBadge = () => {
    if (!displayUrl) return null;
    if (displayUrl.includes('googleusercontent.com') || displayUrl.includes('drive.google.com')) {
      return <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">Google Drive Image</span>;
    }
    if (displayUrl.startsWith('/uploads/')) {
      return <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">Local File ({displayUrl})</span>;
    }
    if (displayUrl.startsWith('http')) {
      return <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">External URL</span>;
    }
    if (displayUrl.startsWith('data:')) {
      const mime = displayUrl.slice(5, displayUrl.indexOf(';'));
      return <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Uploaded Asset ({mime})</span>;
    }
    return <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">Default Firm Vector</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D9E2EC] p-5 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
      {/* Top Status Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
          saveSuccess
            ? 'bg-emerald-500'
            : hasChanges
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
        {/* Header Badges & Live Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${badgeColorClasses}`}>
            {badge}
          </span>
          {saveSuccess ? (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
              <Check size={11} className="text-emerald-600 stroke-[3]" /> Saved to Cloud
            </span>
          ) : hasChanges ? (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 1 Unsaved Change
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
          } p-3 sm:p-4 flex flex-col items-center justify-center min-h-[175px] mb-3 text-center relative overflow-hidden transition-all ${
            previewTheme === 'dark' ? 'bg-[#031C3D] text-white' : 'bg-[#F7F9FC]'
          }`}
        >
          {/* Light/Dark Contrast Toggle (Essential for Transparent White or Dark Logos) */}
          <button
            type="button"
            onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              previewTheme === 'dark' 
                ? 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20' 
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
            }`}
            title="Toggle contrast backdrop (Light / Dark)"
          >
            {previewTheme === 'dark' ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-[#062A5A]" />}
            <span className="text-[10px] font-medium hidden xs:inline">{previewTheme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {displayUrl ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white shadow-xs border border-slate-200 p-2 flex items-center justify-center mb-2 overflow-hidden">
              <img
                key={displayUrl}
                src={displayUrl}
                alt={title}
                className="w-full h-full object-contain"
                loading="eager"
                decoding="async"
                onError={() => {
                  setErrorMessage('Image failed to decode. The file or URL may be inaccessible or corrupted.');
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-3">
              <ImageIcon size={32} className="mb-1 text-slate-300" />
              <span className="text-xs font-semibold">No Image Active</span>
              <span className="text-[10px] text-slate-400">Upload a file or enter an image URL</span>
            </div>
          )}

          {/* Source Tag & Metadata */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center mt-1">
            {getSourceBadge()}
            {metaInfo && (
              <span className="text-[10px] font-mono text-slate-500 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
                {metaInfo.width && metaInfo.height ? `${metaInfo.width}×${metaInfo.height} px` : ''} {metaInfo.sizeKb ? `(${metaInfo.sizeKb} KB)` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Upload Progress Bar if processing */}
        {uploadProgress > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl animate-in fade-in">
            <div className="flex justify-between items-center text-[11px] font-semibold text-blue-900 mb-1.5">
              <span>{progressStatus}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0969C7] transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Dimension & Format specifications */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 space-y-0.5">
          <div>Recommended: <strong className="text-slate-700">{recommendedAspect}</strong></div>
          <div>Supported Formats: <strong className="text-slate-700">{dimensions}</strong></div>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}
      </div>

      {/* Action Controls & Save Bar */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Option 1: File Upload Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isProcessing || isSaving}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload size={13} className="text-[#F28C18]" />
            <span>{isProcessing ? 'Processing File...' : isCustom ? 'Replace Image File' : 'Upload Image File'}</span>
          </button>

          {isCustom && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleDeleteOrRestoreDefault}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors shrink-0"
              title="Reset to official default asset"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Option 2: Google Drive, Cloud URL, or Local Path (/uploads/...) */}
        <div className="space-y-1">
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <LinkIcon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Google Drive link, https://..., or /uploads/..."
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                disabled={isProcessing || isSaving}
                className="w-full text-[11px] pl-7 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
              />
            </div>
            <button
              type="button"
              disabled={!pastedUrl.trim() || isProcessing}
              onClick={handleApplyUrl}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#062A5A] disabled:opacity-40 font-semibold text-[11px] rounded-lg transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Preview Link</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 pl-1 flex items-center justify-between">
            <span>Supports Google Drive, Dropbox, CDN &amp; /uploads/...</span>
          </div>
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
            disabled={isSaving || (!hasChanges && !isCustom)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              hasChanges
                ? 'bg-[#F28C18] hover:bg-[#d97c12] text-white ring-2 ring-[#F28C18]/30 scale-[1.02]'
                : isSaving
                ? 'bg-slate-400 text-white cursor-wait'
                : 'bg-[#062A5A] hover:bg-[#031C3D] text-white'
            } active:scale-[0.98]`}
          >
            <Save size={13} className={hasChanges ? 'text-white' : 'text-[#F28C18]'} />
            <span>{isSaving ? 'Syncing to Cloud...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
