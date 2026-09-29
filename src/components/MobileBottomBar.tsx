import React from 'react';
import { Phone, Calendar } from 'lucide-react';
import { WhatsAppOfficialIcon } from './FloatingContactPanel';
import { useSiteContent } from '../context/SiteContentContext';

interface MobileBottomBarProps {
  onOpenConsultation: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenConsultation }) => {
  const { state } = useSiteContent();
  const { firmDetails } = state;

  // WhatsApp direct link using the firm's primary contact number
  const whatsappUrl = `https://wa.me/91${firmDetails.phone1}?text=${encodeURIComponent(
    `Hello ${firmDetails.founder}, I would like to schedule a Chartered Accountancy consultation regarding taxation and compliance.`
  )}`;

  return (
    <aside 
      aria-label="Mobile quick action navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#062A5A] text-white border-t border-[#0969C7]/40 shadow-2xl px-2 py-2 safe-area-bottom"
    >
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* [ CALL ] */}
        <a
          href={`tel:${firmDetails.phone1}`}
          className="flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all min-h-[46px]"
          aria-label={`Call ${firmDetails.phone1}`}
        >
          <Phone size={16} className="text-[#F28C18] mb-0.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">CALL</span>
        </a>

        {/* [ WHATSAPP ] */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 transition-all text-white min-h-[46px]"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppOfficialIcon className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">WHATSAPP</span>
        </a>

        {/* [ CONSULT ] */}
        <button
          onClick={onOpenConsultation}
          className="flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-[#0969C7] hover:bg-[#085cb0] active:scale-95 transition-all text-white min-h-[46px]"
          aria-label="Book a Consultation"
        >
          <Calendar size={16} className="text-[#F28C18] mb-0.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">CONSULT</span>
        </button>
      </div>
    </aside>
  );
};
