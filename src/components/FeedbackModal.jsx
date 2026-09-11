import React, { useState } from "react";
import { 
  MessageSquareHeart, Star, Send, X, CheckCircle2, 
  ShieldCheck
} from "lucide-react";
import { addFeedback } from "@/lib/feedbackData";

const CATEGORIES = [
  "General Experience",
  "Heritage & Sightseeing",
  "Guide Service",
  "Elder Care & Safety",
  "Artisan Handloom Shop",
  "Hotels & Stay Experience",
  "Voice Translator",
  "Website / Bug Report",
  "Other Feedback",
];

export default function FeedbackModal({ isOpen, onClose, defaultCategory = "General Experience" }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState(defaultCategory);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Andhra Pradesh");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    try {
      addFeedback({
        rating,
        category,
        name: name.trim() || "Anonymous Traveler",
        email: email.trim(),
        phone: phone.trim(),
        state,
        subject: subject.trim() || `${category} Review`,
        message: message.trim(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsSubmitting(false);
        onClose();
        // Reset form
        setRating(5);
        setSubject("");
        setMessage("");
      }, 2500);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground font-heading">
                Tourist Feedback & Suggestions
              </h2>
              <p className="text-xs text-muted-foreground">
                Help us improve India's official cultural tourism and traveler safety network.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-foreground">Thank You For Your Feedback!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your review and suggestions have been recorded and forwarded directly to the Bharat Yatra Directorate & Admin Quality Operations team.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Logged to Admin Dashboard
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Star Rating Selection */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center space-y-2">
              <span className="font-bold text-foreground text-xs block">
                How was your experience with Bharat Yatra?
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-semibold text-primary block">
                {rating === 5 && "⭐ Outstanding / World Class"}
                {rating === 4 && "⭐ Very Good & Helpful"}
                {rating === 3 && "⭐ Good / Average"}
                {rating === 2 && "⭐ Needs Improvement"}
                {rating === 1 && "⭐ Poor / Disappointed"}
              </span>
            </div>

            {/* Category selection */}
            <div>
              <label className="block font-bold text-foreground mb-1">Feedback Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subject / Title */}
            <div>
              <label className="block font-bold text-foreground mb-1">Subject / Summary</label>
              <input
                type="text"
                placeholder="e.g. Visakhapatnam tour was wonderful / Elder care check-in review"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Detailed comments */}
            <div>
              <label className="block font-bold text-foreground mb-1">Your Detailed Feedback & Suggestions *</label>
              <textarea
                rows={3}
                required
                placeholder="Share what you liked, guide/hotel experience, or ideas on how we can improve our services..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-foreground mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1">Phone / WhatsApp (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-foreground mb-1">State Visited</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  {["Andhra Pradesh", "Telangana", "Uttar Pradesh", "Delhi", "Rajasthan", "Tamil Nadu", "Karnataka", "Maharashtra", "West Bengal", "Kerala", "Madhya Pradesh", "Gujarat", "Odisha", "Punjab", "Other"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-1.5 hover:opacity-90 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
