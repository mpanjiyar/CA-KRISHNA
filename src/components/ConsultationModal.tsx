import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, User, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultService
}) => {
  const { services, firmDetails } = useFirmData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: defaultService || 'Income Tax Services',
    preferredMode: 'In-Person (Andheri Office)',
    preferredTime: 'Morning (10:00 AM - 1:00 PM)',
    notes: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync defaultService when prop changes
  useEffect(() => {
    if (defaultService) {
      setFormData((prev) => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setValidationError('Please enter your full name and contact phone number.');
      return;
    }
    setValidationError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 450);
  };

  const handleReset = () => {
    setConfirmed(false);
    setValidationError(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#D9E2EC] overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left my-auto"
      >
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#062A5A] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F28C18]">
              Direct Engagement
            </span>
            <h3 id="consultation-modal-title" className="font-manrope font-bold text-base sm:text-lg text-white">
              Book a Consultation with CA Krishna Panjiyar
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {confirmed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#159447]/10 text-[#159447] flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>

              <h4 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A]">
                Appointment Request Confirmed!
              </h4>

              <div className="p-4 bg-[#F7F9FC] rounded-xl border border-[#D9E2EC] text-left text-xs sm:text-sm space-y-2 max-w-md mx-auto">
                <div>
                  <span className="text-[#667085] text-xs">Client:</span>{' '}
                  <strong className="text-[#062A5A]">{formData.name}</strong>
                </div>
                <div>
                  <span className="text-[#667085] text-xs">Direct Phone:</span>{' '}
                  <strong className="text-[#062A5A]">{formData.phone}</strong>
                </div>
                <div>
                  <span className="text-[#667085] text-xs">Practice Area:</span>{' '}
                  <strong className="text-[#062A5A]">{formData.service}</strong>
                </div>
                <div>
                  <span className="text-[#667085] text-xs">Consultation Format:</span>{' '}
                  <strong className="text-[#062A5A]">{formData.preferredMode}</strong>
                </div>
              </div>

              <p className="text-xs text-[#667085] max-w-md mx-auto leading-relaxed">
                CA Krishna Panjiyar or our senior advisory desk will call you at <strong className="text-[#062A5A]">{formData.phone}</strong> to confirm the exact meeting slot and required initial documentation.
              </p>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#062A5A] rounded-xl hover:bg-[#031C3D] min-h-[44px]"
                >
                  Close &amp; Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-[#EEF5FC] rounded-xl border border-[#D9E2EC] flex items-center justify-between text-xs text-[#062A5A]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={16} className="text-[#159447] shrink-0" />
                  <span>Confidential Chartered Accountancy Intake</span>
                </span>
                <span className="font-bold text-[#0969C7] shrink-0">Mumbai Head Office</span>
              </div>

              {validationError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kulkarni"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9820012345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="name@business.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                    Service Required *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden bg-white"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Loan & CMA Preparation">Loan &amp; CMA Preparation</option>
                    <option value="Tax Notice or Scrutiny Support">Tax Notice or Scrutiny Support</option>
                    <option value="Pan-India Virtual Audit Desk">Pan-India Virtual Audit Desk</option>
                  </select>
                </div>
              </div>

              {/* Consultation Format & Preferred Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                    Meeting Format
                  </label>
                  <select
                    value={formData.preferredMode}
                    onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value })}
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden bg-white"
                  >
                    <option value="In-Person (Andheri Office)">In-Person (Andheri Office)</option>
                    <option value="Virtual Video Consultation (PAN India)">Virtual Video Consultation (PAN India)</option>
                    <option value="Phone Discussion">Phone Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                    Preferred Time Window
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden bg-white"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                    <option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                  Brief Context or Query
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention your turnover range, deadline, state of operation, or specific tax question..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9E2EC] text-xs sm:text-sm focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden resize-none"
                />
              </div>

              {/* Direct Call Quick Link */}
              <div className="pt-2 flex flex-col xs:flex-row items-start xs:items-center justify-between text-xs text-[#667085] gap-1">
                <span>Prefer immediate assistance?</span>
                <a
                  href={`tel:${firmDetails.phone1}`}
                  className="font-bold text-[#062A5A] hover:underline flex items-center gap-1"
                >
                  <Phone size={12} className="text-[#F28C18]" />
                  <span>Call {firmDetails.phone1}</span>
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 min-h-[48px] text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] active:scale-[0.99] rounded-xl transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="text-[#F28C18]" />
                <span>{loading ? 'Securing Slot...' : 'Schedule My Consultation'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
