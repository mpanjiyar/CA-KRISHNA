import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, ExternalLink, AlertCircle } from 'lucide-react';
import { FIRM_DETAILS, CORE_SERVICES } from '../data/firmData';
import { CaEmblem } from './CaLogo';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceRequired: 'Income Tax Services',
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
            Contact PANJIYAR KRISHNA &amp; CO.
          </h1>

          <p className="text-xs xs:text-sm sm:text-base text-[#667085] max-w-2xl leading-relaxed">
            Reach out to our Andheri (W), Mumbai office for tax consultation, statutory audits, GST advisory, and business financing solutions.
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
                    {FIRM_DETAILS.founder}
                  </h3>
                  <p className="text-[11px] xs:text-xs font-semibold text-[#0969C7] uppercase tracking-wider mt-0.5">
                    {FIRM_DETAILS.founderTitle}
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
                      href={`tel:${FIRM_DETAILS.phone1}`}
                      className="font-manrope font-bold text-sm xs:text-base text-[#062A5A] hover:text-[#0969C7] transition-colors py-0.5"
                    >
                      {FIRM_DETAILS.phone1}
                    </a>
                    <a
                      href={`tel:${FIRM_DETAILS.phone2}`}
                      className="font-manrope font-bold text-sm xs:text-base text-[#062A5A] hover:text-[#0969C7] transition-colors py-0.5"
                    >
                      {FIRM_DETAILS.phone2}
                    </a>
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
                    href={`mailto:${FIRM_DETAILS.email}`}
                    className="font-medium text-xs xs:text-sm sm:text-base text-[#062A5A] hover:text-[#0969C7] transition-colors break-all block py-0.5"
                  >
                    {FIRM_DETAILS.email}
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
                    102, Shourie Complex,<br />
                    Bombay Bazaar, Andheri (W),<br />
                    Mumbai – 400058, Maharashtra
                  </p>
                  <span className="text-[10px] xs:text-[11px] text-[#667085] mt-0.5 block">
                    Conveniently accessible via Andheri Railway &amp; Metro Stations
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
                    Consultation Hours
                  </h4>
                  <p className="text-xs xs:text-sm text-[#172033]">
                    {FIRM_DETAILS.workingHours}
                  </p>
                  <span className="text-[10px] xs:text-[11px] text-[#667085] mt-0.5 block">
                    Prior appointments recommended for in-person meetings
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#F7F9FC] rounded-2xl p-4 xs:p-5 sm:p-7 md:p-8 border border-[#D9E2EC] shadow-sm text-left">
            <h3 className="font-manrope font-bold text-lg xs:text-xl sm:text-2xl text-[#062A5A] mb-1.5">
              Request a Professional Consultation
            </h3>
            <p className="text-xs xs:text-sm text-[#667085] mb-5">
              Complete this brief inquiry form and our Chartered Accountancy desk will connect with you promptly.
            </p>

            {validationError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-5 sm:p-8 rounded-xl bg-white border border-[#159447]/30 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-[#159447]/10 text-[#159447] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
                  Thank You, {formData.name}!
                </h4>
                <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto leading-relaxed">
                  Your consultation request regarding <strong className="text-[#062A5A]">{formData.serviceRequired}</strong> has been received by CA Krishna Panjiyar. We will call you at <strong className="text-[#062A5A]">{formData.phone}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', serviceRequired: 'Income Tax Services', message: '' });
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-[#062A5A] bg-[#EEF5FC] hover:bg-[#D9E2EC] rounded-xl transition-colors min-h-[44px]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] xs:text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-white border border-[#D9E2EC] focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden text-xs xs:text-sm text-[#172033] transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] xs:text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98200XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-white border border-[#D9E2EC] focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden text-xs xs:text-sm text-[#172033] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email */}
                  <div>
                    <label className="block text-[11px] xs:text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-white border border-[#D9E2EC] focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden text-xs xs:text-sm text-[#172033] transition-colors"
                    />
                  </div>

                  {/* Service Required */}
                  <div>
                    <label className="block text-[11px] xs:text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                      Service Required *
                    </label>
                    <select
                      value={formData.serviceRequired}
                      onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-white border border-[#D9E2EC] focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden text-xs xs:text-sm text-[#172033] transition-colors"
                    >
                      {CORE_SERVICES.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                      <option value="Other Advisory">Other Advisory / Litigation</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] xs:text-xs font-semibold uppercase tracking-wider text-[#172033] mb-1">
                    Brief Requirement / Context
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your tax filing, business entity, audit requirement, or loan proposal..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#D9E2EC] focus:border-[#0969C7] focus:ring-2 focus:ring-[#0969C7]/20 outline-hidden text-xs xs:text-sm text-[#172033] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 min-h-[44px] text-xs xs:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] active:scale-[0.99] rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Request Consultation</span>
                      <Send size={15} />
                    </>
                  )}
                </button>

                <p className="text-[10px] xs:text-[11px] text-[#667085] text-center mt-1.5">
                  Information shared is governed by strict ICAI confidentiality and professional privilege.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Below: Google Map based on verified office address */}
        <div className="rounded-2xl border border-[#D9E2EC] overflow-hidden shadow-sm">
          <div className="bg-[#F7F9FC] px-4 xs:px-5 sm:px-6 py-3.5 border-b border-[#D9E2EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-left">
            <div>
              <h4 className="font-manrope font-bold text-xs xs:text-sm sm:text-base text-[#062A5A]">
                Office Location Map &middot; Andheri West, Mumbai
              </h4>
              <p className="text-[11px] xs:text-xs text-[#667085]">
                102, Shourie Complex, Bombay Bazaar, Andheri (W), Mumbai – 400058
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=102+Shourie+Complex+Bombay+Bazaar+Andheri+West+Mumbai+400058"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0969C7] hover:underline py-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="w-full h-64 xs:h-72 sm:h-80 md:h-96 bg-slate-100 relative">
            <iframe
              title="PANJIYAR KRISHNA & CO. Office Location"
              src="https://maps.google.com/maps?q=102%20Shourie%20Complex%20Bombay%20Bazaar%20Andheri%20West%20Mumbai%20400058&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
