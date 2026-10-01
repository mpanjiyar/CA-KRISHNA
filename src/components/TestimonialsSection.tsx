import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Trash2,
  Quote
} from 'lucide-react';
import { useFirmData, ReviewItem } from '../context/FirmDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export const TestimonialsSection: React.FC = () => {
  const { reviews, addReview, deleteReview } = useFirmData();
  const { isAuthenticated } = useAdminAuth();

  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorCompany, setAuthorCompany] = useState('');
  const [authorLocation, setAuthorLocation] = useState('Mumbai, MH');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // IntersectionObserver for smooth viewport fade-up
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-slide carousel gently
  useEffect(() => {
    if (!isAutoPlay || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, reviews.length]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setActiveIdx((prev) => (prev + 1) % (reviews.length || 1));
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setActiveIdx((prev) => (prev - 1 + reviews.length) % (reviews.length || 1));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewContent.trim()) return;

    const newReview: ReviewItem = {
      id: `user-${Date.now()}`,
      name: authorName.trim(),
      role: authorRole.trim() || 'Client',
      company: authorCompany.trim() || 'Verified Client',
      location: authorLocation.trim() || 'India',
      rating,
      content: reviewContent.trim(),
      date: 'Just now',
      verified: true
    };

    await addReview(newReview);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      // Reset form
      setAuthorName('');
      setAuthorRole('');
      setAuthorCompany('');
      setReviewContent('');
      setRating(5);
      setActiveIdx(0);
    }, 1800);
  };

  // Calculate live average
  const avgRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section 
      ref={sectionRef}
      className={`w-full py-10 sm:py-14 bg-gradient-to-b from-[#F7F9FC] via-white to-[#F7F9FC] border-y border-[#E2E8F0] relative overflow-hidden transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Subtle modern background ambient glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#0969C7]/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#F28C18]/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-[10000ms]" />

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 relative z-10">
        
        {/* Modern Header Bar with Requested Supporting Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-5 border-b border-slate-200/80">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#062A5A] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#062A5A]/10 mt-0.5 group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5 text-[#F28C18] fill-[#F28C18]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-manrope text-lg sm:text-xl font-bold text-[#062A5A] tracking-tight">
                  Client Reviews &amp; Trust
                </h3>
                {/* Floating/Glow Trust Badge */}
                <div className="relative inline-flex items-center">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ICAI Professional Standard
                  </span>
                </div>
              </div>

              {/* Exact Requested Supporting Line */}
              <p className="text-xs sm:text-[13px] font-semibold text-[#0969C7] mt-1 tracking-wide">
                &ldquo;Real experiences. Trusted service. Built on lasting relationships.&rdquo;
              </p>

              <p className="text-[11.5px] text-slate-500 mt-0.5 hidden xs:block">
                Authentic testimonials from corporate directors, business founders &amp; professionals across India.
              </p>
            </div>
          </div>

          {/* Right Action Area: Live Rating Pill & Write a Review Button */}
          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            {/* Soft Glowing Trust Rating Card */}
            <div className="relative group/glow">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/20 to-[#0969C7]/20 rounded-xl blur-xs opacity-70 group-hover/glow:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-[#062A5A] text-sm font-extrabold">{avgRating}</span>
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.3)]" />
                </div>
                <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#062A5A] bg-white border border-[#D9E2EC] hover:bg-[#EEF5FC] hover:border-[#0969C7] hover:text-[#0969C7] rounded-xl shadow-2xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#0969C7]" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid / Carousel Container with Staggered Entrance & Soft Hover Lift */}
        <div className="relative">
          {reviews.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No client reviews published yet. Be the first to share your experience!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {reviews.map((r, idx) => {
                const isMobileActive = idx === activeIdx;
                // Calculate position relative to active on desktop to ensure smooth rotation
                const staggerDelay = `${(idx % 3) * 120}ms`;

                return (
                  <div
                    key={r.id}
                    style={{
                      transitionDelay: isVisible ? staggerDelay : '0ms',
                      transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                      opacity: isVisible ? 1 : 0
                    }}
                    className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#0969C7]/40 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden ${
                      isMobileActive ? 'block' : 'hidden md:flex'
                    }`}
                  >
                    {/* Top Right Subtle Watermark Quote */}
                    <Quote className="absolute top-4 right-4 w-7 h-7 text-slate-100 group-hover:text-[#0969C7]/10 transition-colors pointer-events-none" />

                    <div className="relative z-10">
                      {/* Top Rating with Animated Star Reveal */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => {
                            const isFilled = i < r.rating;
                            return (
                              <span
                                key={i}
                                className="inline-block transition-transform duration-300 ease-out"
                                style={{
                                  transitionDelay: isVisible ? `${(idx % 3) * 100 + i * 40}ms` : '0ms',
                                  transform: isVisible ? 'scale(1)' : 'scale(0.3)'
                                }}
                              >
                                <Star
                                  className={`w-4 h-4 transition-colors ${
                                    isFilled
                                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.25)]'
                                      : 'text-slate-200 fill-slate-200'
                                  }`}
                                />
                              </span>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 group-hover:bg-emerald-100/70 transition-colors">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Engagement
                          </span>

                          {/* Instant Admin Delete Button */}
                          {isAuthenticated && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete review from "${r.name}" (${r.company})?`)) {
                                  await deleteReview(r.id);
                                }
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Admin: Delete this review"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal line-clamp-3 mb-4 group-hover:text-slate-900 transition-colors">
                        &ldquo;{r.content}&rdquo;
                      </p>
                    </div>

                    {/* Author Meta Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
                      <div className="min-w-0 pr-2">
                        <h4 className="font-semibold text-slate-900 truncate text-xs group-hover:text-[#062A5A] transition-colors">
                          {r.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {r.role} &bull; <span className="font-medium text-slate-600">{r.company}</span>
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 group-hover:border-slate-200 transition-colors">
                        {r.location}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Arrows & Dot Indicators */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-between mt-5 px-1">
              {/* Dots with Smooth Expansion */}
              <div className="flex items-center gap-1.5">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsAutoPlay(false);
                      setActiveIdx(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIdx
                        ? 'w-6 bg-[#062A5A] shadow-xs'
                        : 'w-2 bg-slate-300 hover:bg-slate-400 hover:w-3'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons with Tactile Hover */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#062A5A] hover:bg-[#EEF5FC] hover:border-[#0969C7]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-90"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#062A5A] hover:bg-[#EEF5FC] hover:border-[#0969C7]/40 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-90"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Interactive "Write a Review" Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3.5 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-left relative animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Close review dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-manrope font-bold text-lg text-slate-900 mb-1">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your review and rating have been synchronized live to our verified client reviews section.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#F28C18]" />
                  <h4 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A]">
                    Share Your Experience
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Rate your engagement with CA Krishna Panjiyar &amp; Co. (Taxation, GST, Audit, or Advisory).
                </p>

                {/* Rating Stars Input with Interactive Hover Glow */}
                <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Your Rating</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Designation / Role</label>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        placeholder="e.g. Managing Director"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={authorCompany}
                        onChange={(e) => setAuthorCompany(e.target.value)}
                        placeholder="e.g. Pinnacle Infra Ltd."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">City / Location</label>
                      <input
                        type="text"
                        value={authorLocation}
                        onChange={(e) => setAuthorLocation(e.target.value)}
                        placeholder="e.g. Mumbai, MH"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Testimonial *</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Share your experience regarding audit quality, tax savings, prompt filings, or advisory..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
