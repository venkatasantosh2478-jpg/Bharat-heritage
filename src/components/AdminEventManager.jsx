import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, Plus, Pencil, X, Loader2, 
  CheckCircle2, Upload, CalendarDays, TableProperties
} from "lucide-react";
import EventCalendarView from "@/components/EventCalendarView";
import EntityEditor from "@/components/EntityEditor";
import { base44 } from "@/api/base44Client";
import { events as staticEvents } from "@/lib/heritageData";
import { 
  saveCardImageReplacement, 
  compressImageFile, 
  applyCustomImagesToList 
} from "./lib/cardImageManager";

const HERITAGE_PHOTO_PRESETS = [
  { label: "Festive Diya & Ghats", url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80" },
  { label: "Pushkar & Desert Fair", url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80" },
  { label: "Temple & Sacred Arts", url: "https://images.unsplash.com/photo-1599831104321-47752697b483?w=800&auto=format&fit=crop&q=80" },
  { label: "Cultural Dance & Drama", url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80" },
  { label: "Artisan Handloom Fair", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80" },
  { label: "Regional Food Festival", url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80" },
];

export default function AdminEventManager({ eventFields }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "table"
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: "", type: "success" });

  const storageKey = "by-admin-entity-events";

  // Load events from Base44 / localStorage / static catalog
  const loadEvents = async () => {
    setLoading(true);
    try {
      let list = [];
      if (base44?.entities?.events?.list) {
        try {
          list = await base44.entities.events.list("-created_date", 100);
        } catch (err) {
          console.warn("Base44 events fetch warning:", err);
        }
      }

      if (!list || list.length === 0) {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            list = JSON.parse(saved);
          } catch {
            list = [];
          }
        }
      }

      if (!list || list.length === 0) {
        list = staticEvents.map((item, idx) => ({
          id: item.id || `event-${idx + 1}`,
          ...item,
          category: item.category || "Festivals",
        }));
        localStorage.setItem(storageKey, JSON.stringify(list));
      }

      setEvents(applyCustomImagesToList(list || []));
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    const handleUpdated = (e) => {
      setTimeout(() => {
        if (e?.detail && Array.isArray(e.detail)) {
          setEvents(e.detail);
        } else {
          loadEvents();
        }
      }, 0);
    };

    window.addEventListener("by-events-updated", handleUpdated);
    return () => window.removeEventListener("by-events-updated", handleUpdated);
  }, []);

  const notify = (text, type = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg({ text: "", type: "success" }), 4000);
  };

  // Open modal for new event (optionally with pre-selected date)
  const handleOpenNewEvent = (prefilledDate = "") => {
    let derivedMonth = "October";
    if (prefilledDate) {
      const parts = prefilledDate.split("-");
      if (parts.length === 3) {
        const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        if (!isNaN(d.getTime())) {
          derivedMonth = d.toLocaleString("default", { month: "long" });
        }
      }
    }

    setEditingEvent({
      id: "",
      name: "",
      date: prefilledDate || "2026-10-20",
      category: "Culture",
      month: derivedMonth,
      state: "Rajasthan",
      city: "",
      timing: "07:00 AM – 09:00 PM",
      dress: "Traditional ethnic attire / Modest wear",
      rules: "Free public admission; respect local temple guidelines",
      history: "",
      image: HERITAGE_PHOTO_PRESETS[0].url,
    });
    setModalOpen(true);
  };

  // Open modal for editing existing event
  const handleEditEvent = (ev) => {
    setEditingEvent({ ...ev });
    setModalOpen(true);
  };

  // Delete event
  const handleDeleteEvent = async (ev) => {
    if (!window.confirm(`Are you sure you want to remove "${ev.name}" from the calendar?`)) {
      return;
    }

    try {
      if (base44?.entities?.events?.delete && ev.id) {
        try {
          await base44.entities.events.delete(ev.id);
        } catch (e) {
          console.warn("Base44 delete failed, falling back to local:", e);
        }
      }

      const updated = events.filter((e) => e.id !== ev.id);
      setEvents(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("by-events-updated", { detail: updated }));
      notify(`Removed "${ev.name}" from calendar.`);
    } catch (err) {
      notify(err.message || "Failed to delete event", "error");
    }
  };

  // Upload custom event image
  const handleUploadImage = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      if (base44?.integrations?.Core?.UploadFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setEditingEvent((prev) => ({ ...prev, image: file_url }));
        notify("Image uploaded successfully!");
      } else {
        // Compress image to lightweight WebP data URL to save browser quota
        const compressedBase64 = await compressImageFile(file, 800, 0.8);
        setEditingEvent((prev) => ({ ...prev, image: compressedBase64 }));
        notify("Image uploaded & compressed successfully!");
      }
    } catch (e) {
      notify("Upload failed: " + (e?.message || "Unknown error"), "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Save event
  const handleSaveEvent = async (e) => {
    e?.preventDefault();
    if (!editingEvent.name?.trim()) {
      notify("Please enter a festival/event name.", "error");
      return;
    }

    setSaving(true);
    try {
      const record = { ...editingEvent };
      if (!record.id) {
        record.id = `event-${Date.now()}`;
      }

      // Automatically sync month name if date is provided
      if (record.date) {
        const parts = record.date.split("-");
        if (parts.length === 3) {
          const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
          if (!isNaN(d.getTime())) {
            record.month = d.toLocaleString("default", { month: "long" });
          }
        }
      }

      // Sync image to cardImageManager mapping for consistent cross-app resolution
      if (record.image) {
        saveCardImageReplacement({
          id: record.id,
          name: record.name,
          type: "event",
          newImageUrl: record.image,
        });
      }

      // Try Base44 update / create
      try {
        if (editingEvent.id && events.some((x) => x.id === editingEvent.id)) {
          if (base44?.entities?.events?.update) {
            await base44.entities.events.update(record.id, record);
          }
        } else if (base44?.entities?.events?.create) {
          await base44.entities.events.create(record);
        }
      } catch (err) {
        console.warn("Base44 remote save warning:", err);
      }

      // Update local storage and broadcast
      let updated;
      const existsIndex = events.findIndex((x) => x.id === record.id);
      if (existsIndex >= 0) {
        updated = [...events];
        updated[existsIndex] = record;
      } else {
        updated = [record, ...events];
      }

      setEvents(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("by-events-updated", { detail: updated }));

      setModalOpen(false);
      setEditingEvent(null);
      notify(`Event "${record.name}" successfully published to calendar!`);
    } catch (err) {
      notify(err?.message || "Failed to save event", "error");
    } finally {
      setSaving(false);
    }
  };

  // Calculate quick summary metrics
  const stats = {
    total: events.length,
    culture: events.filter((e) => (e.category || "").toLowerCase() === "culture").length,
    food: events.filter((e) => (e.category || "").toLowerCase() === "food").length,
    festivals: events.filter((e) => (e.category || "").toLowerCase() === "festivals").length,
    crafts: events.filter((e) => (e.category || "").toLowerCase() === "crafts").length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                Cultural Festivals & Event Calendar Manager
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Schedule, publish, and manage pan-India living heritage festivals, temple utsavam, food melas, and artisan events directly on the calendar.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-2xl bg-muted p-1 border border-border text-xs">
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "calendar"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                <span>Interactive Calendar</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableProperties className="w-3.5 h-3.5 text-amber-500" />
                <span>Catalog Table</span>
              </button>
            </div>

            {/* Primary Add Event Button */}
            <button
              type="button"
              onClick={() => handleOpenNewEvent()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-primary/90 transition-all cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event to Calendar</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg.text && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn ${
              feedbackMsg.type === "error"
                ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
            <button onClick={() => setFeedbackMsg({ text: "", type: "success" })}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-border">
          <div className="p-3 rounded-2xl bg-muted/30 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Total Listed</span>
            <span className="text-lg font-bold text-foreground">{stats.total} Events</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 block">🎭 Culture</span>
            <span className="text-lg font-bold text-foreground">{stats.culture}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 block">🍲 Food</span>
            <span className="text-lg font-bold text-foreground">{stats.food}</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 block">🪔 Festivals</span>
            <span className="text-lg font-bold text-foreground">{stats.festivals}</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block">🎨 Crafts</span>
            <span className="text-lg font-bold text-foreground">{stats.crafts}</span>
          </div>
        </div>
      </div>

      {/* Main View Mode Area */}
      {viewMode === "calendar" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Live Admin Calendar & Schedule
            </span>
            <span className="text-xs text-muted-foreground">
              Tip: Click any day or event to manage, edit, or schedule.
            </span>
          </div>

          <EventCalendarView
            events={events}
            onAddEvent={handleOpenNewEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            isAdmin={true}
          />
        </div>
      ) : (
        <EntityEditor
          entityName="events"
          title="Cultural Festivals & Events Catalog"
          description="Direct catalog view for batch editing, metadata updates, and inventory management."
          fields={eventFields}
          initialData={events}
        />
      )}

      {/* Add / Edit Event Modal Dialog */}
      {modalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
                  {editingEvent.id ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
                <div>
                  <h3 className="font-bold text-base text-foreground font-heading">
                    {editingEvent.id ? "Edit Cultural Event Details" : "Add New Event to Calendar"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure dates, cultural background, dress guidelines, and entry rules.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingEvent(null);
                }}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Event Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Festival / Event Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.name || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                    placeholder="e.g. Pushkar Camel Fair, Konark Dance Festival"
                    className="by-input"
                  />
                </div>

                {/* Calendar Date */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Calendar Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date || ""}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      let derivedMonth = editingEvent.month;
                      if (newDate) {
                        const parts = newDate.split("-");
                        if (parts.length === 3) {
                          const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
                          if (!isNaN(d.getTime())) {
                            derivedMonth = d.toLocaleString("default", { month: "long" });
                          }
                        }
                      }
                      setEditingEvent({ ...editingEvent, date: newDate, month: derivedMonth });
                    }}
                    className="by-input"
                  />
                </div>

                {/* Category / Type */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Event Type / Tag <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingEvent.category || "Culture"}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="by-input"
                  >
                    <option value="Culture">Culture (Dance, Heritage & Arts)</option>
                    <option value="Food">Food (Regional Sweets & Culinary Melas)</option>
                    <option value="Festivals">Festivals (Spiritual & Temple Utsavam)</option>
                    <option value="Crafts">Crafts (Artisan & Handloom Bazaars)</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    State / Territory <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.state || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, state: e.target.value })}
                    placeholder="e.g. Rajasthan, Kerala, West Bengal"
                    className="by-input"
                  />
                </div>

                {/* City / Region */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    City / Landmark Town
                  </label>
                  <input
                    type="text"
                    value={editingEvent.city || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
                    placeholder="e.g. Pushkar, Mysore, Puri, Varanasi"
                    className="by-input"
                  />
                </div>

                {/* Month / Season */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Month / Visiting Season
                  </label>
                  <input
                    type="text"
                    value={editingEvent.month || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, month: e.target.value })}
                    placeholder="e.g. October, November, Year-round"
                    className="by-input"
                  />
                </div>

                {/* Timing */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Festival Timing & Daily Hours
                  </label>
                  <input
                    type="text"
                    value={editingEvent.timing || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timing: e.target.value })}
                    placeholder="e.g. 06:00 AM – 09:00 PM, Evening Aarti 06:30 PM"
                    className="by-input"
                  />
                </div>

                {/* Dress Code */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Dress Code & Traditional Attire
                  </label>
                  <input
                    type="text"
                    value={editingEvent.dress || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dress: e.target.value })}
                    placeholder="e.g. Traditional ethnic sarees / Kurta pyjama; modest shoulder and knee coverings"
                    className="by-input"
                  />
                </div>

                {/* Entry Rules */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Entry Rules, Permits & Etiquette
                  </label>
                  <input
                    type="text"
                    value={editingEvent.rules || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, rules: e.target.value })}
                    placeholder="e.g. Free public entry; photography permits required near main sanctum"
                    className="by-input"
                  />
                </div>

                {/* History & Significance */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Cultural Significance & Heritage Story
                  </label>
                  <textarea
                    rows={3}
                    value={editingEvent.history || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, history: e.target.value })}
                    placeholder="Share the mythological, historical, and living cultural significance of this festival..."
                    className="by-input resize-none"
                  />
                </div>

                {/* Image URL & Presets */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-foreground">
                    Festival Banner Image
                  </label>
                  <input
                    type="text"
                    value={editingEvent.image || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="by-input"
                  />

                  {/* Photo Presets */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="text-[11px] text-muted-foreground shrink-0 font-medium">Presets:</span>
                    {HERITAGE_PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditingEvent({ ...editingEvent, image: preset.url })}
                        className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[11px] font-medium text-foreground shrink-0 cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* File Upload & Preview */}
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold cursor-pointer hover:bg-primary/20 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImage ? "Uploading…" : "Upload photo file"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadImage(e.target.files?.[0])}
                      />
                    </label>

                    {editingEvent.image && (
                      <div className="flex items-center gap-2">
                        <img
                          src={editingEvent.image}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-xl border border-border"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[11px] text-muted-foreground">Banner preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEvent.id ? "Save Changes" : "Publish to Calendar"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
