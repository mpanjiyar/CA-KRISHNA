import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Briefcase,
  LogOut
} from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';
import { BrandHeaderLockup } from './CaLogo';
import { WhatsAppOfficialIcon } from './FloatingContactPanel';
import { PageRoute } from '../types';
import { useFirmData } from '../context/FirmDataContext';
import { useVaultAuth } from '../context/VaultAuthContext';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, serviceId?: string) => void;
  onOpenConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenConsultation
}) => {
  const { firmDetails, services } = useFirmData();
  const { user: vaultAuthUser, logout: vaultLogout } = useVaultAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll detection for navbar elevation & shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on Escape key & lock scroll when drawer open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setServicesMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setServicesMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesMenuOpen(false);
    }, 180);
  };

  const handleNav = (route: PageRoute, serviceId?: string) => {
    onNavigate(route, serviceId);
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
  };

  const isServicesActive = currentRoute === 'services' || currentRoute === 'service-detail';

  return (
    <header className="w-full sticky top-0 z-40 transition-all duration-200">
      {/* 1. Top Information Bar (Navy Background) */}
      <div className="bg-[#062A5A] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-[#0969C7]/20 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Left Text */}
          <div className="flex items-center gap-1.5 text-slate-200 font-normal truncate min-w-0">
            <span className="font-semibold text-[#F28C18] flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#159447] animate-pulse" />
              <span>Chartered Accountants</span>
            </span>
            <span className="text-slate-400 hidden xs:inline">|</span>
            <span className="truncate hidden sm:inline text-slate-300">Tax &middot; GST &middot; Audit &middot; Compliance</span>
            <span className="truncate hidden xs:inline sm:hidden text-[10.5px] text-slate-300">Andheri (W), Mumbai</span>
          </div>

          {/* Right Direct Links */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-100 shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Phone size={12} className="text-[#F28C18] shrink-0" />
              <span className="hidden md:inline text-[10.5px] uppercase tracking-wider text-slate-300">Direct:</span>
              <a
                href={`tel:${firmDetails.phone1}`}
                className="font-semibold text-[11px] sm:text-xs hover:text-[#F28C18] transition-colors focus-visible:underline min-h-[30px] flex items-center"
                aria-label={`Call ${firmDetails.phone1}`}
              >
                {firmDetails.phone1}
              </a>
              <span className="text-slate-400 hidden sm:inline">/</span>
              <a
                href={`tel:${firmDetails.phone2}`}
                className="font-semibold text-xs hover:text-[#F28C18] transition-colors focus-visible:underline hidden sm:flex items-center min-h-[30px]"
                aria-label={`Call ${firmDetails.phone2}`}
              >
                {firmDetails.phone2}
              </a>
            </div>

            <span className="hidden lg:inline text-slate-500">|</span>

            <a
              href={`mailto:${firmDetails.email}`}
              className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors text-slate-300 text-xs min-h-[30px]"
              aria-label={`Email ${firmDetails.email}`}
            >
              <Mail size={13} className="text-[#F28C18]" />
              <span className="truncate max-w-[200px]">{firmDetails.email}</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar with Uncrowded Layout & Zero Overlapping */}
      <nav 
        aria-label="Main Navigation" 
        className={`w-full bg-white transition-all duration-200 border-b border-[#D9E2EC] ${
          isScrolled ? 'shadow-md py-1.5 sm:py-2' : 'shadow-2xs py-2 sm:py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Lockup with CA India Logo */}
          <div className="shrink-0 max-w-[70vw] sm:max-w-none">
            <BrandHeaderLockup onClick={() => handleNav('home')} />
          </div>

          {/* Desktop Navigation Links (xl+ for full spacious bar, lg with compact spacing) */}
          <div className="hidden xl:flex items-center gap-1 lg:gap-1.5 text-[13.5px] font-medium text-[#172033]">
            {/* Home */}
            <button
              onClick={() => handleNav('home')}
              aria-current={currentRoute === 'home' ? 'page' : undefined}
              className={`py-1.5 px-3 rounded-lg transition-all min-h-[38px] flex items-center whitespace-nowrap ${
                currentRoute === 'home' 
                  ? 'text-[#062A5A] font-bold bg-[#EEF5FC] shadow-2xs' 
                  : 'text-[#172033] hover:text-[#0969C7] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* About Us */}
            <button
              onClick={() => handleNav('about')}
              aria-current={currentRoute === 'about' ? 'page' : undefined}
              className={`py-1.5 px-3 rounded-lg transition-all min-h-[38px] flex items-center whitespace-nowrap ${
                currentRoute === 'about' 
                  ? 'text-[#062A5A] font-bold bg-[#EEF5FC] shadow-2xs' 
                  : 'text-[#172033] hover:text-[#0969C7] hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            {/* Services with Touch-Friendly & Hover Mega Menu Dropdown */}
            <div
              ref={servicesDropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                aria-expanded={servicesMenuOpen}
                aria-haspopup="true"
                aria-current={isServicesActive ? 'page' : undefined}
                className={`py-1.5 px-3 flex items-center gap-1 rounded-lg transition-all min-h-[38px] whitespace-nowrap ${
                  isServicesActive 
                    ? 'text-[#062A5A] font-bold bg-[#EEF5FC] shadow-2xs' 
                    : 'text-[#172033] hover:text-[#0969C7] hover:bg-slate-50'
                }`}
              >
                <span>Services</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180 text-[#0969C7]' : ''}`} />
              </button>

              {/* Mega Menu Dropdown Content */}
              {servicesMenuOpen && (
                <div 
                  role="menu"
                  className="absolute top-full left-0 w-[640px] bg-white rounded-2xl shadow-2xl border border-[#D9E2EC] p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left mt-2"
                >
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#D9E2EC]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-[#0969C7]" />
                        <h4 className="font-manrope font-bold text-xs uppercase tracking-wider text-[#062A5A]">
                          Chartered Accountancy Practice Areas
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#667085] mt-0.5">
                        Statutory audit, direct tax planning, GST filings, and business financing
                      </p>
                    </div>
                    <button
                      onClick={() => handleNav('services')}
                      className="text-xs font-semibold text-[#0969C7] hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#EEF5FC] transition-colors"
                    >
                      View All Services <ArrowRight size={12} />
                    </button>
                  </div>

                  {/* 2-Column Responsive Service Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        role="menuitem"
                        onClick={() => handleNav('service-detail', srv.id)}
                        className="group/item p-2.5 rounded-xl hover:bg-[#EEF5FC] transition-all cursor-pointer text-left border border-transparent hover:border-[#D9E2EC] min-h-[46px] flex flex-col justify-center"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs sm:text-[13px] text-[#062A5A] group-hover/item:text-[#0969C7] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0969C7]/50 group-hover/item:bg-[#0969C7]" />
                            {srv.name}
                          </span>
                          <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 text-[#0969C7] transition-opacity shrink-0" />
                        </div>
                        <p className="text-[11px] text-[#667085] mt-0.5 line-clamp-1 pl-3">
                          {srv.shortDesc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3.5 pt-3.5 border-t border-[#D9E2EC] flex items-center justify-between text-[11px] text-[#667085]">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#F28C18]" />
                      <span>Andheri (W), Mumbai &middot; PAN India Virtual Desk</span>
                    </div>
                    <button
                      onClick={() => handleNav('location-andheri')}
                      className="font-semibold text-[#0969C7] hover:underline flex items-center gap-1"
                    >
                      Visit Andheri Office &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Industries */}
            <button
              onClick={() => handleNav('industries')}
              aria-current={currentRoute === 'industries' ? 'page' : undefined}
              className={`py-1.5 px-3 rounded-lg transition-all min-h-[38px] flex items-center whitespace-nowrap ${
                currentRoute === 'industries' 
                  ? 'text-[#062A5A] font-bold bg-[#EEF5FC] shadow-2xs' 
                  : 'text-[#172033] hover:text-[#0969C7] hover:bg-slate-50'
              }`}
            >
              Industries
            </button>

            {/* Andheri Office */}
            <button
              onClick={() => handleNav('location-andheri')}
              aria-current={currentRoute === 'location-andheri' ? 'page' : undefined}
              className={`py-1.5 px-3 flex items-center gap-1 rounded-lg transition-all min-h-[38px] whitespace-nowrap ${
                currentRoute === 'location-andheri' 
                  ? 'text-[#062A5A] font-bold bg-[#EEF5FC] shadow-2xs' 
                  : 'text-[#172033] hover:text-[#0969C7] hover:bg-slate-50'
              }`}
            >
              <MapPin size={14} className="text-[#F28C18]" />
              <span>Andheri Office</span>
            </button>

            {/* Client Vault */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleNav('portal')}
                aria-current={currentRoute === 'portal' ? 'page' : undefined}
                className={`py-1.5 px-3 flex items-center gap-1.5 rounded-lg transition-all min-h-[38px] whitespace-nowrap ${
                  currentRoute === 'portal' 
                    ? 'text-[#062A5A] font-bold bg-[#EEF5FC] shadow-2xs' 
                    : 'text-[#172033] hover:text-[#0969C7] hover:bg-slate-50'
                }`}
              >
                <ShieldCheck size={14} className="text-[#159447]" />
                <span>Client Vault</span>
                {vaultAuthUser && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title={`Authenticated as ${vaultAuthUser.fullName}`} />
                )}
              </button>

              {vaultAuthUser && (
                <button
                  type="button"
                  onClick={async () => {
                    await vaultLogout();
                    handleNav('portal');
                  }}
                  className="p-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign out of Client Vault session"
                  aria-label="Sign out of Client Vault"
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>

            {/* Contact */}
            <button
              onClick={() => handleNav('contact')}
              aria-current={currentRoute === 'contact' ? 'page' : undefined}
              className={`py-1.5 px-3 rounded-lg transition-all min-h-[38px] flex items-center whitespace-nowrap ${
                currentRoute === 'contact' 
                  ? 'text-[#062A5A] font-bold bg-[#EEF5FC] shadow-2xs' 
                  : 'text-[#172033] hover:text-[#0969C7] hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Right Action Area - Clean & Uncrowded */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Consultation CTA button on Tablets & Desktops */}
            <button
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-[13px] font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] active:scale-[0.98] rounded-xl shadow-xs transition-all duration-150 border border-[#062A5A] hover:border-[#F28C18] min-h-[40px] whitespace-nowrap"
            >
              <Sparkles size={14} className="text-[#F28C18]" />
              <span>Book Consultation</span>
            </button>

            {/* Mobile/Tablet Menu Button (shows on screens < xl) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden flex items-center gap-1.5 px-3 py-2 bg-[#F7F9FC] hover:bg-[#EEF5FC] text-[#062A5A] border border-[#D9E2EC] rounded-xl min-h-[42px] min-w-[42px] justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#0969C7]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="text-xs font-bold sm:inline hidden uppercase tracking-wider text-[#062A5A]">
                {mobileMenuOpen ? 'Close' : 'Menu'}
              </span>
            </button>
          </div>

        </div>
      </nav>

      {/* 3. Mobile / Tablet Slide-in Drawer with Backdrop Blur */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          
          {/* Clickable Backdrop Area */}
          <div 
            className="flex-1" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true" 
          />

          {/* Drawer Content Container: Sized appropriately for 320px to tablet */}
          <div 
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
            className="bg-white border-l border-[#D9E2EC] shadow-2xl h-full w-[min(340px,88vw)] flex flex-col justify-between p-4 xs:p-5 text-left animate-in slide-in-from-right duration-250 z-50 overflow-y-auto"
          >
            {/* Drawer Top Header */}
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#D9E2EC] mb-3.5">
                <div className="min-w-0 pr-2">
                  <BrandHeaderLockup onClick={() => handleNav('home')} />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links Stack with Explicit Active States & Touch Hitboxes */}
              <div className="flex flex-col space-y-1.5 text-sm font-medium text-[#172033]">
                {/* Home */}
                <button
                  onClick={() => handleNav('home')}
                  className={`text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between min-h-[44px] transition-colors ${
                    currentRoute === 'home' 
                      ? 'bg-[#EEF5FC] text-[#062A5A] font-bold border-l-4 border-[#0969C7] shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>Home</span>
                  {currentRoute === 'home' && (
                    <span className="text-[11px] bg-[#0969C7] text-white px-2 py-0.5 rounded font-semibold">Active</span>
                  )}
                </button>

                {/* About Us */}
                <button
                  onClick={() => handleNav('about')}
                  className={`text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between min-h-[44px] transition-colors ${
                    currentRoute === 'about' 
                      ? 'bg-[#EEF5FC] text-[#062A5A] font-bold border-l-4 border-[#0969C7] shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>About Us (Firm &amp; Founder)</span>
                  {currentRoute === 'about' && (
                    <span className="text-[11px] bg-[#0969C7] text-white px-2 py-0.5 rounded font-semibold">Active</span>
                  )}
                </button>

                {/* Services Section with Touch-Friendly Submenu */}
                <div className={`rounded-xl overflow-hidden border transition-all ${
                  isServicesActive ? 'border-[#0969C7]/40 bg-[#EEF5FC]/30' : 'border-slate-200'
                }`}>
                  <div className="flex items-center justify-between py-1 px-1.5">
                    <button
                      onClick={() => handleNav('services')}
                      className={`text-left py-2 px-2.5 flex-1 min-h-[44px] flex items-center justify-between ${
                        isServicesActive ? 'text-[#062A5A] font-bold' : 'hover:text-[#0969C7]'
                      }`}
                    >
                      <span>Practice Areas</span>
                      <span className="text-[10px] bg-[#062A5A] text-white px-2 py-0.5 rounded font-mono">8 Areas</span>
                    </button>
                    <button
                      onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
                      className="p-2 text-slate-500 hover:text-[#062A5A] hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                      aria-label={mobileServicesExpanded ? 'Collapse Services' : 'Expand Services'}
                    >
                      <ChevronDown size={18} className={`transition-transform duration-200 ${mobileServicesExpanded ? 'rotate-180 text-[#0969C7]' : ''}`} />
                    </button>
                  </div>

                  {/* Submenu with 44px minimum touch targets */}
                  {mobileServicesExpanded && (
                    <div className="p-2 bg-white space-y-1 text-xs text-[#667085] border-t border-slate-100">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleNav('service-detail', s.id)}
                          className="flex items-center justify-between text-left py-2.5 px-3 hover:text-[#062A5A] hover:bg-[#EEF5FC] rounded-lg min-h-[44px] w-full font-medium"
                        >
                          <span className="truncate">&bull; {s.name}</span>
                          <ArrowRight size={12} className="text-[#0969C7] shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Industries */}
                <button
                  onClick={() => handleNav('industries')}
                  className={`text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between min-h-[44px] transition-colors ${
                    currentRoute === 'industries' 
                      ? 'bg-[#EEF5FC] text-[#062A5A] font-bold border-l-4 border-[#0969C7] shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>Industries We Serve</span>
                  <span className="text-[10px] text-slate-400 font-mono">10 Sectors</span>
                </button>

                {/* Andheri Office */}
                <button
                  onClick={() => handleNav('location-andheri')}
                  className={`text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between min-h-[44px] transition-colors ${
                    currentRoute === 'location-andheri' 
                      ? 'bg-[#EEF5FC] text-[#062A5A] font-bold border-l-4 border-[#0969C7] shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#F28C18]" />
                    <span>Andheri West Office</span>
                  </div>
                  <span className="text-[10px] bg-[#F28C18]/10 text-[#F28C18] px-2 py-0.5 rounded font-medium">Mumbai</span>
                </button>

                {/* Client Vault */}
                <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/50">
                  <button
                    onClick={() => handleNav('portal')}
                    className={`w-full text-left py-2.5 px-3.5 flex items-center justify-between min-h-[44px] transition-colors ${
                      currentRoute === 'portal' 
                        ? 'bg-[#EEF5FC] text-[#062A5A] font-bold border-l-4 border-[#0969C7]' 
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} className="text-[#159447]" />
                      <span>Client Vault</span>
                      {vaultAuthUser && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] bg-[#159447]/10 text-[#159447] px-2 py-0.5 rounded font-medium">
                      {vaultAuthUser ? 'Active Session' : 'AES-256'}
                    </span>
                  </button>

                  {vaultAuthUser && (
                    <div className="px-3.5 py-2 bg-rose-50/80 border-t border-rose-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-600 truncate max-w-[170px] font-medium">
                        {vaultAuthUser.fullName}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          setMobileMenuOpen(false);
                          await vaultLogout();
                          handleNav('portal');
                        }}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <LogOut size={12} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <button
                  onClick={() => handleNav('contact')}
                  className={`text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between min-h-[44px] transition-colors ${
                    currentRoute === 'contact' 
                      ? 'bg-[#EEF5FC] text-[#062A5A] font-bold border-l-4 border-[#0969C7] shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>Contact &amp; Location</span>
                  {currentRoute === 'contact' && (
                    <span className="text-[11px] bg-[#0969C7] text-white px-2 py-0.5 rounded font-semibold">Active</span>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Contact Tray in Drawer Bottom */}
            <div className="mt-4 pt-3.5 border-t border-slate-200">
              <p className="text-[11px] text-[#667085] mb-2 font-medium">Direct Partner Line (CA Krishna Panjiyar):</p>
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <a
                  href={`tel:${FIRM_DETAILS.phone1}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-1.5 text-xs font-semibold bg-[#EEF5FC] text-[#062A5A] hover:bg-[#D9E2EC] rounded-xl min-h-[44px] truncate"
                >
                  <Phone size={13} className="text-[#F28C18] shrink-0" />
                  <span className="truncate">{FIRM_DETAILS.phone1}</span>
                </a>
                <a
                  href={`https://wa.me/91${FIRM_DETAILS.phone1}?text=${encodeURIComponent('Hello CA Krishna Panjiyar, I would like to consult with you.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-1.5 text-xs font-semibold bg-[#25D366]/15 text-[#159447] hover:bg-[#25D366]/25 rounded-xl min-h-[44px] truncate"
                >
                  <WhatsAppOfficialIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3 bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold rounded-xl text-center min-h-[46px] shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.99] transition-all"
              >
                <Sparkles size={15} className="text-[#F28C18]" />
                <span>Book a Consultation</span>
              </button>
            </div>

          </div>

        </div>
      )}
    </header>
  );
};
