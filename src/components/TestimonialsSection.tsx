import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Sparkles, 
  Trash2,
  Quote,
  Pause,
  Play
} from 'lucide-react';
import { useFirmData, ReviewItem } from '../context/FirmDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export const TestimonialsSection: React.FC = () => {
  const { reviews, addReview, deleteReview } = useFirmData();
  const { isAuthenticated } = useAdminAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
    }, 1800);
  };

  // Calculate live average
  const avgRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  // Prepare infinite looping array: duplicate reviews so the horizontal loop is 100% seamless
  // Ensure at least 8 items on track for wide viewports
  const loopMultiplier = reviews.length < 4 ? 4 : 2;
  const loopList: ReviewItem[] = [];
  for (let m = 0; m < loopMultiplier; m++) {
    loopList.push(...reviews);
  }

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

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 relative z-10 mb-6 sm:mb-8">
        
        {/* Modern Header Bar with Requested Supporting Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
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
                Continuous stream of verified feedback from founders, executives &amp; corporate clients across India.
              </p>
            </div>
          </div>

          {/* Right Action Area: Live Rating Pill & Write a Review Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-center shrink-0 flex-wrap">
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

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume continuous slide' : 'Pause review animation'}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#062A5A] hover:bg-slate-50 shadow-2xs transition-colors flex items-center justify-center min-h-[36px] min-w-[36px]"
              aria-label={isPaused ? 'Resume auto-scrolling' : 'Pause auto-scrolling'}
            >
              {isPaused ? <Play size={14} className="text-[#159447] fill-[#159447]" /> : <Pause size={14} />}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#062A5A] bg-white border border-[#D9E2EC] hover:bg-[#EEF5FC] hover:border-[#0969C7] hover:text-[#0969C7] rounded-xl shadow-2xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95 min-h-[36px]"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#0969C7]" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

      </div>

      {/* Infinite Horizontal Carousel Container with Left/Right Smooth Gradient Masks */}
      <div 
        className="relative w-full overflow-hidden marquee-track py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Left Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-[#F7F9FC] via-[#F7F9FC]/90 to-transparent z-20" />
        
        {/* Right Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-[#F7F9FC] via-[#F7F9FC]/90 to-transparent z-20" />

        {reviews.length === 0 ? (
          <div className="max-w-md mx-auto py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No client reviews published yet. Be the first to share your experience!
          </div>
        ) : (
          /* Infinite Moving Continuous Track */
          <div 
            className={`animate-infinite-scroll flex gap-3.5 sm:gap-5 w-max ${
              isPaused ? 'marquee-paused' : ''
            }`}
          >
            {loopList.map((r, idx) => (
              <div
                key={`${r.id}-${idx}`}
                className="w-[260px] xs:w-[300px] sm:w-[350px] md:w-[380px] shrink-0 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-[#0969C7]/40 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden select-none cursor-grab active:cursor-grabbing text-left"
              >
                {/* Subtle Quote Watermark Accent */}
                <Quote className="absolute top-3.5 right-3.5 w-6 h-6 sm:w-7 sm:h-7 text-slate-100 group-hover:text-[#0969C7]/15 transition-colors pointer-events-none" />

                <div className="relative z-10">
                  {/* Rating Stars & Verified Badge */}
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 transition-colors ${
                            i < r.rating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.25)]'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 group-hover:bg-emerald-100/70 transition-colors">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        Verified
                      </span>

                      {/* Instant Admin Delete Button */}
                      {isAuthenticated && (
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete review from "${r.name}" (${r.company})?`)) {
                              await deleteReview(r.id);
                            }
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Admin: Delete this review"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-[11.5px] sm:text-[13px] text-slate-700 leading-snug sm:leading-relaxed font-normal line-clamp-3 mb-3 sm:mb-4 group-hover:text-slate-900 transition-colors">
                    &ldquo;{r.content}&rdquo;
                  </p>
                </div>

                {/* Author Meta Footer */}
                <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-semibold text-slate-900 truncate text-[11px] sm:text-xs group-hover:text-[#062A5A] transition-colors">
                      {r.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                      {r.role} &bull; <span className="font-medium text-slate-600">{r.company}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-[9.5px] sm:text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 group-hover:border-slate-200 transition-colors">
                    {r.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subtle Hint Bar under carousel */}
      <div className="max-w-7xl mx-auto px-4 mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span className="hidden xs:inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#159447] animate-pulse" />
          Continuous infinite loop &middot; Hover or tap to pause
        </span>
        <span className="text-[10.5px] xs:text-[11px] text-slate-400/90 ml-auto">
          Reviews are verified under ICAI engagement guidelines
        </span>
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
                  Your review has been added to our live verified customer loop.
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
