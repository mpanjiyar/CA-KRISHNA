/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { AboutSection } from './components/AboutSection';
import { FounderSection } from './components/FounderSection';
import { CoreServices } from './components/CoreServices';
import { WhyChooseUs } from './components/WhyChooseUs';
import { BrandStatement } from './components/BrandStatement';
import { IndustriesSection } from './components/IndustriesSection';
import { WhoWeHelp } from './components/WhoWeHelp';
import { SpecializedSections } from './components/SpecializedSections';
import { ProcessTimeline } from './components/ProcessTimeline';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { FinalHomeCta } from './components/FinalHomeCta';
import { ContactSection } from './components/ContactSection';
import { ProjectsSection } from './components/ProjectsSection';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import { ConsultationModal } from './components/ConsultationModal';
import { ServiceDetailPage } from './components/ServiceDetailPage';
import { LocationAndheriPage } from './components/LocationAndheriPage';
import { AboutFullPage } from './components/AboutFullPage';
import { ClientPortal } from './components/ClientPortal';
import { FloatingContactPanel } from './components/FloatingContactPanel';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { AdminRoute } from './components/AdminRoute';
import { PageRoute } from './types';
import { CORE_SERVICES, FIRM_DETAILS } from './data/firmData';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/')) {
        return 'admin';
      }
    }
    return 'home';
  });
  const [selectedServiceId, setSelectedServiceId] = useState<string>('income-tax');
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [consultationDefaultService, setConsultationDefaultService] = useState('Income Tax Services');

  // Handle URL synchronizing for /admin and popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top upon route change and update URL history if appropriate
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      const targetPath = currentRoute === 'admin' ? '/admin' : '/';
      if (window.location.pathname !== targetPath && (currentRoute === 'admin' || window.location.pathname === '/admin')) {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, [currentRoute, selectedServiceId]);

  const handleNavigate = (route: PageRoute, serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
      setCurrentRoute('service-detail');
    } else {
      setCurrentRoute(route);
    }
  };

  const handleOpenConsultation = (serviceName?: string) => {
    if (serviceName) {
      setConsultationDefaultService(serviceName);
    }
    setConsultationModalOpen(true);
  };

  const handleExploreServices = () => {
    const srvElem = document.getElementById('services-section');
    if (srvElem && currentRoute === 'home') {
      srvElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentRoute('services');
    }
  };

  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] font-inter">
        <ScrollProgressBar />
        <AdminRoute onBackToWebsite={() => setCurrentRoute('home')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] font-inter pb-16 md:pb-0">
      {/* Scroll Progress Indicator Line (Every Page) */}
      <ScrollProgressBar />

      {/* Main Header with Top Navy Info Bar & Desktop Mega Menu */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW 1: Home View (Full Landing Experience) */}
        {currentRoute === 'home' && (
          <>
            <Hero
              onOpenConsultation={() => handleOpenConsultation()}
              onExploreServices={handleExploreServices}
            />

            <TrustStrip />

            <AboutSection
              onLearnMore={() => setCurrentRoute('about')}
              onOpenConsultation={() => handleOpenConsultation()}
            />

            <FounderSection />

            <CoreServices
              onSelectService={(id) => handleNavigate('service-detail', id)}
              onOpenConsultation={() => handleOpenConsultation()}
            />

            <WhyChooseUs />

            <BrandStatement />

            <IndustriesSection
              onOpenConsultation={() => handleOpenConsultation('Sector Specific Advisory')}
            />

            <WhoWeHelp
              onOpenConsultation={() => handleOpenConsultation()}
            />

            <SpecializedSections
              onOpenConsultation={() => handleOpenConsultation()}
              onSelectService={(id) => handleNavigate('service-detail', id)}
            />

            <ProcessTimeline />

            <ProjectsSection
              onOpenConsultation={() => handleOpenConsultation('Client Project Mandate')}
            />

            <TestimonialsSection />

            <FaqSection
              onOpenConsultation={() => handleOpenConsultation()}
            />

            <FinalHomeCta
              onOpenConsultation={() => handleOpenConsultation()}
            />
          </>
        )}

        {/* VIEW 2: About Us Full Page */}
        {currentRoute === 'about' && (
          <AboutFullPage
            onOpenConsultation={() => handleOpenConsultation()}
            onNavigateToIndustries={() => setCurrentRoute('industries')}
            onNavigateToContact={() => setCurrentRoute('contact')}
          />
        )}

        {/* VIEW 3: Dedicated Service Detail Page */}
        {currentRoute === 'service-detail' && (
          <ServiceDetailPage
            serviceId={selectedServiceId}
            onBack={() => setCurrentRoute('home')}
            onSelectRelated={(id) => handleNavigate('service-detail', id)}
            onOpenConsultation={() => {
              const svc = CORE_SERVICES.find(s => s.id === selectedServiceId);
              handleOpenConsultation(svc ? svc.name : undefined);
            }}
          />
        )}

        {/* VIEW 4: All Services Catalog */}
        {currentRoute === 'services' && (
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border-b border-[#D9E2EC] pb-8 mb-10 text-left">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#0969C7] mb-2 block">
                  Comprehensive Practice Portfolio
                </span>
                <h1 className="font-manrope text-3xl sm:text-4xl font-bold text-[#062A5A] mb-3">
                  Chartered Accountancy Services
                </h1>
                <p className="text-base text-[#667085] max-w-3xl">
                  {FIRM_DETAILS.name} delivers complete direct tax, GST, statutory audit, corporate secretarial, and bank financing solutions tailored to your enterprise.
                </p>
              </div>

              <CoreServices
                onSelectService={(id) => handleNavigate('service-detail', id)}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            </div>
          </div>
        )}

        {/* VIEW 5: Location SEO (Andheri Mumbai) */}
        {currentRoute === 'location-andheri' && (
          <LocationAndheriPage
            onOpenConsultation={() => handleOpenConsultation('Andheri Office In-Person')}
            onSelectService={(id) => handleNavigate('service-detail', id)}
          />
        )}

        {/* VIEW 6: Industries View */}
        {currentRoute === 'industries' && (
          <div className="py-8 bg-white">
            <IndustriesSection
              onOpenConsultation={() => handleOpenConsultation('Industry Advisory')}
            />
          </div>
        )}

        {/* VIEW 7: Client Document & Verification Vault Portal */}
        {currentRoute === 'portal' && (
          <ClientPortal />
        )}

        {/* VIEW 8: Contact Page */}
        {currentRoute === 'contact' && (
          <ContactSection />
        )}
      </main>

      {/* Global Navy Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Fixed Mobile Bottom Bar [ CALL ] [ WHATSAPP ] [ CONSULT ] */}
      <MobileBottomBar
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Fixed Floating Contact Panel (Call, WhatsApp, Email) on Left Side */}
      <FloatingContactPanel />

      {/* Fixed Back-to-Top Button on Bottom Right */}
      <ScrollToTopButton />

      {/* Interactive Consultation Appointment Modal */}
      <ConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        defaultService={consultationDefaultService}
      />
    </div>
  );
}
