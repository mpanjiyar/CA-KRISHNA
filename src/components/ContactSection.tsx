import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, ExternalLink, AlertCircle } from 'lucide-react';
import { CaEmblem } from './CaLogo';
import { useSiteContent } from '../context/SiteContentContext';

export const ContactSection: React.FC = () => {
  const { state } = useSiteContent();
  const { firmDetails, services } = state;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceRequired: services[0]?.name || 'Income Tax Services',
    message: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setValidationError('Please provide your full name and valid phone number.');
      return;
    }
    setValidationError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact-section" className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC] scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* H1 / Header */}
        <div className="text-left mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-5 h-[2px] bg-[#0969C7]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Get in Touch
            </span>
          </div>

          <h1 className="font-manrope text-[24px] xs:text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            Contact {firmDetails.name}
          </h1>

          <p className="text-xs xs:text-sm sm:text-base text-[#667085] max-w-2xl leading-relaxed">
            Reach out to our {firmDetails.address?.locality || 'Andheri (W)'}, {firmDetails.address?.city || 'Mumbai'} office for tax consultation, statutory audits, GST advisory, and business financing solutions.
          </p>
        </div>

        {/* 2-Column Layout: Left Details / Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 mb-10 sm:mb-14">
          
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 flex flex-col text-left space-y-4 sm:space-y-5">
            
            {/* Founder Card */}
            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC]">
              <div className="flex items-center gap-3 sm:gap-3.5 mb-2.5">
                <CaEmblem sizePx={40} />
                <div>
                  <h3 className="font-brand font-bold text-base sm:text-lg text-[#062A5A] leading-tight">
                    {firmDetails.founder}
                  </h3>
                  <p className="text-[11px] xs:text-xs font-semibold text-[#0969C7] uppercase tracking-wider mt-0.5">
                    {firmDetails.founderTitle}
                  </p>
                </div>
              </div>
              <p className="text-xs xs:text-sm text-[#667085] leading-relaxed">
                Direct practice partner overseeing audit engagements, regulatory representations, and business growth advisory across India.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-3">
              
              {/* Phone Numbers */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-white border border-[#D9E2EC] flex items-start gap-3 sm:gap-4 shadow-2xs">
                <div className="p-2 sm:p-2.5 rounded-lg bg-[#EEF5FC] text-[#062A5A] shrink-0">
                  <Phone size={18} className="text-[#F28C18]" />
                </div>
                <div>
                  <h4 className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-[#667085] mb-1">
                    Direct Phone Numbers
                  </h4>
                  <div className="flex flex-col space-y-1">
                    <a
                      href={`tel:${firmDetails.phone1}`}
                      className="font-manrope font-bold text-sm xs:text-base text-[#062A5A] hover:text-[#0969C7] transition-colors py-0.5"
                    >
                      {firmDetails.phone1}
                    </a>
                    {firmDetails.phone2 && (
                      <a
                        href={`tel:${firmDetails.phone2}`}
                        className="font-manrope font-bold text-sm xs:text-base text-[#062A5A] hover:text-[#0969C7] transition-colors py-0.5"
                      >
                        {firmDetails.phone2}
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] xs:text-[11px] text-[#667085] mt-0.5 block">
                    Click to initiate a phone call directly
                  </span>
                </div>
              </div>

              {/* Email Address */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-white border border-[#D9E2EC] flex items-start gap-3 sm:gap-4 shadow-2xs">
                <div className="p-2 sm:p-2.5 rounded-lg bg-[#EEF5FC] text-[#062A5A] shrink-0">
                  <Mail size={18} className="text-[#0969C7]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-[#667085] mb-1">
                    Official Email
                  </h4>
                  <a
                    href={`mailto:${firmDetails.email}`}
                    className="font-medium text-xs xs:text-sm sm:text-base text-[#062A5A] hover:text-[#0969C7] transition-colors break-all block py-0.5"
                  >
                    {firmDetails.email}
                  </a>
                  <span className="text-[10px] xs:text-[11px] text-[#667085] mt-0.5 block">
                    Replies usually delivered within 4 business hours
                  </span>
                </div>
              </div>

              {/* Verified Office Address */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-white border border-[#D9E2EC] flex items-start gap-3 sm:gap-4 shadow-2xs">
                <div className="p-2 sm:p-2.5 rounded-lg bg-[#EEF5FC] text-[#062A5A] shrink-0">
                  <MapPin size={18} className="text-[#159447]" />
                </div>
                <div>
                  <h4 className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-[#667085] mb-1">
                    Verified Office Address
                  </h4>
                  <p className="text-xs xs:text-sm font-medium text-[#172033] leading-relaxed">
                    {firmDetails.address?.full || '102, Shourie Complex, Bombay Bazaar, Andheri (W), Mumbai – 400058'}
                  </p>
                  <span className="text-[10px] xs:text-[11px] text-[#0969C7] mt-1 block font-semibold">
                    Head Office &middot; In-Person Consultations by Appointment
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-white border border-[#D9E2EC] flex items-start gap-3 sm:gap-4 shadow-2xs">
                <div className="p-2 sm:p-2.5 rounded-lg bg-[#EEF5FC] text-[#062A5A] shrink-0">
                  <Clock size={18} className="text-[#0969C7]" />
                </div>
                <div>
                  <h4 className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-[#667085] mb-1">
                    Office Hours
                  </h4>
                  <p className="text-xs xs:text-sm font-medium text-[#172033]">
                    {firmDetails.workingHours || 'Mon - Sat: 9:30 AM – 7:00 PM (IST)'}
                  </p>
                  <span className="text-[10px] xs:text-[11px] text-[#667085] mt-0.5 block">
                    Sunday: Prior appointment only for urgent ROC filings
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Consultation Request Form */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <div className="bg-white rounded-2xl border border-[#D9E2EC] p-5 sm:p-8 shadow-xs">
              <h3 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A] mb-1">
                Schedule a Consultation
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] mb-6">
                Fill in your contact coordinates below. Our partners will get back to you with structured next steps.
              </p>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-manrope font-bold text-lg text-emerald-900 mb-1">
                    Consultation Request Registered
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto mb-5">
                    Thank you, {formData.name}. Our practice desk has logged your mandate for {formData.serviceRequired}. We will reach out shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        serviceRequired: services[0]?.name || 'Income Tax Services',
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 bg-[#062A5A] text-white text-xs font-semibold rounded-xl hover:bg-[#031C3D] transition-colors"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {validationError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rajesh@example.com"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Service Practice Area *
                      </label>
                      <select
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                      >
                        {services.map((srv) => (
                          <option key={srv.id} value={srv.name}>
                            {srv.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Case Summary or Specific Query
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly state your tax notice, incorporation requirement, or CMA financing requirement..."
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] min-h-[46px]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={15} className="text-[#F28C18]" />
                        <span>Send Consultation Mandate</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
