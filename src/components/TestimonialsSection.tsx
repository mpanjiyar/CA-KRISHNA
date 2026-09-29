import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, ThumbsUp, ShieldCheck, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../data/firmData';

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  content: string;
  date: string;
  verified?: boolean;
}

const STORAGE_KEY = 'panjiyar_client_reviews_v1';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_TESTIMONIALS.map((t, idx) => ({
      id: `default-${idx}`,
      name: t.name,
      role: t.role,
      company: t.company,
      location: t.location,
      rating: t.rating || 5,
      content: t.content,
      date: 'Recent',
      verified: true
    }));
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorCompany, setAuthorCompany] = useState('');
  const [authorLocation, setAuthorLocation] = useState('Mumbai, MH');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-slide carousel gently
  useEffect(() => {
    if (!isAutoPlay || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviews.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlay, reviews.length]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
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

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

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
    <section className="w-full py-8 sm:py-10 bg-gradient-to-b from-[#F7F9FC] to-white border-y border-[#E2E8F0] relative overflow-hidden">
      {/* Subtle modern background accent */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#0969C7]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#F28C18]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 relative z-10">
        
        {/* Compact & Modern Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#062A5A] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Star className="w-4.5 h-4.5 text-[#F28C18] fill-[#F28C18]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-manrope text-base sm:text-lg font-bold text-[#062A5A] tracking-tight">
                  Client Reviews &amp; Trust
                </h3>
                <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ICAI Professional Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                Verified feedback from enterprises, business founders, and professionals across India.
              </p>
            </div>
          </div>

          {/* Right Action: Rating Score badge + Write Review Button */}
          <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs text-xs font-semibold text-slate-800">
              <span className="text-amber-500 font-bold">{avgRating}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-normal">({reviews.length})</span>
            </div>

            <button
              onClick={() => {
                setIsAutoPlay(false);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] active:scale-95 rounded-lg shadow-2xs transition-all border border-[#062A5A] hover:border-[#F28C18]"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Compact 2-Card View with Smooth Slide & Controls */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Active Cards Grid (Shows 2 on md+, 1 on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[0, 1].map((offset) => {
              const itemIdx = (activeIdx + offset) % reviews.length;
              const r = reviews[itemIdx];
              if (!r) return null;

              return (
                <div
                  key={`${r.id}-${itemIdx}`}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group/card hover:border-[#0969C7]/40"
                >
                  <div className="absolute top-0 left-0 h-0.5 w-0 group-hover/card:w-full bg-gradient-to-r from-[#062A5A] via-[#0969C7] to-[#F28C18] transition-all duration-500" />

                  {/* Top rating & verified pill */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Engagement
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal line-clamp-3 mb-3">
                      &ldquo;{r.content}&rdquo;
                    </p>
                  </div>

                  {/* Author Meta */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <h4 className="font-semibold text-slate-900 truncate text-xs">
                        {r.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {r.role} &bull; {r.company}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {r.location}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows & Dot Indicators */}
          <div className="flex items-center justify-between mt-3.5 px-1">
            {/* Dots */}
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
                      ? 'w-5 bg-[#062A5A]'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#062A5A] hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs active:scale-90"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#062A5A] hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs active:scale-90"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive "Write a Review" Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3.5 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 text-left relative animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close review dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-manrope font-bold text-lg text-slate-900 mb-1">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your review and rating have been added to our verified client reviews section.
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

                {/* Rating Stars Input */}
                <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">{rating} / 5</span>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0969C7] focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="e.g. Founder / Finance Manager"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0969C7] focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                </div>

                {/* Company & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={authorCompany}
                      onChange={(e) => setAuthorCompany(e.target.value)}
                      placeholder="e.g. Apex Tech Solutions"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0969C7] focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={authorLocation}
                      onChange={(e) => setAuthorLocation(e.target.value)}
                      placeholder="e.g. Mumbai, MH"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0969C7] focus:ring-1 focus:ring-[#0969C7]"
                    />
                  </div>
                </div>

                {/* Review Textarea */}
                <div className="mb-4">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Your Review &amp; Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Describe how CA Krishna Panjiyar assisted with your tax filing, GST audit, advisory, or business setup..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0969C7] focus:ring-1 focus:ring-[#0969C7] resize-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-lg shadow-sm transition-all"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#F28C18]" />
                    <span>Publish Review</span>
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
