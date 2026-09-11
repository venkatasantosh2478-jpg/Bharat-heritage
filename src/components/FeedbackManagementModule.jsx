import React, { useState, useEffect } from "react";
import { 
  MessageSquareHeart, Star, Search, Trash2, 
  CheckCircle2, Plus, Download, Sparkles,
  RefreshCw, Phone, Mail
} from "lucide-react";
import { 
  getFeedbackList, saveFeedbackList, updateFeedbackItem, 
  deleteFeedbackItem, addFeedback, INITIAL_FEEDBACK_DATA 
} from "@/lib/feedbackData";

export default function FeedbackManagementModule() {
  const [feedbackList, setFeedbackList] = useState(getFeedbackList);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [newStatusInput, setNewStatusInput] = useState("Reviewed");
  const [notification, setNotification] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "Andhra Pradesh",
    rating: 5,
    category: "General Experience",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const handleUpdate = () => {
      setFeedbackList(getFeedbackList());
    };
    window.addEventListener("by-feedback-updated", handleUpdate);
    return () => window.removeEventListener("by-feedback-updated", handleUpdate);
  }, []);

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2500);
  };

  // Metrics
  const totalSubmissions = feedbackList.length;
  const avgRating = totalSubmissions > 0 
    ? (feedbackList.reduce((acc, f) => acc + (Number(f.rating) || 5), 0) / totalSubmissions).toFixed(1)
    : "5.0";
  const newCount = feedbackList.filter((f) => f.status === "New").length;
  const fiveStarCount = feedbackList.filter((f) => Number(f.rating) === 5).length;
  const satisfactionRate = totalSubmissions > 0
    ? Math.round((feedbackList.filter((f) => Number(f.rating) >= 4).length / totalSubmissions) * 100)
    : 100;

  // Filtered List
  const filtered = feedbackList.filter((item) => {
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (filterRating !== "all" && Number(item.rating) !== Number(filterRating)) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchSubject = item.subject?.toLowerCase().includes(q);
      const matchMsg = item.message?.toLowerCase().includes(q);
      const matchState = item.state?.toLowerCase().includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      if (!matchName && !matchSubject && !matchMsg && !matchState && !matchEmail) return false;
    }
    return true;
  });

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setAdminNoteInput(item.adminNotes || "");
    setNewStatusInput(item.status || "Reviewed");
  };

  const handleSaveNotesAndStatus = () => {
    if (!selectedItem) return;
    const updated = updateFeedbackItem(selectedItem.id, {
      status: newStatusInput,
      adminNotes: adminNoteInput,
    });
    setFeedbackList(updated);
    setSelectedItem({
      ...selectedItem,
      status: newStatusInput,
      adminNotes: adminNoteInput,
    });
    showNotice("Feedback status & admin resolution notes updated!");
  };

  const handleToggleFeatured = (id, currentVal) => {
    const updated = updateFeedbackItem(id, { isFeatured: !currentVal });
    setFeedbackList(updated);
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, isFeatured: !currentVal });
    }
    showNotice(!currentVal ? "Marked as Featured Testimonial!" : "Removed from Featured.");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to remove this feedback record?")) return;
    const updated = deleteFeedbackItem(id);
    setFeedbackList(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
    showNotice("Feedback record deleted.");
  };

  const handleResetToDefaults = () => {
    if (!window.confirm("Restore sample feedback testimonials?")) return;
    saveFeedbackList(INITIAL_FEEDBACK_DATA);
    setFeedbackList(INITIAL_FEEDBACK_DATA);
    showNotice("Sample feedback reviews restored.");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbackList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bharat_yatra_feedback_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualForm.message.trim()) {
      alert("Please enter a feedback message.");
      return;
    }
    addFeedback(manualForm);
    setFeedbackList(getFeedbackList());
    setAddModalOpen(false);
    setManualForm({
      name: "",
      email: "",
      phone: "",
      state: "Andhra Pradesh",
      rating: 5,
      category: "General Experience",
      subject: "",
      message: "",
    });
    showNotice("Feedback review logged successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-rose-500" />
              Tourist Feedback & Quality Assurance Hub
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live repository of traveler ratings, guide reviews, safety evaluations, and suggestions submitted across India.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log Feedback
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-card border border-border text-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-muted cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Data
            </button>
            <button
              onClick={handleResetToDefaults}
              className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {notification && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {notification}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Total Submissions</span>
            <span className="text-2xl font-bold text-foreground font-heading">{totalSubmissions}</span>
            <span className="text-[10px] text-primary block mt-0.5">{newCount} awaiting review</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Average Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-foreground font-heading">{avgRating}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[10px] text-muted-foreground block mt-0.5">{fiveStarCount} 5-star ratings</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Satisfaction Rate</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
              {satisfactionRate}%
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">4★ & 5★ sentiment</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Featured Stories</span>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-heading">
              {feedbackList.filter(f => f.isFeatured).length}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Showcase testimonials</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by traveler name, state, email, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="General Experience">General Experience</option>
            <option value="Guide Service">Guide Service</option>
            <option value="Elder Care & Safety">Elder Care & Safety</option>
            <option value="Artisan Handloom Shop">Artisan Shop</option>
            <option value="Voice Translator">Voice Translator</option>
            <option value="Website / Bug Report">Website / Bug</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium outline-none cursor-pointer"
          >
            <option value="all">All Ratings (★)</option>
            <option value="5">5 Stars (⭐⭐⭐⭐⭐)</option>
            <option value="4">4 Stars (⭐⭐⭐⭐)</option>
            <option value="3">3 Stars (⭐⭐⭐)</option>
            <option value="2">2 Stars (⭐⭐)</option>
            <option value="1">1 Star (⭐)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Action Taken">Action Taken</option>
          </select>
        </div>
      </div>

      {/* Feedback List & Table */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">
            Displaying {filtered.length} Feedback Records
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs">
            No feedback found matching the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filtered.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                  item.status === "New"
                    ? "bg-primary/5 border-primary/30 hover:border-primary"
                    : "bg-card border-border hover:border-border/80 hover:bg-muted/30"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground text-xs">{item.name || "Anonymous"}</span>
                        {item.state && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {item.state}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-foreground block line-clamp-1">
                      {item.subject || item.category}
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      "{item.message}"
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    item.status === "New"
                      ? "bg-rose-500/15 text-rose-600"
                      : item.status === "Action Taken"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-blue-500/15 text-blue-600"
                  }`}>
                    {item.status}
                  </span>

                  <div className="flex items-center gap-1">
                    {item.isFeatured && (
                      <span className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                    <span className="text-[10px] text-primary font-bold hover:underline">
                      View Dossier →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect / Edit Feedback Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground font-heading">
                    Feedback Dossier ({selectedItem.id})
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedItem.status === "New" ? "bg-rose-500/15 text-rose-600" : "bg-emerald-500/15 text-emerald-600"
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  Logged: {selectedItem.submittedAt ? new Date(selectedItem.submittedAt).toLocaleString("en-IN") : "Recent"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tourist Information Card */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground text-sm block">{selectedItem.name}</span>
                  <span className="text-muted-foreground text-[11px] block">{selectedItem.category} • {selectedItem.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (selectedItem.rating || 5) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {(selectedItem.email || selectedItem.phone) && (
                <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground flex-wrap">
                  {selectedItem.email && (
                    <a href={`mailto:${selectedItem.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="w-3 h-3" /> {selectedItem.email}
                    </a>
                  )}
                  {selectedItem.phone && (
                    <a href={`tel:${selectedItem.phone}`} className="flex items-center gap-1 hover:text-primary font-mono">
                      <Phone className="w-3 h-3" /> {selectedItem.phone}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Tourist Review Body */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
              <span className="font-bold text-foreground text-xs block">
                {selectedItem.subject || "Review Message"}
              </span>
              <p className="text-foreground leading-relaxed text-xs">
                "{selectedItem.message}"
              </p>
            </div>

            {/* Admin Management & Resolution Actions */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Quality Assurance & Officer Resolution:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Review Status:</label>
                  <select
                    value={newStatusInput}
                    onChange={(e) => setNewStatusInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-foreground font-semibold outline-none"
                  >
                    <option value="New">New (Unprocessed)</option>
                    <option value="Reviewed">Reviewed & Acknowledged</option>
                    <option value="Action Taken">Action Taken / Resolution Applied</option>
                    <option value="Escalated">Escalated to Field Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Homepage Showcase:</label>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(selectedItem.id, selectedItem.isFeatured)}
                    className={`w-full px-3 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                      selectedItem.isFeatured
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-card border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {selectedItem.isFeatured ? "Featured On Platform" : "Mark As Featured"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  Internal Officer Notes / Corrective Actions:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Verified with Borra Caves guide desk. Added 50 performance points..."
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveNotesAndStatus}
                className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Save Resolution Notes
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border">
              <button
                type="button"
                onClick={() => handleDelete(selectedItem.id)}
                className="px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive font-bold text-xs hover:bg-destructive/20 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Feedback Modal */}
      {addModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setAddModalOpen(false)}
        >
          <div 
            className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground font-heading">
                Log New Tourist Feedback Record
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Traveler Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Category</label>
                  <select
                    value={manualForm.category}
                    onChange={(e) => setManualForm({ ...manualForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  >
                    <option value="General Experience">General Experience</option>
                    <option value="Guide Service">Guide Service</option>
                    <option value="Elder Care & Safety">Elder Care & Safety</option>
                    <option value="Artisan Handloom Shop">Artisan Shop</option>
                    <option value="Hotels & Stays">Hotels & Stays</option>
                    <option value="Voice Translator">Voice Translator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={manualForm.rating}
                    onChange={(e) => setManualForm({ ...manualForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">State</label>
                  <input
                    type="text"
                    value={manualForm.state}
                    onChange={(e) => setManualForm({ ...manualForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91..."
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-muted-foreground block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Review title..."
                  value={manualForm.subject}
                  onChange={(e) => setManualForm({ ...manualForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                />
              </div>

              <div>
                <label className="font-bold text-muted-foreground block mb-1">Review Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Full feedback text..."
                  value={manualForm.message}
                  onChange={(e) => setManualForm({ ...manualForm, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
