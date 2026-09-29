import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  CornerDownLeft, 
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { CORE_SERVICES, GENERAL_FAQS, INDUSTRIES_SERVED, FIRM_DETAILS } from '../data/firmData';
import { PageRoute } from '../types';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: 'Service' | 'FAQ' | 'Resource' | 'Industry';
  route: PageRoute;
  serviceId?: string;
  faqAnswer?: string;
  keywordMatch?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: PageRoute, serviceId?: string) => void;
  onOpenConsultation: (serviceName?: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenConsultation
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Service' | 'FAQ' | 'Resource' | 'Industry'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Aggregate searchable items
  const allSearchableItems: SearchResultItem[] = [
    // 1. All Core Services & Sub-services
    ...CORE_SERVICES.map((s) => ({
      id: `srv-${s.id}`,
      title: s.name,
      description: `${s.shortDesc} Includes: ${s.subServices.slice(0, 3).join(', ')}`,
      category: 'Service' as const,
      route: 'service-detail' as PageRoute,
      serviceId: s.id,
      keywordMatch: `${s.category} ${s.subServices.join(' ')} ${s.documentsRequired.join(' ')}`
    })),

    // Sub-service items for high precision
    ...CORE_SERVICES.flatMap((s) => 
      s.subServices.map((sub, idx) => ({
        id: `sub-${s.id}-${idx}`,
        title: sub,
        description: `Part of ${s.name} practice. Professional filing and statutory compliance support.`,
        category: 'Service' as const,
        route: 'service-detail' as PageRoute,
        serviceId: s.id,
        keywordMatch: `${s.name} ${s.category}`
      }))
    ),

    // 2. All General FAQs
    ...GENERAL_FAQS.map((faq, idx) => ({
      id: `faq-gen-${idx}`,
      title: faq.question,
      description: faq.answer,
      category: 'FAQ' as const,
      route: 'home' as PageRoute,
      faqAnswer: faq.answer,
      keywordMatch: 'frequently asked questions inquiry doubts clarification'
    })),

    // 3. Service specific FAQs
    ...CORE_SERVICES.flatMap((s) => 
      s.faqs.map((faq, idx) => ({
        id: `faq-${s.id}-${idx}`,
        title: faq.question,
        description: faq.answer,
        category: 'FAQ' as const,
        route: 'service-detail' as PageRoute,
        serviceId: s.id,
        faqAnswer: faq.answer,
        keywordMatch: `${s.name} ${s.category}`
      }))
    ),

    // 4. Sector / Industry Advisories
    ...INDUSTRIES_SERVED.map((ind, idx) => ({
      id: `ind-${idx}`,
      title: ind.name,
      description: ind.desc,
      category: 'Industry' as const,
      route: 'industries' as PageRoute,
      keywordMatch: 'sector industry business trading startup manufacturing'
    })),

    // 5. Office & Key Pages
    {
      id: 'res-andheri',
      title: 'Andheri West Office (102, Shourie Complex)',
      description: 'Physical Chartered Accountancy office details, Bombay Bazaar, Andheri (W), Mumbai – 400058.',
      category: 'Resource' as const,
      route: 'location-andheri' as PageRoute,
      keywordMatch: 'address location map visit mumbai andheri shourie complex'
    },
    {
      id: 'res-founder',
      title: 'Meet CA Krishna Panjiyar (Founder)',
      description: 'Founder & Chartered Accountant leading PANJIYAR KRISHNA & CO. Direct partner advisory.',
      category: 'Resource' as const,
      route: 'about' as PageRoute,
      keywordMatch: 'krishna panjiyar founder ca partner qualifications contact'
    },
    {
      id: 'res-vault',
      title: 'Client Document & Verification Vault',
      description: 'End-to-end encrypted document management with simulated AES-256 and SHA-256 checksums.',
      category: 'Resource' as const,
      route: 'portal' as PageRoute,
      keywordMatch: 'upload verify client portal document encryption vault audit'
    },
    {
      id: 'res-contact',
      title: 'Contact & Consultation Desk',
      description: `Call ${FIRM_DETAILS.phone1} / ${FIRM_DETAILS.phone2} or email ${FIRM_DETAILS.email}.`,
      category: 'Resource' as const,
      route: 'contact' as PageRoute,
      keywordMatch: 'phone number telephone email address query meeting'
    }
  ];

  // Filtering results
  const q = query.toLowerCase().trim();
  const filteredResults = allSearchableItems.filter((item) => {
    const matchesCategory = activeFilter === 'ALL' || item.category === activeFilter;
    if (!matchesCategory) return false;

    if (!q) {
      // Default recommended results when query is empty
      return item.id.startsWith('srv-') || item.id === 'res-andheri' || item.id === 'faq-gen-0';
    }

    const matchesTitle = item.title.toLowerCase().includes(q);
    const matchesDesc = item.description.toLowerCase().includes(q);
    const matchesKeyword = item.keywordMatch ? item.keywordMatch.toLowerCase().includes(q) : false;

    return matchesTitle || matchesDesc || matchesKeyword;
  }).slice(0, 10); // Limit to top 10 relevant matches

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredResults.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredResults.length || 1)) % (filteredResults.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.route, item.serviceId);
    onClose();
  };

  if (!isOpen) return null;

  const getCategoryBadge = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Service':
        return { label: 'Service', color: 'bg-[#EEF5FC] text-[#0969C7] border-[#0969C7]/20' };
      case 'FAQ':
        return { label: 'FAQ Query', color: 'bg-[#159447]/10 text-[#159447] border-[#159447]/20' };
      case 'Industry':
        return { label: 'Industry', color: 'bg-[#F28C18]/10 text-[#F28C18] border-[#F28C18]/20' };
      case 'Resource':
        return { label: 'Firm Resource', color: 'bg-[#062A5A]/10 text-[#062A5A] border-[#062A5A]/20' };
    }
  };

  const getItemIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Service':
        return <FileText className="w-4 h-4 text-[#0969C7]" />;
      case 'FAQ':
        return <HelpCircle className="w-4 h-4 text-[#159447]" />;
      case 'Industry':
        return <Briefcase className="w-4 h-4 text-[#F28C18]" />;
      case 'Resource':
        return <MapPin className="w-4 h-4 text-[#062A5A]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#D9E2EC] overflow-hidden flex flex-col max-h-[82vh] text-left animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#D9E2EC] flex items-center gap-3 bg-white sticky top-0 z-10">
          <Search size={20} className="text-[#0969C7] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search services (ITR, GST, Audit, CMA), FAQs, or Andheri office..."
            className="w-full text-base sm:text-lg text-[#172033] placeholder-slate-400 outline-hidden bg-transparent font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              aria-label="Clear query"
            >
              <X size={18} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 rounded border border-slate-200">
              ESC
            </kbd>
          )}
          <button
            onClick={onClose}
            className="sm:hidden p-1 rounded-md text-slate-400 hover:text-slate-700"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 bg-[#F7F9FC] border-b border-[#D9E2EC] flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[#667085] font-semibold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
            Filter:
          </span>
          {(['ALL', 'Service', 'FAQ', 'Industry', 'Resource'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-[#062A5A] text-white shadow-2xs'
                  : 'bg-white text-[#667085] hover:text-[#062A5A] border border-[#D9E2EC]'
              }`}
            >
              {cat === 'ALL' ? 'All Results' : cat === 'Service' ? 'Services' : cat === 'FAQ' ? 'FAQs' : cat === 'Industry' ? 'Industries' : 'Offices & Resources'}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto divide-y divide-slate-100 flex-1">
          {filteredResults.length > 0 ? (
            <div className="space-y-1">
              {!query && (
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                  Recommended Practice Areas &amp; Inquiries
                </div>
              )}

              {filteredResults.map((item, index) => {
                const isSelected = selectedIndex === index;
                const badge = getCategoryBadge(item.category);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 text-left ${
                      isSelected
                        ? 'bg-[#EEF5FC] border border-[#0969C7]/30 shadow-2xs'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-white border border-[#D9E2EC] shrink-0 mt-0.5">
                        {getItemIcon(item.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-manrope font-bold text-sm sm:text-base text-[#062A5A] truncate">
                            {item.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>

                        <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* If it's an FAQ, display answer snippet directly */}
                        {item.faqAnswer && (
                          <div className="mt-2 p-2 bg-white rounded-md border border-[#D9E2EC] text-[11px] text-[#172033]/90 leading-relaxed font-normal">
                            <strong className="text-[#0969C7]">Answer:</strong> {item.faqAnswer}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#0969C7] shrink-0 mt-1">
                      <span>Open</span>
                      <CornerDownLeft size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#EEF5FC] text-[#0969C7] flex items-center justify-center mx-auto mb-3">
                <Search size={24} />
              </div>
              <h4 className="font-manrope font-bold text-base text-[#062A5A] mb-1">
                No matching results found for &ldquo;{query}&rdquo;
              </h4>
              <p className="text-xs text-[#667085] max-w-sm mx-auto mb-5 leading-relaxed">
                Try searching for keywords like &ldquo;Income Tax&rdquo;, &ldquo;GST Return&rdquo;, &ldquo;CMA Data&rdquo;, &ldquo;Audit&rdquo;, or &ldquo;Andheri Office&rdquo;.
              </p>

              <button
                onClick={() => {
                  onClose();
                  onOpenConsultation(query);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-lg transition-colors shadow-2xs"
              >
                <span>Ask CA Krishna Panjiyar Directly</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-[#F7F9FC] border-t border-[#D9E2EC] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#667085] gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">esc</kbd>
              <span>to dismiss</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#062A5A] font-semibold">
            <PhoneCall size={12} className="text-[#F28C18]" />
            <a href={`tel:${FIRM_DETAILS.phone1}`} className="hover:underline">
              Quick Call: {FIRM_DETAILS.phone1}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
